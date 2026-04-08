import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, Search, ShoppingCart, User, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from '@/components/CartDrawer';
import { isAuthenticated } from '@/lib/auth';
import { CATEGORIES, COLLECTIONS, type MainCategory } from '@/lib/constants';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'Categories', action: () => setCategoriesOpen(true) },
    { icon: Search, label: 'Search', action: () => setSearchOpen(true) },
    { icon: ShoppingCart, label: 'Cart', isCart: true },
    { icon: User, label: 'Account', path: isAuthenticated() ? '/account' : '/login' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            if (item.isCart) {
              return (
                <CartDrawer key={item.label} trigger={
                  <button className="flex flex-col items-center justify-center gap-0.5 w-full h-full relative text-muted-foreground">
                    <item.icon className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute top-1 right-1/4 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-secondary text-secondary-foreground">
                        {totalItems}
                      </Badge>
                    )}
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </button>
                } />
              );
            }

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-muted-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            const active = isActive(item.path!);
            return (
              <Link
                key={item.label}
                to={item.path!}
                className={`flex flex-col items-center justify-center gap-0.5 w-full h-full ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Categories Drawer */}
      <Drawer open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="font-display text-xl">Shop by Category</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            {(Object.keys(CATEGORIES) as MainCategory[]).map((cat) => (
              <div key={cat} className="mb-5">
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="font-display font-semibold text-primary text-base"
                >
                  {cat}
                </Link>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORIES[cat].map((sub) => (
                    <Link
                      key={sub}
                      to={`/products?category=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="px-3 py-1.5 text-xs rounded-full border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="mb-4">
              <p className="font-display font-semibold text-primary text-base mb-2">Collections</p>
              <div className="flex flex-wrap gap-2">
                {COLLECTIONS.map((col) => (
                  <Link
                    key={col}
                    to={`/products?collection=${encodeURIComponent(col)}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="px-3 py-1.5 text-xs rounded-full border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {col}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm md:hidden flex flex-col">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery..."
                className="flex-1 h-10"
                autoFocus
              />
              <Button type="submit" size="sm" className="h-10 px-4">Search</Button>
            </form>
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
