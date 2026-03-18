import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { Providers } from '@/components/providers'
import type { Product } from '@/lib/types'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return []

  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
    .gt('stock_quantity', 0)
    .order('is_featured', { ascending: false })
    .limit(50)

  return data || []
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  return {
    title: q ? `Search: ${q} - Grocery Square` : 'Search - Grocery Square',
    description: q ? `Search results for "${q}" at Grocery Square` : 'Search products at Grocery Square',
  }
}

const SUGGESTED_SEARCHES = ['Milk', 'Eggs', 'Chicken Breast', 'Basmati Rice', 'Bananas', 'Bread', 'Yogurt', 'Butter']

const BROWSE_CATEGORIES = [
  { emoji: '🥦', name: 'Produce', slug: 'fresh-produce' },
  { emoji: '🥚', name: 'Dairy', slug: 'dairy-eggs' },
  { emoji: '🥩', name: 'Meat', slug: 'meat-seafood' },
  { emoji: '🍛', name: 'South Asian', slug: 'south-asian' },
  { emoji: '🥤', name: 'Beverages', slug: 'beverages' },
  { emoji: '🧊', name: 'Frozen', slug: 'frozen-foods' },
]

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams
  const products = query ? await searchProducts(query) : []

  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="bg-muted/30 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">
                  {query ? `Search: "${query}"` : 'Search'}
                </span>
              </nav>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {query ? (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    Results for &ldquo;{query}&rdquo;
                  </h1>
                  <p className="text-muted-foreground">
                    {products.length} {products.length === 1 ? 'result' : 'results'} found
                  </p>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="max-w-lg mx-auto py-16 text-center">
                    <div className="text-7xl mb-6 select-none">🔍</div>
                    <h2 className="text-2xl font-bold mb-2">No results for &ldquo;{query}&rdquo;</h2>
                    <p className="text-muted-foreground mb-8">
                      We couldn&apos;t find that product. Try a different spelling or browse our categories.
                    </p>
                    <div className="mb-8">
                      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Try searching for</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {SUGGESTED_SEARCHES.map((term) => (
                          <Link
                            key={term}
                            href={`/search?q=${encodeURIComponent(term)}`}
                            className="px-4 py-1.5 text-sm bg-muted hover:bg-muted/70 rounded-full transition-colors font-medium"
                          >
                            {term}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Or browse by category</p>
                      <div className="grid grid-cols-3 gap-2">
                        {BROWSE_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
                          >
                            <span className="text-2xl">{cat.emoji}</span>
                            <span className="text-xs font-medium">{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-lg mx-auto py-16 text-center">
                <div className="text-7xl mb-6 select-none">🛒</div>
                <h1 className="text-2xl font-bold mb-2">What are you looking for?</h1>
                <p className="text-muted-foreground mb-8">
                  Search thousands of products from our store
                </p>
                <div className="mb-8">
                  <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Popular searches</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_SEARCHES.map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        className="px-4 py-1.5 text-sm bg-muted hover:bg-muted/70 rounded-full transition-colors font-medium"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Shop by category</p>
                  <div className="grid grid-cols-3 gap-2">
                    {BROWSE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors"
                      >
                        <span className="text-2xl">{cat.emoji}</span>
                        <span className="text-xs font-medium">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
