import Link from 'next/link'
import { ChevronRight, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Providers } from '@/components/providers'
import type { Product } from '@/lib/types'

async function getNewProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(60)
  return data || []
}

export const metadata = {
  title: 'New Arrivals - Grocery Square',
  description: 'The latest products to arrive at Grocery Square.',
}

export default async function NewArrivalsPage() {
  const products = await getNewProducts()

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
                <span className="font-medium">New Arrivals</span>
              </nav>
            </div>
          </div>

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-primary text-white py-12">
            <div className="container mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-6 w-6" />
                <span className="font-semibold uppercase tracking-wide text-sm">Just Landed</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
                New Arrivals
              </h1>
              <p className="text-lg opacity-90">
                Fresh additions to our shelves — be the first to try them
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="container mx-auto px-4 py-12">
            {products.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Nothing new yet</h2>
                <p className="text-muted-foreground">Check back soon for new arrivals!</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
