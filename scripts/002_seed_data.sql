-- Seed categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('🥦 Fresh Produce', 'fresh-produce', 'Fresh fruits, vegetables, and herbs', 1),
  ('🥚 Dairy & Eggs', 'dairy-eggs', 'Milk, cheese, yogurt, and fresh eggs', 2),
  ('🥩 Meat & Seafood', 'meat-seafood', 'Fresh and frozen meat, poultry, and seafood', 3),
  ('🥐 Bakery', 'bakery', 'Fresh bread, pastries, and baked goods', 4),
  ('🥫 Pantry Staples', 'pantry-staples', 'Rice, flour, oil, spices, and cooking essentials', 5),
  ('🥤 Beverages', 'beverages', 'Water, juice, soda, tea, and coffee', 6),
  ('🥨 Snacks', 'snacks', 'Chips, cookies, nuts, and treats', 7),
  ('🧊 Frozen Foods', 'frozen-foods', 'Frozen meals, vegetables, and desserts', 8),
  ('🍛 South Asian Specialties', 'south-asian', 'Authentic South Asian groceries and spices', 9),
  ('🍲 Café n Curry', 'cafe-curry', 'Ready-to-eat meals from our in-store café', 10),
  ('🏠 Household', 'household', 'Cleaning supplies and household essentials', 11),
  ('🛁 Personal Care', 'personal-care', 'Health, beauty, and personal care items', 12)
ON CONFLICT (slug) DO NOTHING;

-- Seed store locations
INSERT INTO store_locations (name, address, city, state, zip_code, phone, hours_weekday, hours_weekend, latitude, longitude) VALUES
  ('Grocery Square - Secaucus', '100 Mill Creek Drive', 'Secaucus', 'NJ', '07094', '(201) 555-0100', '7:00 AM - 9:00 PM', '8:00 AM - 9:00 PM', 40.7895, -74.0565),
  ('Grocery Square - Jersey City', '500 Washington Blvd', 'Jersey City', 'NJ', '07310', '(201) 555-0200', '7:00 AM - 10:00 PM', '8:00 AM - 10:00 PM', 40.7282, -74.0776)
ON CONFLICT DO NOTHING;

-- Seed products (Fresh Produce)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, is_organic, rating, review_count) VALUES
  ('Organic Bananas', 'organic-bananas', 'Fresh organic bananas, perfect for snacking or smoothies', 0.69, NULL, '/images/products/organic-bananas.png', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Organic Valley', 'lb', 150, true, false, true, 4.8, 234),
  ('Red Apples', 'red-apples', 'Crisp and sweet red delicious apples', 1.99, 1.49, '/images/products/red-apples.png', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Local Farm', 'lb', 200, true, true, false, 4.5, 189),
  ('Fresh Spinach', 'fresh-spinach', 'Baby spinach leaves, pre-washed and ready to eat', 3.99, NULL, '/images/products/fresh-spinach.png', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Fresh Express', 'bag', 75, false, false, true, 4.6, 156),
  ('Avocados', 'avocados', 'Ripe Hass avocados from Mexico', 1.29, NULL, '/images/products/avocados.png', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Mission', 'each', 120, true, false, false, 4.7, 312),
  ('Fresh Cilantro', 'fresh-cilantro', 'Aromatic cilantro bunch for authentic cooking', 0.99, NULL, '/images/products/fresh-cilantro.png', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Local Farm', 'bunch', 80, false, false, false, 4.4, 98),
  ('Tomatoes on the Vine', 'vine-tomatoes', 'Juicy vine-ripened tomatoes', 2.99, 2.49, '/images/products/vine-tomatoes.png', (SELECT id FROM categories WHERE slug = 'fresh-produce'), 'Sunset', 'lb', 100, false, true, false, 4.3, 145)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed products (Dairy & Eggs)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, rating, review_count) VALUES
  ('Whole Milk', 'whole-milk-gallon', 'Fresh whole milk, vitamin D fortified', 4.29, NULL, '/images/products/whole-milk-gallon.png', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Horizon', 'gallon', 60, true, false, 4.7, 423),
  ('Large Eggs', 'large-eggs-dozen', 'Grade A large eggs, farm fresh', 3.99, 2.99, '/images/products/large-eggs-dozen.png', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Egglands Best', 'dozen', 100, true, true, 4.8, 567),
  ('Greek Yogurt', 'greek-yogurt-plain', 'Creamy plain Greek yogurt, high protein', 5.49, NULL, '/images/products/greek-yogurt-plain.png', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Chobani', '32oz', 45, false, false, 4.6, 289),
  ('Shredded Cheddar', 'shredded-cheddar', 'Sharp cheddar cheese, shredded', 4.49, NULL, '/images/products/shredded-cheddar.png', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Tillamook', '8oz', 55, false, false, 4.5, 178),
  ('Butter Unsalted', 'butter-unsalted', 'Premium unsalted butter for cooking and baking', 5.99, 4.99, '/images/products/butter-unsalted.png', (SELECT id FROM categories WHERE slug = 'dairy-eggs'), 'Kerrygold', '8oz', 70, false, true, 4.9, 345)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed products (Pantry Staples)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, rating, review_count) VALUES
  ('Basmati Rice', 'basmati-rice-10lb', 'Premium aged basmati rice, extra long grain', 15.99, 12.99, '/images/products/basmati-rice-5kg.png', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 'Tilda', '10 lb', 80, true, true, 4.8, 567),
  ('Extra Virgin Olive Oil', 'olive-oil-evoo', 'Cold pressed extra virgin olive oil', 12.99, NULL, '/images/products/olive-oil.png', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 'Pompeian', '24oz', 65, true, false, 4.7, 234),
  ('All-Purpose Flour', 'all-purpose-flour', 'Enriched bleached all-purpose flour', 4.99, NULL, '/images/products/all-purpose-flour.png', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 'King Arthur', '5 lb', 90, false, false, 4.6, 198),
  ('Chickpeas', 'chickpeas-canned', 'Organic garbanzo beans, ready to use', 1.99, NULL, '/images/products/chickpeas.png', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 'Goya', '15oz', 120, false, false, 4.4, 145),
  ('Coconut Milk', 'coconut-milk', 'Full fat coconut milk for cooking', 2.49, NULL, '/images/products/coconut-milk.png', (SELECT id FROM categories WHERE slug = 'pantry-staples'), 'Thai Kitchen', '13.66oz', 85, false, false, 4.5, 167)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed products (South Asian Specialties)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, is_south_asian, rating, review_count) VALUES
  ('Toor Dal', 'toor-dal', 'Split pigeon peas, essential for sambar and dal', 6.99, 5.49, '/images/products/toor-dal.png', (SELECT id FROM categories WHERE slug = 'south-asian'), 'Deep', '2 lb', 60, true, true, true, 4.7, 234),
  ('Garam Masala', 'garam-masala', 'Authentic blend of aromatic spices', 4.99, NULL, '/images/products/garam-masala.png', (SELECT id FROM categories WHERE slug = 'south-asian'), 'MDH', '100g', 75, true, false, true, 4.8, 312),
  ('Ghee', 'pure-ghee', 'Pure clarified butter, traditional recipe', 12.99, NULL, '/images/products/pure-ghee.png', (SELECT id FROM categories WHERE slug = 'south-asian'), 'Amul', '16oz', 50, true, false, true, 4.9, 456),
  ('Paneer', 'fresh-paneer', 'Fresh Indian cottage cheese', 5.99, NULL, '/images/products/fresh-paneer.png', (SELECT id FROM categories WHERE slug = 'south-asian'), 'Nanak', '12oz', 40, false, false, true, 4.6, 189),
  ('Atta Flour', 'atta-whole-wheat', 'Whole wheat flour for chapati and roti', 8.99, 7.49, '/images/products/atta-whole-wheat.png', (SELECT id FROM categories WHERE slug = 'south-asian'), 'Sujata', '10 lb', 55, false, true, true, 4.7, 278)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed products (Café n Curry - Ready meals)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, is_south_asian, rating, review_count) VALUES
  ('Chicken Biryani', 'chicken-biryani', 'Aromatic basmati rice with tender chicken and spices', 12.99, NULL, '/images/products/chicken-biryani.png', (SELECT id FROM categories WHERE slug = 'cafe-curry'), 'Café n Curry', 'serving', 25, true, false, true, 4.9, 456)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed products (Beverages)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, rating, review_count) VALUES
  ('Mango Lassi', 'mango-lassi', 'Creamy yogurt drink with mango', 3.49, NULL, '/products/mango-lassi.png', (SELECT id FROM categories WHERE slug = 'beverages'), 'Deep', '16oz', 35, false, false, 4.8, 145)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed products (Snacks)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, is_south_asian, rating, review_count) VALUES
  ('Kettle Chips', 'kettle-chips-sea-salt', 'Crunchy sea salt kettle cooked chips', 3.99, NULL, '/products/kettle-chips.png', (SELECT id FROM categories WHERE slug = 'snacks'), 'Kettle Brand', '8oz', 60, false, false, false, 4.5, 189),
  ('Mixed Nuts', 'mixed-nuts-roasted', 'Roasted and salted mixed nuts', 8.99, 7.49, '/products/mixed-nuts.png', (SELECT id FROM categories WHERE slug = 'snacks'), 'Planters', '10oz', 45, true, true, false, 4.7, 234),
  ('Chakli', 'chakli-snack', 'Crispy spiral rice flour snack', 4.49, NULL, '/products/chakli.png', (SELECT id FROM categories WHERE slug = 'snacks'), 'Haldiram', '200g', 50, false, false, true, 4.6, 145),
  ('Soan Papdi', 'soan-papdi', 'Traditional flaky Indian sweet', 5.99, NULL, '/products/soan-papdi.png', (SELECT id FROM categories WHERE slug = 'snacks'), 'Bikaji', '250g', 35, false, false, true, 4.4, 98)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url, price = EXCLUDED.price, sale_price = EXCLUDED.sale_price, is_featured = EXCLUDED.is_featured, is_on_sale = EXCLUDED.is_on_sale;

-- Seed products (Meat & Seafood)
INSERT INTO products (name, slug, description, price, sale_price, image_url, category_id, brand, unit, stock_quantity, is_featured, is_on_sale, rating, review_count) VALUES
  ('Chicken Breast', 'chicken-breast-boneless', 'Boneless skinless chicken breast', 8.99, 6.99, '/images/products/chicken-breast-boneless.png', (SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Perdue', 'lb', 50, true, true, 4.6, 234),
  ('Atlantic Salmon', 'atlantic-salmon-fillet', 'Fresh Atlantic salmon fillet', 12.99, NULL, '/images/products/atlantic-salmon-fillet.png', (SELECT id FROM categories WHERE slug = 'meat-seafood'), 'Fresh Catch', 'lb', 25, true, false, 4.8, 156)
ON CONFLICT (slug) DO UPDATE SET image_url = EXCLUDED.image_url;
