import { createFileRoute } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Download,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import {
  FertilityRecordForm,
  type FertilityFormValues,
} from "@/components/fertility-record-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadCsv, toCsv } from "@/lib/csv";
import {
  DEFAULT_FARM,
  deleteRecord,
  getFarm,
  getRecords,
  saveRecords,
  upsertRecord,
} from "@/lib/records";
import type { FarmInfo, FertilityRecord } from "@/types";

export const Route = createFileRoute("/_app/fertility-records")({
  head: () => ({
    meta: [{ title: "Fertility Records — Sokoto Red Goat" }],
  }),
  component: FertilityRecordsPage,
});

const CSV_COLUMNS: { key: keyof FertilityRecord; header: string }[] = [
  { key: "doeTag", header: "Doe Tag" },
  { key: "breed", header: "Breed" },
  { key: "serviceDate", header: "Service Date" },
  { key: "buckTag", header: "Buck Tag" },
  { key: "serviceType", header: "Service Type" },
  { key: "expectedKiddingDate", header: "Expected Kidding" },
  { key: "actualKiddingDate", header: "Actual Kidding" },
  { key: "kidsBorn", header: "Kids Born" },
  { key: "maleKids", header: "Male" },
  { key: "femaleKids", header: "Female" },
  { key: "kidsAlive", header: "Alive" },
  { key: "remarks", header: "Remarks" },
];

function FertilityRecordsPage() {
  const [farm, setFarm] = useState<FarmInfo>(DEFAULT_FARM);
  const [records, setRecords] = useState<FertilityRecord[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<FertilityRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "serviceDate", desc: true },
  ]);

  useEffect(() => {
    setFarm(getFarm());
    setRecords(getRecords());
  }, []);

  const columns = useMemo<ColumnDef<FertilityRecord>[]>(
    () => [
      { accessorKey: "doeTag", header: "Doe" },
      { accessorKey: "breed", header: "Breed" },
      { accessorKey: "serviceDate", header: "Service Date" },
      { accessorKey: "buckTag", header: "Buck" },
      { accessorKey: "serviceType", header: "Type" },
      { accessorKey: "expectedKiddingDate", header: "Expected" },
      { accessorKey: "actualKiddingDate", header: "Actual" },
      { accessorKey: "kidsBorn", header: "Born" },
      { accessorKey: "maleKids", header: "M" },
      { accessorKey: "femaleKids", header: "F" },
      { accessorKey: "kidsAlive", header: "Alive" },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ getValue }) => (
          <span className="line-clamp-2 max-w-xs whitespace-pre-wrap text-sm">
            {String(getValue() ?? "")}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1" data-no-print>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEditing(row.original);
                setDialogOpen(true);
              }}
              aria-label="Edit record"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDeleteId(row.original.id)}
              aria-label="Delete record"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: records,
    columns,
    state: { sorting, globalFilter: query },
    onSortingChange: setSorting,
    onGlobalFilterChange: setQuery,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleSubmit = (values: FertilityFormValues) => {
    const next = upsertRecord(records, { ...values, id: editing?.id });
    setRecords(next);
    saveRecords(next);
    toast.success(editing ? "Record updated" : "Record added");
    setDialogOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const next = deleteRecord(records, deleteId);
    setRecords(next);
    saveRecords(next);
    setDeleteId(null);
    toast.success("Record deleted");
  };

  const handleExport = () => {
    if (records.length === 0) {
      toast.info("No records to export");
      return;
    }
    const csv = toCsv(records, CSV_COLUMNS);
    const year = farm.recordYear || new Date().getFullYear();
    downloadCsv(`fertility-records-${year}.csv`, csv);
  };

  const handlePrint = () => window.print();

  const filtered = table.getFilteredRowModel().rows;

  return (
    <>
      <PageHeader
        title="Fertility Records"
        description={`${records.length} record${records.length === 1 ? "" : "s"} stored on this device.`}
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> New record
            </Button>
          </>
        }
      />

      <div
        className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm"
        data-no-print
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by doe, buck, breed, remarks…"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      {/* Print header — visible only in print output */}
      <div className="mb-4 hidden print:block">
        <h1 className="text-xl font-bold">
          {farm.farmName || "Sokoto Red Goat Farm"}
        </h1>
        <p className="text-sm">
          Owner: {farm.ownerName || "—"} · Location: {farm.location || "—"} ·
          Year: {farm.recordYear} · Supervisor:{" "}
          {farm.veterinarySupervisor || "—"}
        </p>
        <h2 className="mt-2 text-base font-semibold">Fertility Records</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className={
                      h.column.getCanSort() ? "cursor-pointer select-none" : ""
                    }
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc"
                      ? " ▲"
                      : h.column.getIsSorted() === "desc"
                        ? " ▼"
                        : ""}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {records.length === 0
                    ? "No records yet. Click ‘New record’ to add one."
                    : "No matching records."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filtered.length > 10 && (
        <div
          className="mt-3 flex items-center justify-between text-sm text-muted-foreground"
          data-no-print
        >
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit fertility record" : "New fertility record"}
            </DialogTitle>
          </DialogHeader>
          <FertilityRecordForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setDialogOpen(false);
              setEditing(null);
            }}
            submitLabel={editing ? "Update record" : "Save record"}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The record will be permanently
              removed from this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}