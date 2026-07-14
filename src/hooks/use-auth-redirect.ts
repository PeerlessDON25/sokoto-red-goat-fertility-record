import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

/**
 * Client-only auth gate. TanStack Start prerenders public routes during
 * `build:dev`, so we cannot rely on localStorage in a loader — we redirect
 * from an effect after hydration instead.
 */
export function useAuthRedirect(mode: "require" | "guest") {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authed = isAuthenticated();
    if (mode === "require" && !authed) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (mode === "guest" && authed) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    setReady(true);
  }, [mode, navigate]);

  return ready;
}