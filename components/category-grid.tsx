import Link from 'next/link'
import { stripLeadingEmoji } from '@/lib/utils'
import type { Category } from '@/lib/types'

const CATEGORY_EMOJIS: Record<string, string> = {
  'fresh-produce': '🥦',
  'dairy-eggs': '🥚',
  'bakery': '🥐',
  'meat-seafood': '🥩',
  'pantry-staples': '🥫',
  'beverages': '🥤',
  'snacks': '🥨',
  'frozen-foods': '🧊',
  'south-asian': '🍛',
  'cafe-curry': '🍲',
  'household': '🏠',
  'personal-care': '🛁',
}

const CATEGORY_COLORS: Record<string, string> = {
  'fresh-produce': 'bg-green-100 text-green-700 hover:bg-green-200',
  'dairy-eggs': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'bakery': 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  'meat-seafood': 'bg-red-100 text-red-700 hover:bg-red-200',
  'beverages': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  'snacks': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  'frozen-foods': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  'south-asian': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  'cafe-curry': 'bg-rose-100 text-rose-700 hover:bg-rose-200',
  'household': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  'personal-care': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  'pantry-staples': 'bg-stone-100 text-stone-700 hover:bg-stone-200',
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => {
            const emoji = CATEGORY_EMOJIS[category.slug] || '🛒'
            const colorClasses = CATEGORY_COLORS[category.slug] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`flex flex-col items-center justify-center p-3 sm:p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-sm hover:shadow-md ${colorClasses}`}
              >
                <span className="text-3xl sm:text-4xl mb-2 flex items-center justify-center" role="img" aria-label={category.name}>
                  {emoji}
                </span>
                <span className="text-[12px] sm:text-sm font-semibold text-center leading-tight">{stripLeadingEmoji(category.name)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
