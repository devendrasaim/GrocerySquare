import { createContext, useContext, useCallback, useMemo, useState, useEffect, type ReactNode } from 'react'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { CartItem, Product } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  itemCount: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

async function fetchCartItems(): Promise<CartItem[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: serverItems = [], isLoading: isServerLoading } = useSWR<CartItem[]>('cart-items', fetchCartItems)
  const [localItems, setLocalItems] = useState<CartItem[]>([])
  const [isLocalLoading, setIsLocalLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // Load guest cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('guest-cart')
    if (saved) {
      setLocalItems(JSON.parse(saved))
    }
    setIsLocalLoading(false)

    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        mutate('cart-items')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isLocalLoading && !user) {
      localStorage.setItem('guest-cart', JSON.stringify(localItems))
    }
  }, [localItems, user, isLocalLoading])

  // Merge items logic
  const items = useMemo(() => {
    if (user) return serverItems
    return localItems
  }, [user, serverItems, localItems])

  const itemCount = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  )
  
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => {
      const price = item.product?.sale_price || item.product?.price || 0
      return sum + (price * item.quantity)
    }, 0), 
    [items]
  )
  
  const addItem = useCallback(async (product: Product, quantity = 1) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      const existing = localItems.find(i => i.product_id === product.id)
      if (existing) {
        setLocalItems(prev => prev.map(i => 
          i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        ))
      } else {
        const newItem: CartItem = {
          id: `local-${Date.now()}`,
          user_id: 'guest',
          product_id: product.id,
          quantity,
          created_at: new Date().toISOString(),
          product
        }
        setLocalItems(prev => [newItem, ...prev])
      }
      return
    }
    
    // Optimistic Update
    mutate('cart-items', (currentItems: CartItem[] = []) => {
      const existing = currentItems.find(i => i.product_id === product.id)
      if (existing) {
        return currentItems.map(i => 
          i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      const newItem: CartItem = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        product_id: product.id,
        quantity,
        created_at: new Date().toISOString(),
        product
      }
      return [newItem, ...currentItems]
    }, false)

    // Server-side add
    const existingItem = serverItems.find(item => item.product_id === product.id)
    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: product.id, quantity })
    }
    mutate('cart-items')
  }, [localItems, serverItems])
  
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      if (quantity <= 0) {
        setLocalItems(prev => prev.filter(i => i.id !== itemId))
      } else {
        setLocalItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
      }
      return
    }

    // Optimistic Update
    mutate('cart-items', (currentItems: CartItem[] = []) => {
      if (quantity <= 0) {
        return currentItems.filter(i => i.id !== itemId)
      }
      return currentItems.map(i => i.id === itemId ? { ...i, quantity } : i)
    }, false)

    try {
      if (quantity <= 0) {
        await supabase.from('cart_items').delete().eq('id', itemId)
      } else {
        await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
      }
      mutate('cart-items')
    } catch (error) {
      // Revert on error
      mutate('cart-items')
      console.error('Failed to update quantity:', error)
    }
  }, [])
  
  const removeItem = useCallback(async (itemId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLocalItems(prev => prev.filter(i => i.id !== itemId))
      return
    }

    await supabase.from('cart_items').delete().eq('id', itemId)
    mutate('cart-items')
  }, [])
  
  const clearCart = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id)
      mutate('cart-items')
    } else {
      setLocalItems([])
    }
  }, [])
  
  return (
    <CartContext.Provider value={{
      items,
      isLoading: user ? isServerLoading : isLocalLoading,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
