import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Providers } from '@/components/providers'
import { Button } from '@/components/ui/button'
import type { WishlistItem } from '@/lib/types'

async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('wishlists')
    .select('*, product:products(*, category:categories(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data || []
}

export const metadata = {
  title: 'Wishlist - Grocery Square',
  description: 'View your saved items at Grocery Square.',
}

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/wishlist')
  }

  const wishlistItems = await getWishlistItems(user.id)

  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="bg-muted/30 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Wishlist</span>
              </nav>
            </div>
          </div>

          {/* Wishlist Content */}
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Save items you love by clicking the heart icon on any product.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {wishlistItems.map((item) => (
                    item.product && <ProductCard key={item.id} product={item.product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
