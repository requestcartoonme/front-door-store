import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { isAuthenticated, getIdTokenClaims, startLogin } from "@/lib/auth";
import { useEffect, useState } from "react";
import { customerAccountRequest, CUSTOMER_ORDERS_QUERY, getCustomerAccountEndpoint } from "@/lib/customerAccount";
import { User, Package, Loader2 } from "lucide-react";

export default function Account() {
  const authed = isAuthenticated();
  const claims = getIdTokenClaims();
  const [customerInfo, setCustomerInfo] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (claims) {
      const name = (claims.name as string) || (claims.given_name as string) || (claims.displayName as string) || "";
      const email = (claims.email as string) || "";
      setCustomerInfo({ name, email });
    }
  }, [claims]);

  type OrderNode = {
    id: string;
    name?: string;
    number?: number;
    processedAt?: string;
    totalPrice?: { amount: string; currencyCode: string } | null;
    statusPageUrl?: string;
  };
  const [orders, setOrders] = useState<OrderNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) {
      setOrders(null);
      setError(null);
      setCustomerInfo(null);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    customerAccountRequest(CUSTOMER_ORDERS_QUERY, { first: 10 })
      .then((data) => {
        if (!mounted) return;
        if (!data) { setError("Customer Account API endpoint or token missing."); setOrders(null); return; }
        type GraphQLHttpError = { __httpError: string; __body?: string };
        type GraphQLErrorItem = { message: string };
        type GraphQLSuccess = { data?: { customer?: { firstName?: string; lastName?: string; displayName?: string; emailAddress?: { emailAddress: string }; orders?: { edges?: Array<{ node: OrderNode }> } } }; errors?: GraphQLErrorItem[] };
        if ((data as GraphQLHttpError).__httpError) {
          const httpErr = data as any;
          let bodyMsg = httpErr.__body || "";
          if (bodyMsg.includes("<!DOCTYPE html>") || bodyMsg.includes("<html")) bodyMsg = "HTML Error Page received. Check endpoint or Shop ID.";
          else if (bodyMsg.length > 200) bodyMsg = bodyMsg.substring(0, 200) + "...";
          setError(`HTTP error: ${httpErr.__httpError} - ${bodyMsg}`);
          setOrders(null); return;
        }
        if ((data as any).error === 'Internal Server Error') { setError(`Server Error: ${(data as any).message}`); setOrders(null); return; }
        const success = data as GraphQLSuccess;
        if (success.errors?.length) setError(`API error: ${success.errors[0].message}`);
        const customer = success?.data?.customer;
        if (customer) {
          const fullName = customer.displayName || [customer.firstName, customer.lastName].filter(Boolean).join(" ");
          const email = customer.emailAddress?.emailAddress || "";
          if (fullName || email) setCustomerInfo({ name: fullName || customerInfo?.name || "", email: email || customerInfo?.email || "" });
        }
        const edges = success?.data?.customer?.orders?.edges ?? [];
        setOrders(edges.map((e) => e.node));
      })
      .catch(() => { if (!mounted) return; setOrders(null); setError("Failed to fetch orders."); })
      .finally(() => { if (!mounted) return; setLoading(false); });
    return () => { mounted = false; };
  }, [authed]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">My Account</h1>
          {authed ? (
            <div className="space-y-6">
              {/* Profile card */}
              <div className="bg-muted/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{customerInfo?.name || "Customer"}</p>
                    {customerInfo?.email && <p className="text-xs sm:text-sm text-muted-foreground">{customerInfo.email}</p>}
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div>
                <h2 className="font-display text-lg sm:text-xl font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-secondary" /> Orders
                </h2>
                {error && (
                  <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs sm:text-sm mb-3">
                    <p>{error}</p>
                  </div>
                )}
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="border border-border rounded-xl p-3 sm:p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm sm:text-base">{o.name || `Order #${o.number}`}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{o.processedAt ? new Date(o.processedAt).toLocaleDateString() : ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm sm:text-base">
                            {o.totalPrice?.currencyCode === 'INR' ? '₹' : ''}{parseFloat(o.totalPrice?.amount || '0').toFixed(0)}
                          </p>
                          {o.statusPageUrl && (
                            <a href={o.statusPageUrl} className="text-primary text-xs sm:text-sm hover:underline" target="_blank" rel="noopener noreferrer">Track →</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-xl">
                    <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4 text-sm">Please sign in to view your account and orders.</p>
              <Button onClick={() => startLogin()} size="lg" className="rounded-xl font-semibold">
                <User className="h-4 w-4 mr-2" />
                Sign in with Shopify
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
