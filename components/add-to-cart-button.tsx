"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsAdding(true)
    await addItem(product, quantity)
    setIsAdding(false)
    setQuantity(1)
    router.push('/checkout')
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(q => q + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0 || isAdding}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className={cn("px-4", isInWishlist(product.id) && "text-red-500")}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-current")} />
          <span className="sr-only">Add to wishlist</span>
        </Button>
        <Button variant="outline" size="lg" className="px-4">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </div>
  )
}
