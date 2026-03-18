import type { Metadata, Viewport } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const font = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'Grocery Square - Fresh Groceries Delivered',
  description: 'Shop fresh produce, dairy, bakery items and more at Grocery Square. Save big with weekly deals and get fast delivery or pickup.',
  keywords: ['grocery', 'food', 'delivery', 'fresh produce', 'dairy', 'bakery', 'meat', 'online shopping'],
  authors: [{ name: 'Grocery Square' }],
  generator: 'v0.app',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Grocery Square - Fresh Groceries Delivered',
    description: 'Shop fresh produce, dairy, bakery items and more at Grocery Square.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1B5E20',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
