import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductRow } from '@/components/ProductRow';
import { useProductByHandle, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Minus, Plus, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProductByHandle(handle || '');
  const { data: allProducts } = useProducts();
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const images = product?.images?.edges || [];
  const variants = product?.variants?.edges || [];
  
  const selectedVariant = variants.find(v => 
    v.node.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
  )?.node || variants[0]?.node;

  useEffect(() => {
    if (product?.variants?.edges?.length > 0) {
      const defaultOptions: Record<string, string> = {};
      product.variants.edges[0].node.selectedOptions.forEach(opt => {
        defaultOptions[opt.name] = opt.value;
      });
      setSelectedOptions(defaultOptions);
    }
  }, [product]);

  useEffect(() => {
    if (selectedVariant?.image?.url) {
      const variantImageIndex = images.findIndex(img => img.node.url === selectedVariant.image?.url);
      if (variantImageIndex >= 0) {
        setSelectedImageIndex(variantImageIndex);
      }
    }
  }, [selectedVariant, images]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-2">Product Not Found</h1>
            <Link to="/products" className="text-primary hover:underline">Browse all products</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const compareAt = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;
  const hasDiscount = compareAt && compareAt > price;

  const similarProducts = allProducts?.filter(p => p.node.handle !== product.handle).slice(0, 10) || [];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success('Added to cart', { description: `${product.title} × ${quantity}`, position: 'top-center' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-8 lg:py-12">
          {/* Breadcrumb — hidden on mobile for cleaner look */}
          <nav className="hidden sm:block text-sm text-muted-foreground mb-6 px-4 sm:px-0">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 lg:gap-12">
            {/* Images — full width on mobile */}
            <div>
              <div className="aspect-square sm:rounded-2xl overflow-hidden bg-muted sm:mb-4">
                {images[selectedImageIndex]?.node ? (
                  <img
                    src={images[selectedImageIndex].node.url}
                    alt={images[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0 py-3 sm:py-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImageIndex ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="px-4 sm:px-0 pt-4 sm:pt-0">
              {product.productType && (
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-secondary/15 text-secondary font-medium mb-2 sm:mb-3">
                  {product.productType}
                </span>
              )}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">{product.title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">₹{price.toFixed(0)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg sm:text-xl text-muted-foreground line-through">₹{compareAt.toFixed(0)}</span>
                    <span className="text-xs sm:text-sm font-semibold text-secondary">-{Math.round((1 - price / compareAt) * 100)}% OFF</span>
                  </>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                {selectedVariant?.availableForSale ? (
                  <><Check className="h-4 w-4 text-green-600" /><span className="text-sm text-green-600 font-medium">In Stock</span></>
                ) : (
                  <span className="text-sm text-destructive font-medium">Out of Stock</span>
                )}
              </div>

              {/* Variants */}
              {product.options.filter(o => o.name !== 'Title' || o.values[0] !== 'Default Title').map((option) => (
                <div key={option.name} className="mb-4 sm:mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">{option.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border-2 transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-4 sm:mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Quantity</p>
                {(() => {
                  const maxQty = selectedVariant?.quantityAvailable ?? null;
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="rounded-lg h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-lg h-9 w-9"
                          onClick={() => {
                            if (maxQty !== null && quantity >= maxQty) {
                              toast.error(`Only ${maxQty} available in stock`);
                            } else {
                              setQuantity(quantity + 1);
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {maxQty !== null && maxQty <= 5 && maxQty > 0 && (
                        <p className="text-xs text-amber-600 mt-1">Only {maxQty} left in stock</p>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Add to Cart — hidden on mobile, shown via sticky bar */}
              <div className="hidden sm:block">
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading || !selectedVariant?.availableForSale}
                  size="lg"
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-lg font-semibold py-6"
                >
                  {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShoppingCart className="h-5 w-5 mr-2" />Add to Cart — ₹{(price * quantity).toFixed(0)}</>}
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="details" className="mt-6 sm:mt-8">
                <TabsList className="w-full h-auto flex">
                  <TabsTrigger value="details" className="flex-1 text-xs sm:text-sm py-2">Details</TabsTrigger>
                  <TabsTrigger value="refund" className="flex-1 text-xs sm:text-sm py-2">Refund</TabsTrigger>
                  <TabsTrigger value="delivery" className="flex-1 text-xs sm:text-sm py-2">Delivery</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                    {product.description || 'No description available.'}
                  </p>
                </TabsContent>
                <TabsContent value="refund" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We offer a 7-day return policy on all products. Items must be returned in their original condition with tags attached. Refunds are processed within 5-7 business days.
                  </p>
                </TabsContent>
                <TabsContent value="delivery" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Free shipping on orders above ₹999. Standard delivery takes 5-7 business days. Express delivery available at checkout for select locations.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="px-0">
            <ProductRow title="Similar Products" products={similarProducts} viewMoreLink="/products" />
          </div>
        )}
      </main>

      {/* Sticky Add to Cart bar — mobile only */}
      <div className="fixed bottom-16 left-0 right-0 z-40 sm:hidden bg-background border-t border-border px-4 py-3" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
        <Button
          onClick={handleAddToCart}
          disabled={cartLoading || !selectedVariant?.availableForSale}
          size="lg"
          className="w-full rounded-xl bg-primary hover:bg-primary/90 font-semibold"
        >
          {cartLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart — ₹{(price * quantity).toFixed(0)}</>}
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
