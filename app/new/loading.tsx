import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/components/product-card-skeleton'

export default function NewArrivalsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-4 w-28 mb-6" />
        <ProductGridSkeleton count={10} />
      </div>
    </div>
  )
}
