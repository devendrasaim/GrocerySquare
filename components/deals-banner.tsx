import Link from 'next/link'
import Image from 'next/image'
import { Tag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DealsBanner() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-secondary text-secondary-foreground group">
          {/* Background Image Placeholder */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banners/flash-sale.jpg"
              alt="Flash Sale"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Darker overlay for readability */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            
            {/* Decorative elements kept but lowered opacity further */}
            <div className="absolute inset-0 opacity-10 z-15 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>

          <div className="relative px-6 py-8 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 z-20">
            <div className="text-center md:text-left max-w-2xl">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-md">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs text-white/90">Limited Time</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-balance text-white uppercase tracking-tight">
                Weekend Flash Sale
              </h2>
              <p className="text-base sm:text-xl text-white/90 text-pretty font-medium opacity-100">
                Save up to 40% on selected items. Hurry, offer ends Sunday!
              </p>
            </div>
            <Button 
              size="lg" 
              asChild
              className="bg-white text-secondary hover:bg-white/90 h-12 sm:h-14 px-8 text-base sm:text-lg font-bold shadow-xl transition-transform hover:scale-105"
            >
              <Link href="/deals" className="flex items-center gap-2">
                Shop Deals
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
