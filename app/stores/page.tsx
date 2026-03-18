import Link from 'next/link'
import { ChevronRight, MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { StoreLocation } from '@/lib/types'

async function getStores(): Promise<StoreLocation[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_locations')
    .select('*')
    .order('name')
  return data || []
}

export const metadata = {
  title: 'Store Locations - Grocery Square',
  description: 'Find a Grocery Square store near you.',
}

export default async function StoresPage() {
  const stores = await getStores()

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
                <span className="font-medium">Store Locations</span>
              </nav>
            </div>
          </div>

          {/* Header */}
          <div className="bg-primary text-primary-foreground py-12">
            <div className="container mx-auto px-4 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Find a Store</h1>
              <p className="text-lg opacity-90 mb-6">
                Visit one of our convenient locations near you
              </p>
              <div className="max-w-md mx-auto flex gap-2">
                <Input
                  placeholder="Enter ZIP code or city"
                  className="bg-primary-foreground text-foreground"
                />
                <Button variant="secondary">Search</Button>
              </div>
            </div>
          </div>

          {/* Stores */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">All Locations</h2>
            
            {stores.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                  <Card key={store.id} className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {store.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          {store.address}<br />
                          {store.city}, {store.state} {store.zip_code}
                        </p>
                        {store.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${store.phone}`} className="hover:text-foreground">
                              {store.phone}
                            </a>
                          </div>
                        )}
                        {store.hours_weekday && (
                          <div className="flex items-start gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                            <div>
                              <p>Mon–Fri: {store.hours_weekday}</p>
                              {store.hours_weekend && <p>Sat–Sun: {store.hours_weekend}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${store.address}, ${store.city}, ${store.state} ${store.zip_code}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No store locations found.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
