import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from '@/lib/shopify';

export function useProducts(query?: string, first = 50, sortKey?: string, reverse?: boolean) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['products', query, first, sortKey, reverse],
    queryFn: () => fetchProducts(first, query, sortKey, reverse),
  });
}

export function useBestSellers(first = 10) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['products', 'best-selling', first],
    queryFn: () => fetchProducts(first, undefined, 'BEST_SELLING'),
  });
}

export function useNewArrivals(first = 10) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ['products', 'new-arrivals', first],
    queryFn: () => fetchProducts(first, undefined, 'CREATED_AT', true),
  });
}

export function useProductByHandle(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProductByHandle(handle),
    enabled: !!handle,
  });
}
