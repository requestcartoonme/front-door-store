

# UI Design Overhaul — Balanced, Elegant, Mobile-First

## Summary
Redesign the Anurpan webstore for a polished, balanced look across all breakpoints. On mobile, the site will feel like a native app with a fixed bottom navigation bar, no-zoom viewport, and optimized layouts. Desktop stays elegant with better spacing and visual hierarchy. No functional changes.

---

## 1. Viewport Lock (No Zoom on Mobile)

**File:** `index.html`

Update the viewport meta tag to disable user scaling:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## 2. Hero Image Fix

**File:** `src/components/HeroCarousel.tsx`

The hero images have spaces in filenames (`desktop 2.jpg`, `mobile_3.jpg`). The URLs need to be encoded. Replace the raw paths with `encodeURI()` or use URL-safe filenames. Also ensure the `<picture>` element uses proper `srcSet` encoding:
```
/black-vixen-necklace-wearing-model-dine-in-hero-banner-image-desktop%202.jpg
```

## 3. Mobile Bottom Navigation Bar

**New file:** `src/components/MobileBottomNav.tsx`

A fixed bottom nav bar visible only on mobile (`md:hidden`), containing 5 icon tabs:
- **Home** (House icon)
- **Categories** (Grid icon) — opens a bottom sheet with category/subcategory browser
- **Search** (Search icon) — opens a search overlay
- **Cart** (ShoppingCart icon with badge) — opens CartDrawer
- **Account** (User icon) — links to /login or /account

Styled with the existing maroon/gold theme, `bg-background` with a top border, `h-16`, `safe-area-inset-bottom` padding.

**File:** `src/App.tsx`
- Render `<MobileBottomNav />` at the root level inside `AppContent`, outside `<Routes>`.

**File:** `src/index.css`
- Add `pb-16 md:pb-0` to body or a wrapper so page content doesn't get hidden behind the bottom nav.

## 4. Desktop Navbar Refinement

**File:** `src/components/Navbar.tsx`

- Hide the mobile hamburger menu icon, search, account, and cart icons from the top navbar on mobile (they move to bottom nav)
- Keep the top promo banner strip on all sizes
- On mobile: navbar becomes just the centered logo + promo strip (clean, minimal)
- On desktop: no changes to layout, but refine spacing: slightly larger logo, more breathable padding, subtle hover animations on dropdown items

## 5. Homepage Layout Balance

**File:** `src/pages/Index.tsx`
- Adjust section vertical spacing for visual rhythm: tighter on mobile (`py-8`), generous on desktop (`py-16`)

**File:** `src/components/CategoriesSection.tsx`
- On mobile: category pills should be horizontally scrollable with snap, smaller font
- Subcategory pills: same horizontal scroll, tighter spacing

**File:** `src/components/ProductRow.tsx`
- Mobile: cards at `w-[160px]` with `gap-3`
- Desktop: cards at `w-[240px]` with `gap-5`
- Section title: slightly smaller on mobile (`text-xl`)

**File:** `src/components/ProductCard.tsx`
- On mobile: show the add-to-cart button always (not just on hover, since hover doesn't exist on touch)
- Slightly smaller rounded corners on mobile (`rounded-lg` vs `rounded-xl`)
- Product title: `line-clamp-2` instead of `truncate` for better readability

**File:** `src/components/PromoBanner.tsx`
- Add a subtle background pattern or gold accent border
- On mobile: reduce min-height, adjust text sizing

**File:** `src/components/FeaturesMarquee.tsx`
- Slightly increase text size, add gold accent dots between items

## 6. Product Listing Page Polish

**File:** `src/pages/Products.tsx`
- Mobile: 2-column grid with tighter gap (`gap-3`)
- Sticky filter pills at top on mobile (below navbar, above grid)
- Add subtle fade-in animation on product cards

## 7. Product Detail Page Polish

**File:** `src/pages/ProductDetail.tsx`
- Mobile: full-width image (no side padding), swipeable image gallery
- Sticky "Add to Cart" bar at bottom on mobile (above bottom nav), always visible
- Variant buttons: consistent pill styling
- Tabs: full-width on mobile with horizontal scroll if needed

## 8. Cart Drawer Polish

**File:** `src/components/CartDrawer.tsx`
- On mobile: full-screen sheet instead of side panel
- Rounded item cards with slightly more padding
- Checkout button with gold accent

## 9. Footer Adjustments

**File:** `src/components/Footer.tsx`
- On mobile: hide or collapse footer into an accordion (since bottom nav handles navigation)
- Add extra bottom padding to account for the fixed bottom nav

## 10. Global CSS Enhancements

**File:** `src/index.css`
- Add smooth scroll behavior: `html { scroll-behavior: smooth; }`
- Add `env(safe-area-inset-bottom)` support for notched phones
- Subtle page transition animation class

---

## Technical Details

- All changes are CSS/layout only — no functional or API changes
- Bottom nav uses React Router's `useLocation` for active tab highlighting
- Categories bottom sheet uses the existing `Drawer` component (vaul)
- The `MobileBottomNav` is conditionally rendered via CSS (`md:hidden`), not JS
- Hero image fix: encode the space in URLs or rename files to use hyphens

## Files Changed
| File | Action |
|------|--------|
| `index.html` | Update viewport meta |
| `src/components/MobileBottomNav.tsx` | **New** — bottom nav |
| `src/components/HeroCarousel.tsx` | Fix image URLs |
| `src/components/Navbar.tsx` | Hide mobile icons (moved to bottom nav) |
| `src/components/ProductCard.tsx` | Mobile touch-friendly tweaks |
| `src/components/ProductRow.tsx` | Responsive card sizing |
| `src/components/CategoriesSection.tsx` | Mobile scroll refinement |
| `src/components/PromoBanner.tsx` | Spacing polish |
| `src/components/FeaturesMarquee.tsx` | Styling refinement |
| `src/components/CartDrawer.tsx` | Mobile full-screen |
| `src/components/Footer.tsx` | Mobile padding |
| `src/pages/Index.tsx` | Section spacing |
| `src/pages/Products.tsx` | Grid + sticky filters |
| `src/pages/ProductDetail.tsx` | Sticky cart bar, mobile image |
| `src/pages/Login.tsx` | Layout polish |
| `src/pages/Account.tsx` | Layout polish |
| `src/App.tsx` | Add MobileBottomNav |
| `src/index.css` | Global mobile-first styles |

