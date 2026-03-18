import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/components/product-card-skeleton'

export default function SearchLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  )
}
