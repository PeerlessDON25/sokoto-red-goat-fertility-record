import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BookOpenCheck,
  Building2,
  CalendarDays,
  Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DEFAULT_FARM, getFarm, getRecords } from "@/lib/records";
import type { FarmInfo, FertilityRecord } from "@/types";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Fertility Record Book" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [farm, setFarm] = useState<FarmInfo>(DEFAULT_FARM);
  const [records, setRecords] = useState<FertilityRecord[]>([]);

  useEffect(() => {
    setFarm(getFarm());
    setRecords(getRecords());
  }, []);

  const now = new Date();
  const dueSoon = records.filter((r) => {
    if (!r.expectedKiddingDate || r.actualKiddingDate) return false;
    const d = new Date(r.expectedKiddingDate);
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  }).length;
  const kidded = records.filter((r) => r.actualKiddingDate).length;

  const stats = [
    { label: "Total Records", value: records.length, icon: BookOpenCheck },
    { label: "Due within 30 days", value: dueSoon, icon: CalendarDays },
    { label: "Kiddings Recorded", value: kidded, icon: BookOpenCheck },
  ];

  return (
    <>
      <PageHeader
        title={farm.farmName ? `Welcome, ${farm.farmName}` : "Dashboard"}
        description={
          farm.ownerName
            ? `Owner: ${farm.ownerName} · Year: ${farm.recordYear}`
            : "Set up your farm information to get started."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          to="/farm-information"
          className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <Building2 className="mb-3 h-8 w-8 text-primary" />
          <h3 className="text-lg font-semibold">Farm Information</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Farm name, owner, location, record year and veterinary supervisor.
          </p>
        </Link>
        <Link
          to="/fertility-records"
          className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <BookOpenCheck className="mb-3 h-8 w-8 text-accent" />
          <h3 className="text-lg font-semibold">Fertility Records</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, search, print, and export fertility records for every doe.
          </p>
        </Link>
      </div>

      <div className="mt-6">
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <SettingsIcon className="h-4 w-4" /> Manage credentials
        </Link>
      </div>
    </>
  );
}