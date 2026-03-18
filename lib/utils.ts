import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripLeadingEmoji(text: string): string {
  return text.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '').trim()
}
export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return ''
  // If it's already a full URL, return it
  if (path.startsWith('http') || path.startsWith('https')) return path
  
  // Map legacy /products/ to /images/products/
  let mappedPath = path
  if (mappedPath.startsWith('/products/')) {
    mappedPath = mappedPath.replace('/products/', '/images/products/')
  } else if (mappedPath === '/logo.png') {
    mappedPath = '/images/logo.png'
  }
  
  // In production (GitHub Pages), we need to prefix with /GrocerySquare
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  
  // Ensure we don't double-prefix and the path starts with /
  const cleanPath = mappedPath.startsWith('/') ? mappedPath : `/${mappedPath}`
  
  if (basePath && !cleanPath.startsWith(basePath)) {
    return `${basePath}${cleanPath}`
  }
  
  return cleanPath
}
