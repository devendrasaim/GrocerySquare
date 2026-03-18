"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Heart, Leaf, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
}

// Returns "$1.60/lb" for a "10 lb" unit at $15.99, null otherwise
function getUnitPrice(price: number, unit: string): string | null {
  const match = unit.match(/^(\d+(?:\.\d+)?)\s*(lb|oz|kg|g|gallon|gal|qt|L|ml)s?$/i)
  if (!match) return null
  const qty = parseFloat(match[1])
  if (qty <= 1) return null
  const base = match[2].toLowerCase().replace('gallon', 'gal')
  return `$${(price / qty).toFixed(2)}/${base}`
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const isOnSale = product.sale_price && product.sale_price < product.price
  const displayPrice = isOnSale ? product.sale_price! : product.price
  const discount = isOnSale
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0
  const unitPrice = getUnitPrice(displayPrice, product.unit)
  const filledStars = product.review_count > 0 ? Math.round(product.rating) : 0

  const cartItem = items.find(i => i.product_id === product.id)
  const cartQty = cartItem?.quantity ?? 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addItem(product)
  }

  const handleIncrease = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (cartItem) {
      await updateQuantity(cartItem.id, cartQty + 1)
    } else {
      await addItem(product)
    }
  }

  const handleDecrease = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (cartItem) {
      await updateQuantity(cartItem.id, cartQty - 1)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleWishlist(product.id)
  }

  const isFavorited = isInWishlist(product.id)

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${product.slug}`}>
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {isOnSale && (
            <Badge className="bg-secondary text-secondary-foreground">
              {discount}% OFF
            </Badge>
          )}
          {product.is_organic && (
            <Badge variant="outline" className="bg-background text-primary border-primary">
              <Leaf className="h-3 w-3 mr-1" />
              Organic
            </Badge>
          )}
          {product.is_snap_eligible && (
            <Badge variant="outline" className="bg-background text-green-700 border-green-600 text-[10px] px-1.5 py-0">
              SNAP
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 z-10 bg-background/80 hover:bg-background transition-opacity",
            isFavorited ? "opacity-100 text-red-500" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={handleToggleWishlist}
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
          <span className="sr-only">
            {isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          </span>
        </Button>

        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image_url || `/products/${product.slug}.png`}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.visibility = 'hidden'
            }}
          />
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="mb-3 min-h-[4rem]">
            <h3 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-0.5">
                {product.brand}
              </p>
            )}
            {/* Star Rating */}
            {product.review_count > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={cn(
                        'h-3 w-3',
                        n <= filledStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-muted-foreground/10 text-muted-foreground/20'
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  ({product.review_count >= 1000
                    ? `${(product.review_count / 1000).toFixed(1)}k`
                    : product.review_count})
                </span>
              </div>
            )}
          </div>

          {/* Price & Add to Cart */}
          <div className="flex flex-wrap items-end justify-between gap-y-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline flex-wrap gap-x-1.5">
                <span className="text-base font-bold text-primary whitespace-nowrap">
                  ${displayPrice.toFixed(2)}
                </span>
                {isOnSale && (
                  <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="min-h-[1.25rem]">
                {unitPrice ? (
                  <p className="text-[10px] text-muted-foreground leading-tight">{unitPrice} · {product.unit}</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground leading-tight">{product.unit}</p>
                )}
              </div>
            </div>

            {showAddToCart && product.stock_quantity > 0 && (
              <div className="relative shrink-0">
                <AnimatePresence mode="wait">
                  {cartQty > 0 ? (
                    <motion.div
                      key="stepper"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="flex items-center bg-white border border-primary/20 rounded-lg shadow-sm overflow-hidden"
                      onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation() }}
                    >
                      <button
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors shrink-0"
                        onClick={handleDecrease}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-x border-primary/10 shrink-0">
                        <span className="text-sm font-bold text-foreground">{cartQty}</span>
                      </div>
                      <button
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors shrink-0"
                        onClick={handleIncrease}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add-button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        size="sm"
                        className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95 flex-shrink-0"
                        onClick={handleAddToCart}
                      >
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Add to cart</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {product.stock_quantity === 0 && (
            <p className="text-xs text-destructive mt-2">Out of stock</p>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
