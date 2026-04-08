import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { isAuthenticated, startLogin, logout } from "@/lib/auth";
import { User, LogOut } from "lucide-react";

export default function Login() {
  const authed = isAuthenticated();
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-10">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Customer Account</h1>
          {authed ? (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground text-sm">You are signed in.</p>
              <Button onClick={() => logout("/")} className="flex items-center gap-2 mx-auto">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground text-sm">Sign in to view your orders and manage your account.</p>
              <Button onClick={() => startLogin()} size="lg" className="w-full rounded-xl font-semibold">
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
