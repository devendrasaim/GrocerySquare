"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { User, MapPin, Menu, X, Heart, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SearchCombobox } from '@/components/search-combobox'
import { CartDrawer } from '@/components/cart-drawer'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_CATEGORIES = [
  { name: '🥦 Produce', slug: 'fresh-produce' },
  { name: '🥚 Dairy & Eggs', slug: 'dairy-eggs' },
  { name: '🥐 Bakery', slug: 'bakery' },
  { name: '🥩 Meat & Seafood', slug: 'meat-seafood' },
  { name: '🥤 Beverages', slug: 'beverages' },
  { name: '🥨 Snacks', slug: 'snacks' },
  { name: '🧊 Frozen', slug: 'frozen-foods' },
  { name: '🍛 South Asian', slug: 'south-asian' },
]

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    supabase.from('categories').select('*').order('display_order', { ascending: true }).then(({ data }) => {
      if (data) setCategories(data)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      setHighlightStyle({
        left: targetRect.left - navRect.left,
        width: targetRect.width,
        opacity: 1,
      })
    }
  }

  const handleMouseLeave = () => {
    setHighlightStyle(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Link href="/stores" className="flex items-center gap-1 hover:underline">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Find a Store</span>
            </Link>
            <span className="hidden md:inline">Free delivery on orders over $50</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/deals" className="hover:underline font-medium">Weekly Deals</Link>
            <Link href="/help" className="hidden sm:inline hover:underline">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-80">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="font-semibold text-lg mb-2">Categories</div>
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="py-2 px-3 rounded-md hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  <Link
                    href="/deals"
                    className="py-2 px-3 rounded-md hover:bg-accent text-secondary font-semibold block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Weekly Deals
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
            <Image
              src="/images/logo.png"
              alt="Grocery Square"
              width={50}
              height={50}
              className="h-8 w-auto sm:h-10 md:h-12 transition-transform group-hover:scale-105"
              priority
            />
            <span className="font-bold text-lg md:text-xl tracking-tighter uppercase">
              <span className="text-primary">Grocery</span> <span className="text-red-600">-Square</span>
            </span>
          </Link>

          {/* Desktop Search (predictive) */}
          <div className="flex-1 max-w-2xl hidden lg:block mx-4">
            <SearchCombobox placeholder="Search products, brands..." />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              {mobileSearchOpen
                ? <X className="h-5 w-5" />
                : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              }
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">Account</span>
                    <ChevronDown className="h-4 w-4 hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild className="gap-2">
                <Link href="/auth/login">
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
              </Button>
            )}

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>

            {/* Cart Drawer (replaces Link to /cart) */}
            <CartDrawer />
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {mobileSearchOpen && (
          <div className="mt-3 lg:hidden animate-in slide-in-from-top-2 duration-200">
            <SearchCombobox
              placeholder="Search for groceries..."
              inputClassName="h-12 text-base border-primary/20"
              onNavigate={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Category Nav */}
      <nav className="hidden lg:block border-t bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <ul ref={navRef} className="flex items-center gap-1 overflow-x-auto py-2 relative" onMouseLeave={handleMouseLeave}>
            {/* Sliding Highlight */}
            <div
              className="absolute h-[32px] bg-primary/10 rounded-md transition-all duration-300 ease-out pointer-events-none z-0"
              style={{
                left: `${highlightStyle.left}px`,
                width: `${highlightStyle.width}px`,
                opacity: highlightStyle.opacity,
              }}
            />
            <li className="relative z-10" onMouseEnter={handleMouseEnter}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 font-medium">
                    <Menu className="h-4 w-4" />
                    All Departments
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {(categories.length > 0
                    ? categories
                    : NAV_CATEGORIES.map(c => ({ ...c, id: c.slug, description: null, image_url: null, created_at: '', parent_id: null, display_order: 0 }))
                  ).map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                      <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            {NAV_CATEGORIES.slice(0, 7).map((cat) => (
              <li key={cat.slug} className="relative z-10" onMouseEnter={handleMouseEnter}>
                <Button variant="ghost" size="sm" asChild className="font-medium hover:bg-transparent">
                  <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                </Button>
              </li>
            ))}
            <li className="relative z-10" onMouseEnter={handleMouseEnter}>
              <Button variant="ghost" size="sm" asChild className="font-medium text-secondary hover:bg-transparent">
                <Link href="/deals">Weekly Deals</Link>
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
