import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { DEFAULT_CREDENTIALS, login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Sokoto Red Goat Fertility Record Book" },
      {
        name: "description",
        content:
          "Sign in to the Sokoto Red Goat Fertility Record Book to manage farm and fertility records offline.",
      },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const ready = useAuthRedirect("guest");
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  if (!ready) return null;

  const onSubmit = (values: FormValues) => {
    if (login(values.username, values.password)) {
      toast.success("Welcome back");
      navigate({ to: "/dashboard", replace: true });
    } else {
      form.setError("password", { message: "Invalid username or password" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-md">
            SR
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Sokoto Red Goat
          </h1>
          <p className="text-sm text-muted-foreground">
            Fertility Record Book
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold">Sign in</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Enter your credentials to continue.
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
                      <Input
                        autoComplete="username"
                        placeholder="admin"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </Form>

        
        </div>
      </div>
    </div>
  );
}