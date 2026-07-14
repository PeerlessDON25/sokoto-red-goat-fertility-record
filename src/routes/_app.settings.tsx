import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getCredentials, logout, setCredentials } from "@/lib/auth";
import { STORAGE_KEYS, removeKey } from "@/lib/storage";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Fertility Record Book" }] }),
  component: SettingsPage,
});

const schema = z
  .object({
    username: z.string().min(3, "At least 3 characters"),
    password: z.string().min(4, "At least 4 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof schema>;

function SettingsPage() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", confirm: "" },
  });

  useEffect(() => {
    const c = getCredentials();
    form.reset({ username: c.username, password: c.password, confirm: c.password });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (v: FormValues) => {
    setCredentials({ username: v.username, password: v.password });
    toast.success("Credentials updated");
  };

  const clearAll = () => {
    if (!confirm("Delete ALL local data (farm info, records, credentials)?")) return;
    removeKey(STORAGE_KEYS.farm);
    removeKey(STORAGE_KEYS.records);
    removeKey(STORAGE_KEYS.credentials);
    logout();
    toast.success("All local data cleared");
    navigate({ to: "/login", replace: true });
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage login credentials and local data."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold">Login credentials</h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Credentials are stored locally on this device only.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save credentials
              </Button>
            </form>
          </Form>
        </div>

        <div className="rounded-xl border border-destructive/40 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Danger zone</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Permanently delete all farm information, fertility records, and
            credentials stored on this device. This cannot be undone.
          </p>
          <Button variant="destructive" className="mt-4" onClick={clearAll}>
            Clear all local data
          </Button>
        </div>
      </div>
    </>
  );
}