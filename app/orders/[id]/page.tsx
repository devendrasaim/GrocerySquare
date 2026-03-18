import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Order, OrderItem } from '@/lib/types'

export const dynamic = 'force-static'
export const dynamicParams = false

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}

export async function generateStaticParams() {
  return [{ id: '00000000-0000-0000-0000-000000000000' }];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

async function getOrder(orderId: string, userId: string): Promise<Order | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single()
  return data
}

async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('order_items')
    .select('*, product:products(*)')
    .eq('order_id', orderId)
  return data || []
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params
  return {
    title: `Order #${id.slice(0, 8).toUpperCase()} - Grocery Square`,
    description: 'View your order details at Grocery Square.',
  }
}

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const { id } = await params
  const { success } = await searchParams
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/orders')
  }

  const order = await getOrder(id, user.id)
  
  if (!order) {
    notFound()
  }

  const items = await getOrderItems(id)
  const StatusIcon = STATUS_ICONS[order.status] || Package

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
                <Link href="/orders" className="text-muted-foreground hover:text-foreground">
                  Orders
                </Link>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</span>
              </nav>
            </div>
          </div>

          {/* Order Content */}
          <div className="container mx-auto px-4 py-8">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Order placed successfully!</p>
                  <p className="text-sm text-green-700">
                    Thank you for your order. We'll send you updates via email.
                  </p>
                </div>
              </div>
            )}

            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-muted-foreground">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Badge className={`${STATUS_COLORS[order.status]} text-sm px-3 py-1`}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded overflow-hidden bg-muted shrink-0">
                            {item.product?.image_url && (
                              <Image
                                src={item.product.image_url}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/product/${item.product?.slug}`}
                              className="font-medium hover:text-primary line-clamp-1"
                            >
                              {item.product?.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity} x ${item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">
                              ${item.total_price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Delivery Method</p>
                      <p className="font-medium capitalize">{order.delivery_method}</p>
                    </div>
                    
                    {order.notes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="font-medium">{order.notes}</p>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/orders">Back to Orders</Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link href="/">Continue Shopping</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
