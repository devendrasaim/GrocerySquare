import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, HelpCircle, Info, Truck, Award, Briefcase, FileText, Phone, Recycle, ShieldCheck, Heart, MapPin, Store, Leaf, Star, ThumbsUp, Coffee } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const dynamic = 'force-static'
export const dynamicParams = false

// Content dictionary for all missing static pages
const pageDictionary: Record<string, { title: string; icon: any; content: string }> = {
  // Services
  'delivery': { title: 'Delivery Information', icon: Truck, content: 'We offer incredibly fast, temperature-controlled delivery within a 20-mile radius of all our store locations. Tracking is available for every order.' },
  'pickup': { title: 'Curbside Pickup', icon: Store, content: 'Order online and we will bring your groceries directly to your car. Just pull into one of our designated spots and tap "I am here" in your order confirmation.' },
  'catering': { title: 'Catering Services', icon: Coffee, content: 'From corporate events to family gatherings, let Grocery Square cater your next event with freshly prepared platters, authentic South Asian dishes, and fresh bakery items.' },
  'gift-cards': { title: 'Gift Cards', icon: Heart, content: 'Give the gift of fresh groceries! Available in physical and digital formats in denominations up to $500.' },
  'rewards': { title: 'Rewards Program', icon: Award, content: 'Earn 1 point for every $1 spent. Redeem points for exclusive discounts, free delivery, and insider access to new products.' },
  
  // Company
  'about': { title: 'About Us', icon: Info, content: 'Since 1995, Grocery Square has been dedicated to sourcing the highest quality, most authentic ingredients from local farms and global partners.' },
  'careers': { title: 'Careers', icon: Briefcase, content: 'Join our growing team! We offer competitive benefits, flexible scheduling, and a passionate work environment. Check our open positions at our local stores.' },
  'press': { title: 'Press', icon: FileText, content: 'For media inquiries, press releases, and brand assets, please contact our PR team at media@grocerysquare.com.' },
  'sustainability': { title: 'Sustainability', icon: Recycle, content: 'We are committed to reducing our carbon footprint. Learn about our zero-waste initiatives, solar-powered facilities, and sustainable packaging.' },
  
  // Support
  'help': { title: 'Help Center', icon: HelpCircle, content: 'Need assistance? Browse our detailed guides or contact our 24/7 support team for help with your order or account.' },
  'contact': { title: 'Contact Us', icon: Phone, content: 'Call us at 1-800-GROCERY or email support@grocerysquare.com. Our team is ready to assist you.' },
  'faq': { title: 'FAQs', icon: HelpCircle, content: 'Find quick answers to common questions about accounts, billing, delivery schedules, and product sourcing.' },
  'returns': { title: 'Returns & Refunds', icon: ShieldCheck, content: '100% Satisfaction Guarantee. If you are not completely satisfied with a product, return it within 7 days for a full refund.' },
  'accessibility': { title: 'Accessibility', icon: Heart, content: 'We are dedicated to ensuring our website is accessible to everyone. Read our full accessibility statement and VPAT.' },
  
  // Legal
  'privacy': { title: 'Privacy Policy', icon: ShieldCheck, content: 'Your privacy is critically important to us. Learn how we collect, process, and protect your personal data.' },
  'terms': { title: 'Terms of Service', icon: FileText, content: 'By using Grocery Square, you agree to our standard terms and conditions.' },
  'cookies': { title: 'Cookie Policy', icon: ShieldCheck, content: 'We use essential cookies to provide our services and optional cookies to enhance user experience.' },
  
  // Custom Product Pages mapped as static content for now
  'best-sellers': { title: 'Best Sellers', icon: Star, content: 'Discover our most popular, highly-rated items loved by customers across all locations.' },
  'organic': { title: 'Organic Products', icon: Leaf, content: 'Explore our massive selection of certified organic produce, dairy, and pantry staples.' },
}

export async function generateStaticParams() {
  return Object.keys(pageDictionary).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  const page = pageDictionary[slug]
  if (!page) return { title: 'Page Not Found' }
  
  return {
    title: `${page.title} - Grocery Square`,
    description: page.content.substring(0, 160),
  }
}

export default function StaticInfoPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const page = pageDictionary[slug]
  
  if (!page) {
    notFound()
  }

  const Icon = page.icon

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4 border-b">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-primary">{page.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {page.title}
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-muted-foreground font-medium text-center">
              {page.content}
            </p>
            
            {/* Added a placeholder section to make it look like a fully fledged page */}
            <div className="mt-12 p-8 bg-muted/20 border rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">More Information</h3>
              <p className="text-muted-foreground mb-6">
                This is a dedicated page for {page.title}. Our team is constantly updating our documentation to provide you with the most accurate and helpful information possible. 
                If you have specific questions that are not addressed here, please don't hesitate to reach out to our support team.
              </p>
              <div className="flex gap-4">
                <Link href="/help" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-6 py-2">
                  Visit Help Center
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
