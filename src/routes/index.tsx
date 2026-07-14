import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({
      to: isAuthenticated() ? "/dashboard" : "/login",
      replace: true,
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      Loading…
    </div>
  );
}
