import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login", replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-brand-canvas">
        <p className="text-sm text-muted-foreground">Checking session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
