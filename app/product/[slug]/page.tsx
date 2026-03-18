import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Leaf, Minus, Plus, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { FeaturedProducts } from '@/components/featured-products'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { Providers } from '@/components/providers'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockDepartments } from '@/lib/mock-data'
import type { Product } from '@/lib/types'

export const dynamic = 'force-static'
export const dynamicParams = false

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Pre-generate product pages based on mock data for static export
  const allProducts = Object.values(mockDepartments).flatMap(dept => dept.products);
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()
  return data
}

async function getRelatedProducts(categoryId: string, productId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .neq('id', productId)
    .gt('stock_quantity', 0)
    .limit(8)
  return data || []
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) return { title: 'Product Not Found' }
  
  return {
    title: `${product.name} - Grocery Square`,
    description: product.description || `Buy ${product.name} at Grocery Square`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at Grocery Square`,
      images: product.image_url ? [product.image_url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id)
  
  const isOnSale = product.sale_price && product.sale_price < product.price
  const displayPrice = isOnSale ? product.sale_price! : product.price
  const discount = isOnSale
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0

  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="bg-muted/30 py-4">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-2 text-sm flex-wrap">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {product.category && (
                  <>
                    <Link 
                      href={`/category/${product.category.slug}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {product.category.name}
                    </Link>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
                <span className="font-medium truncate">{product.name}</span>
              </nav>
            </div>
          </div>

          {/* Product Details */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isOnSale && (
                      <Badge className="bg-secondary text-secondary-foreground text-sm">
                        {discount}% OFF
                      </Badge>
                    )}
                    {product.is_organic && (
                      <Badge variant="outline" className="bg-background text-primary border-primary">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  {product.category && (
                    <Link 
                      href={`/category/${product.category.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold mt-1 text-balance">{product.name}</h1>
                  <p className="text-muted-foreground mt-1">{product.unit}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">
                    ${displayPrice.toFixed(2)}
                  </span>
                  {isOnSale && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div>
                  {product.stock_quantity > 0 ? (
                    <span className="text-primary font-medium">In Stock</span>
                  ) : (
                    <span className="text-destructive font-medium">Out of Stock</span>
                  )}
                </div>

                {/* Add to Cart */}
                <AddToCartButton product={product} />

                {/* Quick Info */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Free delivery over $50</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="h-5 w-5 text-primary" />
                    <span>Easy returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Quality guaranteed</span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="description" className="pt-4">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || 'No description available for this product.'}
                    </p>
                  </TabsContent>
                  <TabsContent value="details" className="pt-4">
                    <dl className="space-y-2">
                      <div className="flex">
                        <dt className="w-32 font-medium">SKU</dt>
                        <dd className="text-muted-foreground">{product.id.slice(0, 8).toUpperCase()}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 font-medium">Unit</dt>
                        <dd className="text-muted-foreground">{product.unit}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-32 font-medium">Category</dt>
                        <dd className="text-muted-foreground">{product.category?.name || 'Uncategorized'}</dd>
                      </div>
                      {product.is_organic && (
                        <div className="flex">
                          <dt className="w-32 font-medium">Certification</dt>
                          <dd className="text-muted-foreground">USDA Organic</dd>
                        </div>
                      )}
                    </dl>
                  </TabsContent>
                  <TabsContent value="reviews" className="pt-4">
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <FeaturedProducts
              title="You May Also Like"
              products={relatedProducts}
              viewAllHref={product.category ? `/category/${product.category.slug}` : undefined}
            />
          )}
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
