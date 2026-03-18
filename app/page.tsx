import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/hero-section'
import { CategoryGrid } from '@/components/category-grid'
import { FeaturedProducts } from '@/components/featured-products'
import { DealsBanner } from '@/components/deals-banner'
import { Providers } from '@/components/providers'
import type { Category, Product } from '@/lib/types'

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
  return data || []
}

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_featured', true)
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(12)
  return data || []
}

async function getDealsProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .not('sale_price', 'is', null)
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(12)
  return data || []
}

async function getNewProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(12)
  return data || []
}

export default async function HomePage() {
  const [categories, featuredProducts, dealsProducts, newProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getDealsProducts(),
    getNewProducts(),
  ])

  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          
          <CategoryGrid categories={categories} />
          
          {featuredProducts.length > 0 && (
            <FeaturedProducts
              title="Featured Products"
              products={featuredProducts}
              viewAllHref="/featured"
            />
          )}
          
          <DealsBanner />
          
          {dealsProducts.length > 0 && (
            <FeaturedProducts
              title="This Week's Deals"
              products={dealsProducts}
              viewAllHref="/deals"
              viewAllLabel="See All Deals"
            />
          )}
          
          {newProducts.length > 0 && (
            <FeaturedProducts
              title="New Arrivals"
              products={newProducts}
              viewAllHref="/new"
            />
          )}
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
