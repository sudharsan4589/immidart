import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MyAssignmentCard } from "@/components/MyAssignmentCard";
import { PageHeader } from "@/components/PageHeader";
import { ArrowLeft, BookmarkCheck, CalendarIcon, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, LayoutGrid, LayoutList, ListTodo, Plus, Search, SlidersHorizontal, Trash2, User, X } from "lucide-react";
import * as React from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SavedSearch = {
  id: string;
  name: string;
  country?: string;
  requestType?: string;
  visaType?: string;
};

type Assignee = { id: string; name: string; role: string };
const ASSIGNEES: Assignee[] = [
  { id: "u1", name: "Clark Kent", role: "Immigration Lead" },
  { id: "u2", name: "Diana Prince", role: "Case Manager" },
  { id: "u3", name: "Bruce Wayne", role: "Senior Analyst" },
  { id: "u4", name: "Barry Allen", role: "Analyst" },
  { id: "u5", name: "Hal Jordan", role: "Reviewer" },
  { id: "u6", name: "Arthur Curry", role: "Coordinator" },
  { id: "u7", name: "Victor Stone", role: "Compliance Officer" },
];

type Todo = { id: string; title: string; assignee?: Assignee; dueDate?: Date; done: boolean };

export const Route = createFileRoute("/actions")({
  head: () => ({
    meta: [
      { title: "Action Center — Immidart" },
      { name: "description", content: "Review cases actioned this month, filter by application and action type, and sort by SLA." },
      { property: "og:title", content: "Action Center — Immidart" },
      { property: "og:description", content: "Cases actioned this month with filters and sorting." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: ActionCenter,
});

// Columns: [caseNo, name, country, status, initiated, sla, type]
// `type` drives the tab filter and kanban grouping; `status` is the surfaced workflow state.
const allRows = [
  ["IWA1234567890", "Cristiano Lima Ronaldo", "Portugal", "Pending for Screening",            "29 April 2026", "9 days",  "all"],
  ["ATR1234567890", "Marcus Ellison",         "Germany",  "Pending for Supervisor Approval", "28 April 2026", "2 days",  "approval"],
  ["IWA1234567891", "Yuki Tanaka",            "UK",       "Awaiting Clarification",          "27 April 2026", "5 days",  "clarification"],
  ["WP1234567890",  "Priya Nair",             "Canada",   "Pending for Host Manager Approval","26 April 2026", "3 days",  "approval"],
  ["IWA1234567892", "Andre Müller",           "Australia","Pending Documents Upload",        "25 April 2026", "12 days", "all"],
  ["ATR1234567891", "Diana Prince",           "USA",      "Clarification Requested",         "24 April 2026", "7 days",  "clarification"],
  ["WP1234567891",  "Bruce Wayne",            "France",   "Pending for Supervisor Approval", "23 April 2026", "1 day",   "approval"],
  ["IWA1234567893", "Barry Allen",            "Japan",    "Pending for Screening",           "22 April 2026", "15 days", "all"],
  ["ATR1234567892", "Hal Jordan",             "Singapore","Awaiting Clarification",          "21 April 2026", "4 days",  "clarification"],
  ["WP1234567892",  "Arthur Curry",           "UAE",      "Pending for Host Manager Approval","20 April 2026", "6 days",  "approval"],
  ["IWA1234567894", "Victor Stone",           "Brazil",   "Pending Documents Upload",        "19 April 2026", "10 days", "all"],
  ["ATR1234567893", "Clark Kent",             "Mexico",   "Clarification Requested",         "18 April 2026", "8 days",  "clarification"],
];

const PAGE_SIZE = 8;


function ActionCenter() {
  const [activeTab, setActiveTab] = React.useState<"all" | "approval" | "clarification">("all");
  const [boardMode, setBoardMode] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [sortCol, setSortCol] = React.useState<number | null>(null);
  const [sortAsc, setSortAsc] = React.useState(true);
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([
    { id: "s1", name: "Portugal Pending", country: "portugal", requestType: "new" },
    { id: "s2", name: "Work Permits", visaType: "work" },
  ]);
  const [activeSearch, setActiveSearch] = React.useState<string | null>(null);
  const [appFilters, setAppFilters] = React.useState<string[]>(["Assignments", "Immigration"]);
  const [slaQuickSort, setSlaQuickSort] = React.useState<"none" | "high-low" | "low-high">("none");

  const toggleAppFilter = (app: string) =>
    setAppFilters((prev) => prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]);

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    if (activeSearch === id) setActiveSearch(null);
  };
  const saveSearch = (s: SavedSearch) => setSavedSearches((prev) => [...prev, s]);

  const handleSort = (col: number) => {
    if (sortCol === col) setSortAsc((a) => !a);
    else { setSortCol(col); setSortAsc(true); }
  };

  const filteredRows = activeTab === "all"
    ? allRows
    : allRows.filter((r) => r[6] === activeTab);

  const sortedRows = (() => {
    let rows = filteredRows;
    if (sortCol !== null) {
      rows = [...rows].sort((a, b) => {
        const av = String(a[sortCol]), bv = String(b[sortCol]);
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    if (slaQuickSort !== "none") {
      rows = [...rows].sort((a, b) => {
        const da = slaDays(a[5]), db = slaDays(b[5]);
        return slaQuickSort === "high-low" ? db - da : da - db;
      });
    }
    return rows;
  })();

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const pagedRows = sortedRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Case Manager" />

      <main className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              aria-label="Go back"
              className="w-9 h-9 grid place-items-center rounded-full border border-border text-brand-navy hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-3xl font-bold text-brand-navy">Action Center</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setBoardMode(false)}
                title="Table view"
                aria-pressed={!boardMode}
                className={`h-10 px-3.5 flex items-center justify-center transition-colors ${!boardMode ? "bg-brand-navy text-white" : "text-muted-foreground hover:bg-accent"}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-border" />
              <button
                type="button"
                onClick={() => setBoardMode(true)}
                title="Kanban view"
                aria-pressed={boardMode}
                className={`h-10 px-3.5 flex items-center justify-center transition-colors ${boardMode ? "bg-brand-navy text-white" : "text-muted-foreground hover:bg-accent"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
            <div className="inline-flex items-center gap-6 bg-white border border-border rounded-lg px-5 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-brand-navy font-semibold text-sm">
                Cases actioned in
                <Select defaultValue="this-month">
                  <SelectTrigger className="w-auto gap-1 border-0 shadow-none p-0 h-auto text-brand-blue underline hover:no-underline focus:ring-0 focus:ring-offset-0 font-semibold text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-week">This week</SelectItem>
                    <SelectItem value="this-month">This month</SelectItem>
                    <SelectItem value="past-6-months">Past 6 months</SelectItem>
                    <SelectItem value="past-year">Past year</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-brand-navy">18</span>
                <span className="text-xs text-muted-foreground">Cases</span>
              </div>
            </div>
            <TodoSheet />
          </div>
        </div>


        {/* Reportee's overdue requests — shown when user is also a supervisor */}
        <div className="mt-6">
          <MyAssignmentCard />
        </div>

        {/* Body */}
        <section className="mt-6">
          {boardMode ? (
            <KanbanBoard
              rows={allRows}
              savedSearches={savedSearches}
              activeSearch={activeSearch}
              onSelectSearch={(id) => setActiveSearch(activeSearch === id ? null : id)}
              onDeleteSearch={deleteSavedSearch}
              onSave={saveSearch}
            />
          ) : (
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            {/* Section title bar with quick filters */}
            <header className="bg-brand-sky/15 px-5 py-3 flex items-center justify-between gap-4 flex-wrap border-b border-border">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-brand-navy">Pending Actions</h2>
                <span className="text-[11px] text-brand-navy/70 bg-white border border-border rounded-full px-2.5 py-0.5 font-medium">
                  {sortedRows.length} cases
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {["Assignments", "Immigration", "Travel", "Certificate of Coverage"].map((app) => {
                  const active = appFilters.includes(app);
                  return (
                    <button
                      key={app}
                      type="button"
                      onClick={() => toggleAppFilter(app)}
                      className={cn(
                        "text-xs font-medium rounded-full px-3 py-1.5 border transition-colors",
                        active
                          ? "bg-brand-blue text-white border-brand-blue"
                          : "bg-white text-brand-blue border-brand-blue/30 hover:border-brand-blue",
                      )}
                    >
                      {app}
                    </button>
                  );
                })}
                <Select value={slaQuickSort} onValueChange={(v) => setSlaQuickSort(v as "none" | "high-low" | "low-high")}>
                  <SelectTrigger className={cn("h-8 text-xs w-auto gap-1 bg-white", slaQuickSort !== "none" && "border-brand-blue text-brand-blue")}>
                    <SelectValue placeholder="Sort by SLA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sort by SLA</SelectItem>
                    <SelectItem value="high-low">SLA: High → Low</SelectItem>
                    <SelectItem value="low-high">SLA: Low → High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-border px-4">
              {([
                { key: "all", label: "All actions", count: allRows.length },
                { key: "approval", label: "Approvals", count: allRows.filter((r) => r[6] === "approval").length },
                { key: "clarification", label: "Clarifications", count: allRows.filter((r) => r[6] === "clarification").length },
              ] as const).map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setPage(1); }}
                  className={`relative py-3 px-4 text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
                    activeTab === key ? "text-brand-blue" : "text-muted-foreground hover:text-brand-navy"
                  }`}
                >
                  {label}
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                    activeTab === key ? "bg-brand-blue text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                  {activeTab === key && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />
                  )}
                </button>
              ))}
            </div>

            {/* Search + saved + advanced filter */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border/60 flex-wrap">
              <div className="relative">
                <input
                  placeholder="Search by case no, name..."
                  className="w-72 h-9 pl-3 pr-11 rounded border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
                <button className="absolute right-0 top-0 h-9 w-9 bg-brand-navy text-white grid place-items-center rounded-r">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {savedSearches.length > 0 && (
                  <SavedSearchDropdown
                    searches={savedSearches}
                    activeSearch={activeSearch}
                    onSelect={(id) => setActiveSearch(activeSearch === id ? null : id)}
                    onDelete={deleteSavedSearch}
                  />
                )}
                <AdvanceFilter onSave={saveSearch} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[840px]">
                <thead>
                  <tr className="bg-table-head/60 text-brand-navy">
                    {(["Case No.", "Assignee", "Travelling to", "Status", "SLA", "Initiated on"] as const).map((col, i) => (
                      <th key={col} className="text-left font-semibold px-4 py-3">
                        <button
                          onClick={() => handleSort(i)}
                          className="inline-flex items-center gap-1 hover:text-brand-blue transition-colors"
                        >
                          {col}
                          <span className="flex flex-col leading-none opacity-50">
                            <ChevronUp className={`w-3 h-3 -mb-0.5 ${sortCol === i && sortAsc ? "opacity-100 text-brand-blue" : ""}`} />
                            <ChevronDown className={`w-3 h-3 ${sortCol === i && !sortAsc ? "opacity-100 text-brand-blue" : ""}`} />
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                        No cases match the current filters
                      </td>
                    </tr>
                  ) : pagedRows.map((r, i) => (
                    <tr key={i} className="border-b border-border/60 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-4">
                        <a href="#" className="text-brand-blue font-semibold hover:underline font-mono text-xs">{r[0]}</a>
                      </td>
                      <td className="px-4 py-4 font-medium text-brand-navy whitespace-nowrap">{r[1]}</td>
                      <td className="px-4 py-4 text-foreground whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {countryCode(r[2])}
                          </span>
                          {r[2]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill status={r[3]} />
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap", slaTone(slaDays(r[5])))}>
                          {r[5]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground text-xs whitespace-nowrap">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-border">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    p === page ? "bg-brand-navy text-white" : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────────────

function slaDays(s: string): number {
  const m = s.match(/\d+/);
  return m ? Number(m[0]) : 99;
}

function slaTone(days: number): string {
  if (days <= 3)  return "bg-brand-red/10 text-brand-red border-brand-red/20";
  if (days <= 7)  return "bg-brand-amber/10 text-brand-amber border-brand-amber/20";
  return "bg-brand-blue/10 text-brand-blue border-brand-blue/20";
}

const COUNTRY_CODE: Record<string, string> = {
  Portugal: "PT", Germany: "DE", UK: "GB", "United Kingdom": "GB", Canada: "CA",
  Australia: "AU", USA: "US", "United States": "US", France: "FR", Japan: "JP",
  Singapore: "SG", UAE: "AE", Brazil: "BR", Mexico: "MX",
};
function countryCode(name: string): string {
  return COUNTRY_CODE[name] ?? name.slice(0, 2).toUpperCase();
}

// Status colour map — surfaced as a pill in the table and on each kanban card.
const STATUS_TONE: Record<string, string> = {
  "Pending for Supervisor Approval":  "bg-brand-amber/10 text-brand-amber border-brand-amber/30",
  "Pending for Host Manager Approval":"bg-brand-amber/10 text-brand-amber border-brand-amber/30",
  "Pending for Screening":            "bg-brand-blue/10 text-brand-blue border-brand-blue/30",
  "Pending Documents Upload":         "bg-brand-red/10 text-brand-red border-brand-red/30",
  "Awaiting Clarification":           "bg-brand-sky/20 text-brand-navy border-brand-sky/30",
  "Clarification Requested":          "bg-brand-sky/20 text-brand-navy border-brand-sky/30",
};

function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap", tone)}>
      {status}
    </span>
  );
}

// ── Kanban board ───────────────────────────────────────────────────────────
// 4 columns: Case manager actions / Clarifications / Submissions pending / My To-Do

const KANBAN_COLS = [
  { key: "all",           label: "Case manager actions", topBorder: "border-t-brand-blue",  badge: "bg-brand-blue/10 text-brand-blue"   },
  { key: "clarification", label: "Clarifications",       topBorder: "border-t-brand-amber", badge: "bg-brand-amber/10 text-brand-amber" },
  { key: "approval",      label: "Submissions pending",  topBorder: "border-t-brand-navy",  badge: "bg-brand-navy/10 text-brand-navy"   },
] as const;

type KanbanBoardProps = {
  rows: string[][];
  savedSearches: SavedSearch[];
  activeSearch: string | null;
  onSelectSearch: (id: string) => void;
  onDeleteSearch: (id: string) => void;
  onSave: (s: SavedSearch) => void;
};

function KanbanBoard({ rows, savedSearches, activeSearch, onSelectSearch, onDeleteSearch, onSave }: KanbanBoardProps) {
  const [appFilters, setAppFilters] = React.useState<string[]>([]);
  const [slaQuickSort, setSlaQuickSort] = React.useState<"none" | "high-low" | "low-high">("none");
  const [search, setSearch] = React.useState("");
  const toggleApp = (a: string) =>
    setAppFilters((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const filteredRows = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return r[0].toLowerCase().includes(q) || r[1].toLowerCase().includes(q) || r[2].toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Top toolbar — pills + sort + search + saved + advanced */}
      <div className="bg-white rounded-lg border border-border shadow-sm px-4 py-3 mb-4 flex items-center gap-3 flex-wrap">
        {["Assignments", "Immigration", "Travel", "Certificate of Coverage"].map((app) => {
          const active = appFilters.includes(app);
          return (
            <button
              key={app}
              type="button"
              onClick={() => toggleApp(app)}
              className={cn(
                "text-xs font-medium rounded-full px-3 py-1.5 border transition-colors",
                active ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-brand-blue border-brand-blue/30 hover:border-brand-blue",
              )}
            >
              {app}
            </button>
          );
        })}
        <Select value={slaQuickSort} onValueChange={(v) => setSlaQuickSort(v as "none" | "high-low" | "low-high")}>
          <SelectTrigger className={cn("h-8 text-xs w-auto gap-1 bg-white", slaQuickSort !== "none" && "border-brand-blue text-brand-blue")}>
            <SelectValue placeholder="Sort by SLA" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sort by SLA</SelectItem>
            <SelectItem value="high-low">SLA: High → Low</SelectItem>
            <SelectItem value="low-high">SLA: Low → High</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by case no, name..."
              className="w-60 h-9 pl-3 pr-11 rounded border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <button className="absolute right-0 top-0 h-9 w-9 bg-brand-navy text-white grid place-items-center rounded-r">
              <Search className="w-4 h-4" />
            </button>
          </div>
          {savedSearches.length > 0 && (
            <SavedSearchDropdown
              searches={savedSearches}
              activeSearch={activeSearch}
              onSelect={onSelectSearch}
              onDelete={onDeleteSearch}
            />
          )}
          <AdvanceFilter onSave={onSave} />
        </div>
      </div>

      {/* 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {KANBAN_COLS.map((col) => (
          <KanbanColumn key={col.key} col={col} rows={filteredRows} slaQuickSort={slaQuickSort} />
        ))}
        <TodoKanbanColumn />
      </div>
    </div>
  );
}

function KanbanColumn({
  col,
  rows,
  slaQuickSort,
}: {
  col: typeof KANBAN_COLS[number];
  rows: string[][];
  slaQuickSort: "none" | "high-low" | "low-high";
}) {
  const [appFilter, setAppFilter] = React.useState("all");
  const [colSlaSort, setColSlaSort] = React.useState<"high-low" | "low-high">("high-low");
  const [doneIds, setDoneIds] = React.useState<Set<string>>(new Set());
  const [showDone, setShowDone] = React.useState(false);

  const cards = rows
    .filter((r) => r[6] === col.key)
    .sort((a, b) => {
      const effective = slaQuickSort !== "none" ? slaQuickSort : colSlaSort;
      const da = slaDays(a[5]), db = slaDays(b[5]);
      return effective === "high-low" ? db - da : da - db;
    });

  const doneCount = cards.filter((r) => doneIds.has(r[0])).length;
  const visible = cards.filter((r) => showDone || !doneIds.has(r[0]));

  const toggleDone = (id: string) =>
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  return (
    <div className={`bg-white rounded-lg border border-border border-t-4 ${col.topBorder} flex flex-col shadow-sm`}>
      {/* Column header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
        <span className="font-semibold text-sm text-brand-navy">{col.label}</span>
        <span className={cn("inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold shrink-0", col.badge)}>
          {cards.length - doneCount}
        </span>
      </div>
      {/* Per-column controls */}
      <div className="px-3 py-2.5 border-b border-border/60 bg-accent/30 flex items-center gap-2">
        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="h-7 text-xs flex-1 min-w-0 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All applications</SelectItem>
            <SelectItem value="assignments">Assignments</SelectItem>
            <SelectItem value="immigration">Immigration</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={colSlaSort} onValueChange={(v) => setColSlaSort(v as "high-low" | "low-high")}>
          <SelectTrigger className="h-7 text-xs flex-1 min-w-0 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="high-low">SLA: High → Low</SelectItem>
            <SelectItem value="low-high">SLA: Low → High</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => setShowDone((v) => !v)}
          className={`h-7 px-2.5 rounded border text-xs font-medium whitespace-nowrap transition-colors ${showDone ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-muted-foreground border-border hover:border-brand-navy/40"}`}
        >
          {showDone ? "Hide done" : `Show done${doneCount > 0 ? ` (${doneCount})` : ""}`}
        </button>
      </div>
      {/* Cards */}
      <div className="p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-380px)]">
        {visible.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">No cases</div>
        ) : (
          visible.map((r) => {
            const done = doneIds.has(r[0]);
            return (
              <div
                key={r[0]}
                className={cn(
                  "group bg-white border border-border rounded-lg p-3.5 hover:border-brand-blue/40 hover:shadow-sm transition-all",
                  done && "opacity-50",
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <a href="#" className="text-xs font-bold text-brand-blue hover:underline font-mono">{r[0]}</a>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap border", slaTone(slaDays(r[5])))}>
                      {r[5]}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleDone(r[0])}
                      title={done ? "Mark as not done" : "Mark as done"}
                      className={cn(
                        "w-5 h-5 rounded-md border-2 grid place-items-center transition-colors",
                        done ? "bg-brand-blue border-brand-blue text-white" : "border-border hover:border-brand-blue opacity-0 group-hover:opacity-100",
                      )}
                    >
                      {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className={cn("text-sm font-semibold text-brand-navy truncate", done && "line-through")}>{r[1]}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {countryCode(r[2])}
                  </span>
                  <span>{r[2]}</span>
                </div>
                <div className="mt-2">
                  <StatusPill status={r[3]} />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Started {r[4]}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// In-board To-Do column — kept independent from the slide-out TodoSheet.
type BoardTodo = { id: string; title: string; assignee?: string; done: boolean };
function TodoKanbanColumn() {
  const [todos, setTodos] = React.useState<BoardTodo[]>([
    { id: "b1", title: "Review IWA1234567890 supporting documents", assignee: "Clark", done: false },
    { id: "b2", title: "Follow up on Portugal visa clarification",   assignee: "Diana", done: false },
  ]);
  const [showDone, setShowDone] = React.useState(false);
  const [sort, setSort] = React.useState<"added" | "due">("added");
  const [newTitle, setNewTitle] = React.useState("");

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const add = () => {
    if (!newTitle.trim()) return;
    setTodos((prev) => [{ id: `b${Date.now()}`, title: newTitle.trim(), done: false }, ...prev]);
    setNewTitle("");
  };

  const openCount = todos.filter((t) => !t.done).length;
  const visible = todos.filter((t) => showDone || !t.done);

  return (
    <div className="bg-white rounded-lg border border-border border-t-4 border-t-brand-orange flex flex-col shadow-sm">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ListTodo className="w-4 h-4 text-brand-orange" />
          <span className="font-semibold text-sm text-brand-navy">My To-Do</span>
        </div>
        <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[11px] font-bold bg-brand-orange/15 text-brand-orange shrink-0">
          {openCount}
        </span>
      </div>
      <div className="px-3 py-2.5 border-b border-border/60 bg-accent/30 flex items-center gap-2">
        <Select value={sort} onValueChange={(v) => setSort(v as "added" | "due")}>
          <SelectTrigger className="h-7 text-xs flex-1 min-w-0 bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="added">Order added</SelectItem>
            <SelectItem value="due">Due date</SelectItem>
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => setShowDone((v) => !v)}
          className={`h-7 px-2.5 rounded border text-xs font-medium whitespace-nowrap transition-colors ${showDone ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-muted-foreground border-border hover:border-brand-navy/40"}`}
        >
          {showDone ? "Hide done" : "Show done"}
        </button>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-380px)]">
        {visible.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group bg-white border border-border rounded-lg p-3 flex items-start gap-2.5 hover:border-brand-orange/40 hover:shadow-sm transition-all",
              t.done && "opacity-50",
            )}
          >
            <button
              type="button"
              onClick={() => toggle(t.id)}
              className={cn(
                "mt-0.5 w-5 h-5 rounded-md border-2 grid place-items-center shrink-0 transition-colors",
                t.done ? "bg-brand-orange border-brand-orange text-white" : "border-border hover:border-brand-orange",
              )}
              aria-label={t.done ? "Mark as not done" : "Mark as done"}
            >
              {t.done && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("text-xs font-medium text-brand-navy leading-snug", t.done && "line-through")}>{t.title}</p>
              {t.assignee && (
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] bg-brand-blue/10 text-brand-blue rounded-full px-2 py-0.5">
                    <User className="w-2.5 h-2.5" />{t.assignee}
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity mt-0.5"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {newTitle ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") add(); if (e.key === "Escape") setNewTitle(""); }}
              placeholder="Task title…"
              className="flex-1 min-w-0 h-8 px-2.5 rounded border-2 border-brand-orange bg-white text-xs placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="button" onClick={add} disabled={!newTitle.trim()} className="h-8 w-8 grid place-items-center rounded bg-brand-orange text-white disabled:opacity-40 hover:bg-brand-orange/90">
              <Check className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => setNewTitle("")} className="h-8 w-8 grid place-items-center rounded border border-border text-muted-foreground hover:bg-accent">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNewTitle(" ")}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-brand-orange/40 text-brand-orange/70 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5 transition-all text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Create a task
          </button>
        )}
      </div>
    </div>
  );
}

function DateField({ value, onChange, placeholder }: { value?: Date; onChange: (d?: Date) => void; placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal h-9", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
}

function SavedSearchDropdown({
  searches,
  activeSearch,
  onSelect,
  onDelete,
}: {
  searches: SavedSearch[];
  activeSearch: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const active = searches.find((s) => s.id === activeSearch);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`inline-flex items-center gap-2 h-9 px-3 rounded border text-sm font-medium transition-colors ${active ? "bg-brand-navy text-white border-brand-navy" : "bg-white text-brand-navy border-border hover:border-brand-navy"}`}>
          <BookmarkCheck className="w-4 h-4" />
          {active ? active.name : "Saved filters"}
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        {searches.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer group transition-colors ${activeSearch === s.id ? "bg-brand-navy text-white" : "hover:bg-accent text-foreground"}`}
            onClick={() => { onSelect(s.id); setOpen(false); }}
          >
            <span className="flex items-center gap-2 truncate">
              {activeSearch === s.id && <Check className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{s.name}</span>
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
              className={`shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${activeSearch === s.id ? "hover:bg-white/20 text-white" : "hover:bg-muted text-muted-foreground"}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {searches.length === 0 && (
          <p className="text-xs text-muted-foreground px-3 py-2">No saved searches</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

const countryLabels: Record<string, string> = { portugal: "Portugal", germany: "Germany", usa: "USA", uk: "UK", canada: "Canada" };
const requestTypeLabels: Record<string, string> = { new: "New", extension: "Extension", modification: "Modification" };
const visaTypeLabels: Record<string, string> = { work: "Work Permit", business: "Business Visa", travel: "Travel Visa", iwa: "IWA" };

function AdvanceFilter({ onSave }: { onSave?: (s: SavedSearch) => void }) {
  const [open, setOpen] = React.useState(false);
  const [country, setCountry] = React.useState<string>();
  const [requestType, setRequestType] = React.useState<string>();
  const [visaType, setVisaType] = React.useState<string>();
  const [travelStartFrom, setTravelStartFrom] = React.useState<Date>();
  const [travelStartTo, setTravelStartTo] = React.useState<Date>();
  const [travelEndFrom, setTravelEndFrom] = React.useState<Date>();
  const [travelEndTo, setTravelEndTo] = React.useState<Date>();
  const [saveName, setSaveName] = React.useState("");
  const [showSaveInput, setShowSaveInput] = React.useState(false);

  const reset = () => {
    setCountry(undefined); setRequestType(undefined); setVisaType(undefined);
    setTravelStartFrom(undefined); setTravelStartTo(undefined);
    setTravelEndFrom(undefined); setTravelEndTo(undefined);
    setSaveName(""); setShowSaveInput(false);
  };

  const hasFilters = !!(country || requestType || visaType || travelStartFrom || travelEndFrom);

  const handleSave = () => {
    if (!saveName.trim()) return;
    onSave?.({ id: `s${Date.now()}`, name: saveName.trim(), country, requestType, visaType });
    setSaveName(""); setShowSaveInput(false); setOpen(false);
  };

  // Builds a readable default name from whichever fields are selected,
  // e.g. "Portugal · New · Work Permit" — used when the user hasn't typed a custom name.
  const buildAutoName = () => {
    const parts = [
      country && countryLabels[country],
      requestType && requestTypeLabels[requestType],
      visaType && visaTypeLabels[visaType],
    ].filter(Boolean) as string[];
    return parts.length ? parts.join(" · ") : "Custom filter";
  };

  // One-click save: persists the current selections as a saved search (auto-named if
  // the user hasn't typed one) and applies the filter by closing the modal.
  const handleSaveAndApply = () => {
    const name = saveName.trim() || buildAutoName();
    onSave?.({ id: `s${Date.now()}`, name, country, requestType, visaType });
    setSaveName(""); setShowSaveInput(false); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-blue/90 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Advance Filter
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-brand-navy">Advance Filter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">

        <div className="space-y-2">
          <Label>Destination Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="portugal">Portugal</SelectItem>
              <SelectItem value="germany">Germany</SelectItem>
              <SelectItem value="usa">USA</SelectItem>
              <SelectItem value="uk">UK</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Request Type</Label>
          <Select value={requestType} onValueChange={setRequestType}>
            <SelectTrigger><SelectValue placeholder="Select request type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="extension">Extension</SelectItem>
              <SelectItem value="modification">Modification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Visa Type</Label>
          <Select value={visaType} onValueChange={setVisaType}>
            <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work Permit</SelectItem>
              <SelectItem value="business">Business Visa</SelectItem>
              <SelectItem value="travel">Travel Visa</SelectItem>
              <SelectItem value="iwa">IWA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Travel Start Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <DateField value={travelStartFrom} onChange={setTravelStartFrom} placeholder="From" />
            <DateField value={travelStartTo} onChange={setTravelStartTo} placeholder="To" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Travel End Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <DateField value={travelEndFrom} onChange={setTravelEndFrom} placeholder="From" />
            <DateField value={travelEndTo} onChange={setTravelEndTo} placeholder="To" />
          </div>
        </div>

        {/* Save search */}
        {hasFilters && (
          <div className="border-t border-border pt-3">
            {!showSaveInput ? (
              <button
                onClick={() => setShowSaveInput(true)}
                className="inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline"
              >
                <BookmarkCheck className="w-4 h-4" />
                Save this search
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  autoFocus
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="Name this search…"
                  className="h-8 text-sm flex-1"
                />
                <Button size="sm" onClick={handleSave} disabled={!saveName.trim()} className="bg-brand-navy hover:bg-brand-navy/90">
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowSaveInput(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
          <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90" onClick={() => setOpen(false)}>Apply</Button>
          <Button
            size="sm"
            onClick={handleSaveAndApply}
            disabled={!hasFilters}
            title={hasFilters ? undefined : "Select at least one field to save a filter"}
            className="bg-brand-navy hover:bg-brand-navy/90 gap-1.5"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Save &amp; Apply Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssigneePicker({ value, onChange }: { value?: Assignee; onChange: (a: Assignee) => void }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const filtered = ASSIGNEES.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.role.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs rounded-full border border-border bg-white px-2.5 py-1 text-brand-navy hover:bg-accent transition-colors"
        >
          {value ? (
            <>
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-[10px] bg-brand-blue/10 text-brand-blue">
                  {value.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{value.name}</span>
            </>
          ) : (
            <>
              <User className="w-3.5 h-3.5" />
              <span>Assign to</span>
            </>
          )}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignee..."
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">No users found</div>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  onChange(a);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-accent transition-colors"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs bg-brand-blue/10 text-brand-blue">
                    {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-navy truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.role}</p>
                </div>
                {value?.id === a.id && <Check className="w-4 h-4 text-brand-blue" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TodoSheet() {
  const [todos, setTodos] = React.useState<Todo[]>([
    { id: "t1", title: "Review IWA1234567890 supporting documents", assignee: ASSIGNEES[0], done: false },
    { id: "t2", title: "Follow up on Portugal visa clarification", assignee: ASSIGNEES[1], done: false },
    { id: "t3", title: "Confirm travel dates with Cristiano", done: true },
  ]);
  const [newTitle, setNewTitle] = React.useState("");
  const [newAssignee, setNewAssignee] = React.useState<Assignee>();
  const [newDueDate, setNewDueDate] = React.useState<Date>();

  const addTodo = () => {
    if (!newTitle.trim()) return;
    setTodos((prev) => [
      { id: `t${Date.now()}`, title: newTitle.trim(), assignee: newAssignee, dueDate: newDueDate, done: false },
      ...prev,
    ]);
    setNewTitle("");
    setNewAssignee(undefined);
    setNewDueDate(undefined);
  };

  const toggle = (id: string) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const assign = (id: string, a: Assignee) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, assignee: a } : t)));
  const setDue = (id: string, d?: Date) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, dueDate: d } : t)));

  const openCount = todos.filter((t) => !t.done).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center gap-3 bg-brand-navy text-white rounded-lg px-5 py-4 shadow-sm hover:bg-brand-navy/90 transition-colors">
          <ListTodo className="w-5 h-5" />
          <span className="font-semibold">To-Do</span>
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-brand-orange text-white text-xs font-bold">
            {openCount}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-brand-navy flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-brand-blue" />
            My To-Do List
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            {openCount} open · {todos.length - openCount} completed
          </p>
        </SheetHeader>

        <div className="px-6 py-4 border-b border-border bg-brand-sky/10 space-y-3">
          <Label className="text-xs font-semibold text-brand-navy uppercase tracking-wide">
            Add new task
          </Label>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="What needs to be done?"
            className="bg-white"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <AssigneePicker value={newAssignee} onChange={setNewAssignee} />
              <DueDatePicker value={newDueDate} onChange={setNewDueDate} />
            </div>
            <Button
              size="sm"
              onClick={addTodo}
              disabled={!newTitle.trim()}
              className="bg-brand-blue hover:bg-brand-blue/90"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {todos.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-12">
              No tasks yet. Add one above.
            </div>
          ) : (
            todos.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "group flex items-start gap-3 rounded-lg border border-border bg-white p-3 hover:shadow-sm transition-shadow",
                  t.done && "opacity-60",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(t.id)}
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded-md border-2 grid place-items-center shrink-0 transition-colors",
                    t.done
                      ? "bg-brand-blue border-brand-blue text-white"
                      : "border-border hover:border-brand-blue",
                  )}
                  aria-label={t.done ? "Mark as not done" : "Mark as done"}
                >
                  {t.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p
                    className={cn(
                      "text-sm text-brand-navy leading-snug",
                      t.done && "line-through",
                    )}
                  >
                    {t.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <AssigneePicker value={t.assignee} onChange={(a) => assign(t.id, a)} />
                    <DueDatePicker value={t.dueDate} onChange={(d) => setDue(t.id, d)} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DueDatePicker({ value, onChange }: { value?: Date; onChange: (d?: Date) => void }) {
  const [open, setOpen] = React.useState(false);
  const isOverdue = value && value < new Date(new Date().toDateString());
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 text-xs rounded-full border border-border bg-white px-2.5 py-1 text-brand-navy hover:bg-accent transition-colors",
            isOverdue && !value?.toString().includes("Invalid") && "border-destructive/40 text-destructive",
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          {value ? <span className="font-medium">{format(value, "MMM d, yyyy")}</span> : <span>Due date</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d);
            setOpen(false);
          }}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
        {value && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}


