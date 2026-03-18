import Link from 'next/link'
import { ChevronRight, Apple, Milk, Croissant, Beef, Coffee, Cookie, Snowflake, Home, Flame, ShoppingBag, Sparkles, HeartPulse } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { stripLeadingEmoji } from '@/lib/utils'
import type { Category } from '@/lib/types'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'fresh-produce': Apple,
  'dairy-eggs': Milk,
  'bakery': Croissant,
  'meat-seafood': Beef,
  'beverages': Coffee,
  'snacks': Cookie,
  'frozen-foods': Snowflake,
  'household': Home,
  'south-asian': Flame,
  'cafe-curry': ShoppingBag,
  'pantry-staples': Sparkles,
  'personal-care': HeartPulse,
}

const CATEGORY_COLORS: Record<string, string> = {
  'fresh-produce': 'bg-green-100 text-green-700',
  'dairy-eggs': 'bg-blue-100 text-blue-700',
  'bakery': 'bg-amber-100 text-amber-700',
  'meat-seafood': 'bg-red-100 text-red-700',
  'beverages': 'bg-orange-100 text-orange-700',
  'snacks': 'bg-yellow-100 text-yellow-700',
  'frozen-foods': 'bg-cyan-100 text-cyan-700',
  'household': 'bg-purple-100 text-purple-700',
  'south-asian': 'bg-orange-100 text-orange-700',
  'cafe-curry': 'bg-rose-100 text-rose-700',
  'pantry-staples': 'bg-lime-100 text-lime-700',
  'personal-care': 'bg-pink-100 text-pink-700',
}

async function getCategoriesWithCount(): Promise<(Category & { product_count: number })[]> {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (!categories) return []
  
  // Get product counts for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .gt('stock_quantity', 0)
      
      return {
        ...category,
        product_count: count || 0,
      }
    })
  )
  
  return categoriesWithCount
}

export const metadata = {
  title: 'All Categories - Grocery Square',
  description: 'Browse all product categories at Grocery Square.',
}

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCount()

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
                <span className="font-medium">Categories</span>
              </nav>
            </div>
          </div>

          {/* Categories Content */}
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Categories</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                const IconComponent = CATEGORY_ICONS[category.slug] || Apple
                const colorClasses = CATEGORY_COLORS[category.slug] || 'bg-gray-100 text-gray-700'
                
                return (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <Card className="h-full hover:border-primary transition-colors">
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-2 ${colorClasses}`}>
                          <IconComponent className="h-8 w-8" />
                        </div>
                        <CardTitle>{stripLeadingEmoji(category.name)}</CardTitle>
                        <CardDescription>
                          {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
                        </CardDescription>
                      </CardHeader>
                      {category.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
