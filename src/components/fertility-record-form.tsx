import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FertilityRecord, ServiceType } from "@/types";

const schema = z.object({
  doeTag: z.string().min(1, "Doe tag is required"),
  breed: z.string().min(1, "Breed is required"),
  serviceDate: z.string().min(1, "Service date is required"),
  buckTag: z.string().min(1, "Buck tag is required"),
  serviceType: z.enum(["Natural", "Artificial Insemination"]),
  expectedKiddingDate: z.string().optional().default(""),
  actualKiddingDate: z.string().optional().default(""),
  kidsBorn: z.coerce.number().int().min(0).default(0),
  maleKids: z.coerce.number().int().min(0).default(0),
  femaleKids: z.coerce.number().int().min(0).default(0),
  kidsAlive: z.coerce.number().int().min(0).default(0),
  remarks: z.string().optional().default(""),
});

export type FertilityFormValues = z.infer<typeof schema>;

const EMPTY: FertilityFormValues = {
  doeTag: "",
  breed: "Sokoto Red",
  serviceDate: "",
  buckTag: "",
  serviceType: "Natural",
  expectedKiddingDate: "",
  actualKiddingDate: "",
  kidsBorn: 0,
  maleKids: 0,
  femaleKids: 0,
  kidsAlive: 0,
  remarks: "",
};

/** Goat gestation is ~150 days — auto-fill expected kidding date. */
function addDays(iso: string, days: number): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function FertilityRecordForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save record",
}: {
  initial?: FertilityRecord | null;
  onSubmit: (values: FertilityFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const form = useForm<FertilityFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    form.reset(initial ? { ...EMPTY, ...initial } : EMPTY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // Auto-suggest expected kidding date (150-day gestation) when the user
  // enters a service date and no expected date yet.
  const serviceDate = form.watch("serviceDate");
  useEffect(() => {
    const current = form.getValues("expectedKiddingDate");
    if (serviceDate && !current) {
      form.setValue("expectedKiddingDate", addDays(serviceDate, 150));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceDate]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 md:grid-cols-2"
        noValidate
      >
        <FormField
          control={form.control}
          name="doeTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doe Tag No.</FormLabel>
              <FormControl>
                <Input placeholder="e.g. SR-024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breed</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Service</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="buckTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buck Tag No.</FormLabel>
              <FormControl>
                <Input placeholder="e.g. B-07" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v as ServiceType)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Natural">Natural</SelectItem>
                  <SelectItem value="Artificial Insemination">
                    Artificial Insemination
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectedKiddingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Kidding Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="actualKiddingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Kidding Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kidsBorn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kids Born (total)</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maleKids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Male Kids</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="femaleKids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Female Kids</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kidsAlive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kids Alive</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 md:col-span-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}