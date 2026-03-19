import type { Product, Category } from './types'

const mkCat = (id: string, name: string, slug: string, description: string, order: number): Category => ({
  id, name, slug, description, image_url: null, parent_id: null, display_order: order, created_at: '',
})

const mkProduct = (
  id: string, name: string, slug: string, price: number, salePrice: number | null,
  categoryId: string, qty: number, unit: string, featured: boolean, onSale: boolean,
  organic: boolean, southAsian: boolean, snap: boolean, rating: number, reviews: number,
  imageUrl?: string | null
): Product => ({
  id, name, slug, description: null, price, sale_price: salePrice, image_url: imageUrl || `/images/products/${slug}.png`,
  category_id: categoryId, brand: null, stock_quantity: qty, unit, is_featured: featured,
  is_on_sale: onSale, is_organic: organic, is_south_asian: southAsian, is_snap_eligible: snap,
  rating, review_count: reviews, created_at: '', updated_at: '',
})

export const mockDepartments: Record<string, { category: Category; products: Product[] }> = {
  'fresh-produce': {
    category: mkCat('prod-1', 'Fresh Produce', 'fresh-produce', 'Farm-fresh organic fruits and crisp vegetables delivered daily.', 1),
    products: [
      mkProduct('p1', 'Organic Bananas', 'organic-bananas', 0.69, null, 'prod-1', 150, 'lb', true, false, true, false, true, 4.8, 234),
      mkProduct('p2', 'Red Apples', 'red-apples', 1.99, 1.49, 'prod-1', 200, 'lb', true, true, false, false, true, 4.5, 189),
      mkProduct('p3', 'Baby Spinach', 'fresh-spinach', 3.99, null, 'prod-1', 75, 'bag', false, false, true, false, true, 4.6, 156),
      mkProduct('p4', 'Avocados', 'avocados', 1.29, null, 'prod-1', 120, 'each', true, false, false, false, true, 4.7, 312),
    ],
  },
  'dairy-eggs': {
    category: mkCat('dairy-1', 'Dairy & Eggs', 'dairy-eggs', 'Crisp milk, farm eggs, and artisanal cheeses.', 2),
    products: [
      mkProduct('d1', 'Whole Milk (Gallon)', 'whole-milk-gallon', 4.29, null, 'dairy-1', 60, 'gallon', true, false, false, false, true, 4.7, 423),
      mkProduct('d2', 'Large Eggs (Dozen)', 'large-eggs-dozen', 3.99, 2.99, 'dairy-1', 100, 'dozen', true, true, false, false, true, 4.8, 567),
      mkProduct('d3', 'Greek Yogurt (Plain)', 'greek-yogurt-plain', 5.49, null, 'dairy-1', 45, '32oz', false, false, false, false, true, 4.6, 289),
      mkProduct('d4', 'Paneer (12oz)', 'fresh-paneer', 5.99, null, 'dairy-1', 40, 'pack', false, false, false, true, true, 4.6, 189),
    ],
  },
  'bakery': {
    category: mkCat('bake-1', 'Bakery', 'bakery', 'Freshly baked breads, pastries, and artisanal desserts.', 4),
    products: [
      mkProduct('b1', 'Sourdough Loaf', 'sourdough', 6.99, null, 'bake-1', 15, 'loaf', true, false, true, false, true, 4.7, 178),
      mkProduct('b2', 'Croissants (4pk)', 'croissants', 5.50, null, 'bake-1', 20, 'pack', false, false, false, false, true, 4.5, 134),
      mkProduct('b3', 'French Pastry Box', 'pastry-box', 24.99, null, 'bake-1', 10, 'box', false, false, false, false, false, 4.8, 67),
    ],
  },
  'meat-seafood': {
    category: mkCat('meat-1', 'Meat & Seafood', 'meat-seafood', 'Premium cuts and sustainable seafood sourced with care.', 3),
    products: [
      mkProduct('m1', 'Chicken Breast', 'chicken-breast-boneless', 8.99, 6.99, 'meat-1', 50, 'lb', true, true, false, false, true, 4.6, 234, null),
      mkProduct('m2', 'Atlantic Salmon Fillet', 'atlantic-salmon-fillet', 12.99, null, 'meat-1', 25, 'lb', true, false, false, false, true, 4.8, 156, '/products/atlantic-salmon-fillet.png'),
    ],
  },
  'south-asian': {
    category: mkCat('sa-1', 'South Asian Specialties', 'south-asian', 'Authentic South Asian groceries and spices.', 9),
    products: [
      mkProduct('sa1', 'Toor Dal (2lb)', 'toor-dal', 6.99, 5.49, 'sa-1', 60, 'bag', true, true, false, true, true, 4.7, 234),
      mkProduct('sa2', 'Garam Masala', 'garam-masala', 4.99, null, 'sa-1', 75, '100g', true, false, false, true, true, 4.8, 312),
      mkProduct('sa3', 'Pure Ghee (16oz)', 'pure-ghee', 12.99, null, 'sa-1', 50, 'jar', true, false, false, true, true, 4.9, 456),
      mkProduct('sa4', 'Atta Flour (10lb)', 'atta-whole-wheat', 8.99, 7.49, 'sa-1', 55, 'bag', false, true, false, true, true, 4.7, 278),
    ],
  },
}
