import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, User, Package, Heart, MapPin, CreditCard, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const ACCOUNT_LINKS = [
  {
    title: 'Order History',
    description: 'View and track your orders',
    href: '/orders',
    icon: Package,
  },
  {
    title: 'Wishlist',
    description: 'Items you\'ve saved for later',
    href: '/wishlist',
    icon: Heart,
  },
  {
    title: 'Addresses',
    description: 'Manage your delivery addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'Payment Methods',
    description: 'Manage your payment options',
    href: '/account/payments',
    icon: CreditCard,
  },
  {
    title: 'Account Settings',
    description: 'Update your profile and preferences',
    href: '/account/settings',
    icon: Settings,
  },
]

export const metadata = {
  title: 'My Account - Grocery Square',
  description: 'Manage your Grocery Square account.',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/account')
  }

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
                <span className="font-medium">My Account</span>
              </nav>
            </div>
          </div>

          {/* Account Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">My Account</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.email}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACCOUNT_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Card className="h-full hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <link.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{link.title}</CardTitle>
                          <CardDescription>{link.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
