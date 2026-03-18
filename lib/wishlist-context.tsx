"use client"

import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase/client'
import type { WishlistItem } from '@/lib/types'

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  toggleWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

async function fetchWishlistItems(): Promise<WishlistItem[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { data: items = [], isLoading } = useSWR<WishlistItem[]>('wishlist-items', fetchWishlistItems)
  
  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId)
  }, [items])
  
  const toggleWishlist = useCallback(async (productId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      window.location.href = '/auth/login?redirect=' + window.location.pathname
      return
    }
    
    const existingItem = items.find(item => item.product_id === productId)
    
    if (existingItem) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('id', existingItem.id)
    } else {
      await supabase
        .from('wishlists')
        .insert({ user_id: user.id, product_id: productId })
    }
    
    mutate('wishlist-items')
  }, [items])
  
  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      toggleWishlist,
      isInWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
