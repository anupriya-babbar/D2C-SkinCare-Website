// ===========================
//  glōw — Product Data
// ===========================

const PRODUCTS = [
  {
    id: 1, brand: 'Minimalist', name: '10% Niacinamide Serum',
    cat: 'serum', price: 599, origPrice: 799, size: '30ml',
    skin: ['oily', 'combination'], rating: 4.6, reviews: 2847,
    img: '✨', badge: 'Best Seller',
    desc: 'Clinically proven formula with 10% Niacinamide reduces pore appearance and controls sebum. Fragrance-free, suitable for oily skin.'
  },
  {
    id: 2, brand: 'Neutrogena', name: 'Hydro Boost Water Gel',
    cat: 'moisturizer', price: 699, origPrice: 899, size: '50ml',
    skin: ['dry', 'normal', 'sensitive'], rating: 4.4, reviews: 1923,
    img: '💧', badge: 'Trending',
    desc: 'Hyaluronic acid-powered gel moisturiser that hydrates and plumps skin. Non-comedogenic, oil-free formula.'
  },
  {
    id: 3, brand: 'Dot & Key', name: 'Barrier Repair Cream',
    cat: 'moisturizer', price: 849, origPrice: 1099, size: '60ml',
    skin: ['sensitive', 'dry'], rating: 4.5, reviews: 1342,
    img: '🌸', badge: 'New',
    desc: 'Ceramide-rich barrier repair cream that restores skin moisture balance. Clinically tested for sensitive skin.'
  },
  {
    id: 4, brand: 'Plum', name: 'Green Tea Pore Cleansing Toner',
    cat: 'toner', price: 399, origPrice: 499, size: '100ml',
    skin: ['oily', 'combination'], rating: 4.3, reviews: 2101,
    img: '🍵', badge: null,
    desc: 'Green tea extract toner that minimises pores and controls shine. 100% vegan, BHA-infused for gentle exfoliation.'
  },
  {
    id: 5, brand: 'Lakme', name: 'Sun Expert SPF 50 Sunscreen',
    cat: 'sunscreen', price: 349, origPrice: 450, size: '50ml',
    skin: ['normal', 'oily', 'combination'], rating: 4.2, reviews: 3419,
    img: '☀️', badge: 'Top Rated',
    desc: 'Broad-spectrum SPF 50 PA+++ protection. Lightweight, non-greasy formula with antioxidant protection.'
  },
  {
    id: 6, brand: 'The Ordinary', name: 'Hyaluronic Acid 2% + B5 Serum',
    cat: 'serum', price: 999, origPrice: 1299, size: '30ml',
    skin: ['dry', 'normal', 'sensitive'], rating: 4.7, reviews: 4120,
    img: '💎', badge: 'Staff Pick',
    desc: 'Multi-molecular hyaluronic acid with vitamin B5. Provides intense hydration at multiple skin layers for plump, dewy skin.'
  },
  {
    id: 7, brand: 'Mamaearth', name: 'Ubtan Face Wash',
    cat: 'cleanser', price: 249, origPrice: 299, size: '100ml',
    skin: ['all types'], rating: 4.1, reviews: 5672,
    img: '🌿', badge: null,
    desc: 'Turmeric and saffron-infused face wash that brightens dull skin. Sulfate-free, paraben-free formula.'
  },
  {
    id: 8, brand: 'Kama Ayurveda', name: 'Brightening Eye Cream',
    cat: 'eye', price: 1299, origPrice: 1799, size: '20ml',
    skin: ['normal', 'dry'], rating: 4.5, reviews: 892,
    img: '👁️', badge: 'Luxury',
    desc: 'Saffron and rose-infused eye cream that reduces dark circles and puffiness. Ayurvedic luxury formula.'
  },
  {
    id: 9, brand: "Re'equil", name: 'Oily Skin Moisturizer',
    cat: 'moisturizer', price: 499, origPrice: 699, size: '75ml',
    skin: ['oily', 'acne-prone'], rating: 4.4, reviews: 1567,
    img: '🫧', badge: null,
    desc: 'Oil-free gel moisturiser with niacinamide and zinc. Mattifies skin and controls breakouts throughout the day.'
  },
  {
    id: 10, brand: 'Forest Essentials', name: 'Rose Clay Detox Mask',
    cat: 'mask', price: 1499, origPrice: 2000, size: '50ml',
    skin: ['oily', 'combination'], rating: 4.6, reviews: 743,
    img: '🌹', badge: 'Premium',
    desc: 'Kaolin and rose clay mask that deep cleanses pores. Rose water and essential oils leave skin refreshed.'
  },
  {
    id: 11, brand: 'Biotique', name: 'Papaya Brightening Cleanser',
    cat: 'cleanser', price: 199, origPrice: 280, size: '150ml',
    skin: ['normal', 'combination'], rating: 4.0, reviews: 3891,
    img: '🍋', badge: null,
    desc: 'Papaya enzyme cleanser that gently exfoliates and brightens. Ayurvedic botanicals for naturally glowing skin.'
  },
  {
    id: 12, brand: 'Simple', name: 'Kind to Skin Toner',
    cat: 'toner', price: 449, origPrice: 549, size: '200ml',
    skin: ['sensitive', 'dry', 'normal'], rating: 4.3, reviews: 2234,
    img: '🌊', badge: null,
    desc: 'Fragrance-free, alcohol-free toner with Pro-Vitamin B5. Gentle enough for daily use on sensitive skin.'
  }
];
