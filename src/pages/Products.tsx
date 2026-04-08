import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';
import { CATEGORIES, type MainCategory } from '@/lib/constants';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const sub = searchParams.get('sub');
  const collection = searchParams.get('collection');
  const q = searchParams.get('q');

  let shopifyQuery = '';
  if (q) shopifyQuery = q;
  else if (category && sub) shopifyQuery = `product_type:${sub} tag:${category}`;
  else if (category) shopifyQuery = `tag:${category}`;
  else if (sub) shopifyQuery = `product_type:${sub}`;
  else if (collection) shopifyQuery = `tag:${collection}`;

  const { data: products, isLoading } = useProducts(shopifyQuery || undefined);

  const title = collection || (category && sub ? `${category} — ${sub}` : category || sub || (q ? `Search: "${q}"` : 'All Products'));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-8">{title}</h1>

          {/* Subcategory filters — sticky on mobile */}
          {category && (
            <div className="sticky top-[calc(3.5rem+1.875rem)] sm:top-[calc(5rem+1.875rem)] z-30 bg-background/95 backdrop-blur -mx-4 px-4 py-2 sm:py-3 mb-4 sm:mb-8 border-b border-border sm:border-0 sm:static sm:bg-transparent sm:backdrop-blur-none">
              <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory sm:flex-wrap">
                <Link to={`/products?category=${encodeURIComponent(category)}`} className="snap-start">
                  <span className={`inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition-all whitespace-nowrap ${!sub ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                    All
                  </span>
                </Link>
                {CATEGORIES[category as MainCategory]?.map((s) => (
                  <Link key={s} to={`/products?category=${encodeURIComponent(category)}&sub=${encodeURIComponent(s)}`} className="snap-start">
                    <span className={`inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm border transition-all whitespace-nowrap ${sub === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:border-primary'}`}>
                      {s}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12 sm:py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product, i) => (
                <div key={product.node.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20">
              <h2 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2">No products found</h2>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
