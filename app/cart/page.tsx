import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartContent } from '@/components/cart-content'
import { Providers } from '@/components/providers'

export const metadata = {
  title: 'Shopping Cart - Grocery Square',
  description: 'Review your shopping cart and proceed to checkout at Grocery Square.',
}

export default function CartPage() {
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
                <span className="font-medium">Shopping Cart</span>
              </nav>
            </div>
          </div>

          {/* Cart Content */}
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <CartContent />
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
