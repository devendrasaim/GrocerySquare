import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Providers } from '@/components/providers'
import type { Product } from '@/lib/types'

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
  return data || []
}

export const metadata = {
  title: 'Featured Products - Grocery Square',
  description: 'Handpicked featured products at Grocery Square.',
}

export default async function FeaturedPage() {
  const products = await getFeaturedProducts()

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
                <span className="font-medium">Featured Products</span>
              </nav>
            </div>
          </div>

          {/* Header Banner */}
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-6 w-6 fill-current" />
                <span className="font-semibold uppercase tracking-wide text-sm">Staff Picks</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
                Featured Products
              </h1>
              <p className="text-lg opacity-90">
                Handpicked by our team — the best of what we carry
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="container mx-auto px-4 py-12">
            {products.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  {products.length} featured {products.length === 1 ? 'product' : 'products'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No featured products right now</h2>
                <p className="text-muted-foreground">Check back soon!</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
