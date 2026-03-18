import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/components/product-card-skeleton'

export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb skeleton */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* Banner skeleton */}
      <Skeleton className="h-40 md:h-52 w-full rounded-none" />

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-60 shrink-0 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-6 w-20" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-9 w-36" />
            </div>
            <ProductGridSkeleton count={12} cols="category" />
          </div>
        </div>
      </div>
    </div>
  )
}
