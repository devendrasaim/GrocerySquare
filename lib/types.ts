export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  display_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  sale_price: number | null
  image_url: string | null
  category_id: string
  brand: string | null
  stock_quantity: number
  unit: string
  is_featured: boolean
  is_on_sale: boolean
  is_organic: boolean
  is_south_asian: boolean
  is_snap_eligible: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
  category?: Category
}

export interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  default_address_id: string | null
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  street_address: string
  apartment: string | null
  city: string
  state: string
  zip_code: string
  is_default: boolean
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  tax: number
  delivery_fee: number
  total: number
  delivery_method: 'delivery' | 'pickup'
  delivery_address_id: string | null
  store_location: string | null
  payment_method: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
  address?: Address
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  title: string | null
  content: string | null
  created_at: string
  profile?: Profile
}

export interface StoreLocation {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string | null
  hours_weekday: string | null
  hours_weekend: string | null
  latitude: number | null
  longitude: number | null
  created_at: string
}
