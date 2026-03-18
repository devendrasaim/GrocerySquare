"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Truck, Clock, Percent, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SLIDES = [
  {
    id: 1,
    title: 'Fresh Produce',
    subtitle: 'Farm to Table',
    description: 'Get the freshest fruits and vegetables delivered to your door',
    cta: 'Shop Produce',
    href: '/category/fresh-produce',
    image: '/images/banners/fresh-produce.jpg',
    bgColor: 'bg-[#e8f5e9]',
    textColor: 'text-primary',
  },
  {
    id: 2,
    title: 'Weekly Deals',
    subtitle: 'Save Big',
    description: 'Up to 50% off on selected items this week only',
    cta: 'View Deals',
    href: '/deals',
    image: '/images/banners/weekly-deals.jpg',
    bgColor: 'bg-[#ffebee]',
    textColor: 'text-secondary',
  },
  {
    id: 3,
    title: 'Organic Selection',
    subtitle: 'Eat Healthy',
    description: 'Certified organic products for a healthier lifestyle',
    cta: 'Shop Organic',
    href: '/category/organic',
    image: '/images/banners/organic.jpg',
    bgColor: 'bg-[#e8f5e9]',
    textColor: 'text-primary',
  },
]

const FEATURES = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'On orders over $50',
  },
  {
    icon: Clock,
    title: 'Same Day Pickup',
    description: 'Ready in 2 hours',
  },
  {
    icon: Percent,
    title: 'Best Prices',
    description: 'Price match guarantee',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Freshness guaranteed',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

  return (
    <section>
      {/* Hero Carousel */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full relative ${slide.bgColor}`}
            >
              {/* Background Image */}
              {slide.image && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-black/50 z-10" />
                </div>
              )}
              
              <div className="container relative mx-auto px-4 py-8 md:py-24 lg:py-32 z-20">
                <div className="max-w-2xl px-2 sm:px-0">
                  <div className="text-left">
                    <p className={`text-[10px] md:text-sm font-bold uppercase tracking-widest text-white/90 mb-2 md:mb-3 drop-shadow-md`}>
                      {slide.subtitle}
                    </p>
                    <h1 className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-6 text-balance drop-shadow-lg leading-[1.1] uppercase`}>
                      {slide.title}
                    </h1>
                    <p className="text-base md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 max-w-xl text-pretty drop-shadow-sm font-medium line-clamp-3 md:line-clamp-none">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base md:text-lg font-bold shadow-lg transition-transform active:scale-95">
                        <Link href={slide.href}>{slide.cta}</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="bg-white/10 hover:bg-white/20 text-white border-white/40 h-12 px-8 text-base md:text-lg hover:border-white transition-all backdrop-blur-sm">
                        <Link href="/categories">View Categories</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg text-white border border-white/20"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg text-white border border-white/20"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next slide</span>
        </Button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <feature.icon className="h-8 w-8 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">{feature.title}</p>
                  <p className="text-xs opacity-80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
