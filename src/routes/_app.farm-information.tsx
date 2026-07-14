import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
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
import { DEFAULT_FARM, getFarm, saveFarm } from "@/lib/records";

export const Route = createFileRoute("/_app/farm-information")({
  head: () => ({
    meta: [{ title: "Farm Information — Fertility Record Book" }],
  }),
  component: FarmInformationPage,
});

const schema = z.object({
  farmName: z.string().min(1, "Farm name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  location: z.string().min(1, "Location is required"),
  recordYear: z
    .string()
    .regex(/^\d{4}$/, "Enter a 4-digit year, e.g. 2026"),
  veterinarySupervisor: z.string().min(1, "Supervisor name is required"),
});
type FormValues = z.infer<typeof schema>;

function FarmInformationPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_FARM,
  });

  useEffect(() => {
    form.reset(getFarm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (values: FormValues) => {
    saveFarm(values);
    toast.success("Farm information saved");
  };

  return (
    <>
      <PageHeader
        title="Farm Information"
        description="These details appear on printed records and the dashboard."
      />

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 md:grid-cols-2"
            noValidate
          >
            <FormField
              control={form.control}
              name="farmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sokoto Red Goat Research Farm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Town, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recordYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Year</FormLabel>
                  <FormControl>
                    <Input inputMode="numeric" placeholder="2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="veterinarySupervisor"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Veterinary Supervisor</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}