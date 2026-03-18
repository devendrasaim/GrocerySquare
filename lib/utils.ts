import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripLeadingEmoji(text: string): string {
  return text.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '').trim()
}
/**
 * Prepends the GitHub Pages base path (/GrocerySquare) to asset URLs.
 * Next.js basePath does NOT apply to unoptimized <Image> src attributes,
 * so we must always add the prefix ourselves for static assets.
 */
export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return ''
  // Already a full URL — return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const BASE = '/GrocerySquare'

  // Map legacy paths
  let p = path
  if (p.startsWith('/products/')) {
    p = p.replace('/products/', '/images/products/')
  } else if (p === '/logo.png') {
    p = '/images/logo.png'
  }

  // Ensure leading slash
  if (!p.startsWith('/')) p = `/${p}`

  // Avoid double-prefixing
  if (p.startsWith(BASE)) return p

  return `${BASE}${p}`
}
