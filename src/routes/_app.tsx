import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const ready = useAuthRedirect("require");
  if (!ready) return null;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}