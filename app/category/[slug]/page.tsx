import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { ProductFilters } from '@/components/product-filters'
import { Providers } from '@/components/providers'
import { DepartmentHeader } from '@/components/department-header'
import { mockDepartments } from '@/lib/mock-data'
import type { Category, Product } from '@/lib/types'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; organic?: string; minPrice?: string; maxPrice?: string }>
}

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

async function getCategoryProducts(
  categoryId: string,
  sort?: string,
  organic?: boolean,
  minPrice?: number,
  maxPrice?: number
): Promise<Product[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .gt('stock_quantity', 0)

  if (organic) {
    query = query.eq('is_organic', true)
  }

  if (minPrice !== undefined) {
    query = query.gte('price', minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice)
  }

  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data } = await query
  return data || []
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) return { title: 'Category Not Found' }
  
  return {
    title: `${category.name} - Grocery Square`,
    description: category.description || `Shop ${category.name} products at Grocery Square`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const { sort, organic, minPrice, maxPrice } = await searchParams
  
  let category = await getCategory(slug)
  let products: Product[] = []

  // Check if it's one of our special departments we want to mock
  if (mockDepartments[slug] && (!category || category.id === 'placeholder')) {
    category = mockDepartments[slug].category
    products = mockDepartments[slug].products
  } else if (category) {
    products = await getCategoryProducts(
      category.id,
      sort,
      organic === 'true',
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined
    )
  }
  
  if (!category) {
    notFound()
  }

  const isDepartment = ['fresh-produce', 'dairy-eggs', 'bakery', 'meat-seafood', 'south-asian'].includes(slug)

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
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  Categories
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{category.name}</span>
              </nav>
            </div>
          </div>

          {/* Department or Normal Header */}
          {isDepartment ? (
            <DepartmentHeader 
              name={category.name} 
              description={category.description ?? undefined}
              slug={slug} 
            />
          ) : (
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          )}

          {/* Filters & Products */}
          <div className="container mx-auto px-4 pb-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-64 shrink-0">
                <ProductFilters
                  currentSort={sort}
                  currentOrganic={organic === 'true'}
                  currentMinPrice={minPrice}
                  currentMaxPrice={maxPrice}
                />
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                    <Link href={`/category/${slug}`} className="text-primary hover:underline mt-2 inline-block">
                      Clear filters
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
