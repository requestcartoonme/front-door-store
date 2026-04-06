import { useEffect, useState } from "react";
import { handleCallback } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    (async () => {
      const ok = await handleCallback();
      setStatus(ok ? "success" : "error");
      if (ok) {
        // If this was opened as a new tab, close it after storing tokens
        // The opener page will pick up tokens from localStorage
        setTimeout(() => {
          window.close();
          // If window.close() doesn't work (not opened by script), redirect
          window.location.href = "/account";
        }, 500);
      } else {
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "loading" && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Signing you in...</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center">
          <p className="text-foreground font-semibold">Signed in successfully!</p>
          <p className="text-muted-foreground text-sm mt-1">Redirecting...</p>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="text-destructive font-semibold">Sign in failed</p>
          <p className="text-muted-foreground text-sm mt-1">Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}
