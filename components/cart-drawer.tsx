"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Plus, Minus, X, Truck } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'

const FREE_DELIVERY_THRESHOLD = 50

export function CartDrawer() {
  const { items, itemCount, subtotal, updateQuantity, removeItem } = useCart()
  const [open, setOpen] = useState(false)

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 5.99
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary text-secondary-foreground">
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}
          <span className="sr-only">Cart ({itemCount} items)</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 py-4 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            My Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-1 font-normal">{itemCount} items</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="text-6xl select-none">🛒</div>
            <h3 className="font-semibold text-lg">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add items to get started</p>
            <Button className="mt-2" asChild onClick={() => setOpen(false)}>
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free delivery progress bar */}
            {remaining > 0 && (
              <div className="px-5 py-3 bg-muted/40 border-b shrink-0">
                <div className="flex items-center gap-2 mb-1.5 text-xs text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Add <strong className="text-foreground">${remaining.toFixed(2)}</strong> more for free delivery</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= FREE_DELIVERY_THRESHOLD && (
              <div className="px-5 py-2.5 bg-primary/5 border-b shrink-0 flex items-center gap-2 text-xs text-primary font-medium">
                <Truck className="h-3.5 w-3.5" />
                You qualify for free delivery!
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => {
                const product = item.product
                if (!product) return null
                const price = product.sale_price ?? product.price

                return (
                  <div key={item.id} className="flex gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/50">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden' }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 leading-snug">{product.name}</p>
                      {product.brand && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mt-0.5">{product.brand}</p>
                      )}
                      <p className="text-sm font-bold text-primary mt-1">
                        ${(price * item.quantity).toFixed(2)}
                        {item.quantity > 1 && (
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            (${price.toFixed(2)} each)
                          </span>
                        )}
                      </p>

                      {/* Stepper */}
                      <div
                        className="flex items-center mt-2 border border-border rounded-lg w-fit overflow-hidden"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                      >
                        <button
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold select-none">{item.quantity}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors self-start shrink-0 p-0.5"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="border-t px-5 py-4 space-y-3 shrink-0 bg-background">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-primary font-medium' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base pt-0.5">
                  <span>Estimated Total</span>
                  <span>${(subtotal + deliveryFee).toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full h-11 text-base font-semibold"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href="/cart">View Full Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
