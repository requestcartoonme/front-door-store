import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { CategoriesSection } from '@/components/CategoriesSection';
import { ProductRow } from '@/components/ProductRow';
import { PromoBanner } from '@/components/PromoBanner';
import { FeaturesMarquee } from '@/components/FeaturesMarquee';
import { useBestSellers, useNewArrivals } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data: bestSellers, isLoading: loadingBest } = useBestSellers(10);
  const { data: newArrivals, isLoading: loadingNew } = useNewArrivals(10);

  const isLoading = loadingBest && loadingNew;
  const hasProducts = (bestSellers && bestSellers.length > 0) || (newArrivals && newArrivals.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroCarousel />
        <CategoriesSection />

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : hasProducts ? (
          <>
            {bestSellers && bestSellers.length > 0 && (
              <ProductRow title="Best Sellers" products={bestSellers} viewMoreLink="/products" />
            )}
            <PromoBanner />
            {newArrivals && newArrivals.length > 0 && (
              <ProductRow title="New Arrivals" products={newArrivals} viewMoreLink="/products" />
            )}
          </>
        ) : (
          <section className="py-20 text-center">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">No Products Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Products will appear here once they're added to the store. Tell us what products you'd like to sell!
              </p>
            </div>
          </section>
        )}

        <FeaturesMarquee />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
