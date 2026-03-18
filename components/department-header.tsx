import React from 'react'

interface DepartmentHeaderProps {
  name: string
  description?: string
  slug: string
}

export function DepartmentHeader({ name, description, slug }: DepartmentHeaderProps) {
  const getGradient = (slug: string) => {
    switch (slug) {
      case 'fresh-produce': return 'from-green-600 to-emerald-500'
      case 'dairy-eggs': return 'from-blue-500 to-cyan-400'
      case 'bakery': return 'from-orange-500 to-amber-400'
      case 'meat-seafood': return 'from-red-600 to-rose-500'
      case 'south-asian': return 'from-yellow-600 to-orange-500'
      case 'beverages': return 'from-sky-500 to-blue-400'
      case 'snacks': return 'from-purple-500 to-violet-400'
      case 'frozen-foods': return 'from-cyan-500 to-teal-400'
      default: return 'from-primary to-primary/80'
    }
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${getGradient(slug)} py-12 md:py-20 text-white mb-8`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0 L100 0 L100 100 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Department
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {name}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative floating elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-20px] left-[20%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
    </div>
  )
}
