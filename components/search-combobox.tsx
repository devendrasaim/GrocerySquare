"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, X, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn, getAssetUrl } from '@/lib/utils'
import type { Product } from '@/lib/types'

const POPULAR_SEARCHES = ['Milk', 'Eggs', 'Chicken', 'Rice', 'Bananas', 'Bread']

interface SearchComboboxProps {
  placeholder?: string
  className?: string
  inputClassName?: string
  onNavigate?: () => void
}

export function SearchCombobox({
  placeholder = 'Search products...',
  className,
  inputClassName,
  onNavigate,
}: SearchComboboxProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!query.trim() || query.length < 2) {
      setResults([])
      setIsOpen(query.length >= 2 ? true : false)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, price, sale_price, image_url, brand, unit, stock_quantity')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
        .gt('stock_quantity', 0)
        .limit(6)

      setResults((data as unknown as Product[]) || [])
      setIsOpen(true)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const navigate = (href: string) => {
    setIsOpen(false)
    setQuery('')
    onNavigate?.()
    router.push(href)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const showPopular = query.length === 0

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder={placeholder}
            className={cn('w-full pl-10 pr-10 h-10 border-muted-foreground/20 focus:border-primary', inputClassName)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.length >= 2 && results.length > 0) setIsOpen(true)
            }}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => { setQuery(''); setIsOpen(false) }}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-background border border-border rounded-xl shadow-2xl z-[100] overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="px-3 pt-2.5 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Products</p>
              </div>
              {results.map((product) => {
                const price = product.sale_price ?? product.price
                return (
                  <button
                    key={product.id}
                    type="button"
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/50">
                      {product.image_url && (
                        <Image
                          src={getAssetUrl(product.image_url)}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden' }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      {product.brand && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">{product.brand}</p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">${(price as number).toFixed(2)}</span>
                  </button>
                )
              })}
              <div className="border-t border-border/60 mx-3" />
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`)}
              >
                <Search className="h-4 w-4" />
                See all results for &ldquo;{query}&rdquo;
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          ) : showPopular ? (
            <div className="px-3 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Popular Searches</p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="px-3 py-1 text-sm bg-muted hover:bg-muted/70 rounded-full transition-colors"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 text-sm text-center text-muted-foreground">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
