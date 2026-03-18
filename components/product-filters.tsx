"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Leaf } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProductFiltersProps {
  currentSort?: string
  currentOrganic?: boolean
  currentMinPrice?: string
  currentMaxPrice?: string
}

export function ProductFilters({
  currentSort,
  currentOrganic,
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push(pathname)
  }

  const hasActiveFilters = currentSort || currentOrganic || currentMinPrice || currentMaxPrice

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={currentSort || 'featured'}
            onValueChange={(value) => updateFilters('sort', value === 'featured' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Organic Filter */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="organic"
            checked={currentOrganic}
            onCheckedChange={(checked) => 
              updateFilters('organic', checked ? 'true' : null)
            }
          />
          <Label htmlFor="organic" className="flex items-center gap-1 cursor-pointer">
            <Leaf className="h-4 w-4 text-primary" />
            Organic Only
          </Label>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={currentMinPrice || ''}
              onChange={(e) => updateFilters('minPrice', e.target.value || null)}
              className="w-full"
              min="0"
              step="0.01"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={currentMaxPrice || ''}
              onChange={(e) => updateFilters('maxPrice', e.target.value || null)}
              className="w-full"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
