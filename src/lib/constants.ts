export const CATEGORIES = {
  'Silver 925': ['Earrings', 'Rings', 'Necklace', 'Chains', 'Pendant', 'Mangalsutra', 'Bracelets', 'Nose Pin', 'Charms', 'Brooches'],
  'Imitation': ['Earrings', 'Rings', 'Necklace', 'Chains', 'Pendant', 'Mangalsutra', 'Bracelets', 'Nose Pin', 'Charms', 'Brooches'],
} as const;

export const COLLECTIONS = [
  'Everyday Essentials',
  'Office Wear',
  'Festive Edition',
  'Party Wear',
  'Wedding Essentials',
  'Gifting',
] as const;

export const FEATURES_MARQUEE = [
  '✦ Exclusive Designs',
  '✦ Pair with Indian or Western',
  '✦ 100% Payment Secure',
  '✦ Free Shipping',
  '✦ 7 Days Return Policy',
  '✦ Happy Customers',
];

export type MainCategory = keyof typeof CATEGORIES;
export type SubCategory = typeof CATEGORIES[MainCategory][number];
