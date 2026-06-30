import { AppLoader } from "@/components/AppLoader";
import { AskImmibroButton } from "@/components/AskImmibroButton";
import { UserMenu } from "@/components/UserMenu";
import { ActionCentreButton } from "@/components/ActionCentreButton";
import { CreateRequestButton } from "@/components/CreateRequestButton";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Clock,
  ArrowDown,
  LayoutGrid,
  SlidersHorizontal,
  Globe2,
  BookOpen,
  HelpCircle,
  Briefcase,
  Plane,
  FileCheck,
  Scale,
  Mail,
  ListChecks,
  Bell,
  Wrench,
  FileText,
  XCircle,
  UserCog,
  Settings,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RequireAuth } from "@/components/RequireAuth";
import { clearAuth } from "@/lib/auth";

export const Route = createFileRoute("/index2")({
  head: () => ({
    meta: [
      { title: "Immidart — Case Management Dashboard (All clear)" },
      { name: "description", content: "Case manager view with no pending actions." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: () => (
    <RequireAuth>
      <Dashboard2 />
    </RequireAuth>
  ),
});

// New card first: "Total cases you've taken action" = 50
// All pending/action counts are 0. "SLA breaching this week" replaced by the new card.
const stats = [
  {
    label: "Total cases you've taken action",
    value: "50",
    badge: "Cases actioned",
    tone: "green" as const,
  },
  {
    label: "Overdue actions",
    value: "00",
    badge: "All clear",
    tone: "red" as const,
  },
  {
    label: "Cases approved this week",
    value: "00",
    badge: "Nothing yet",
    tone: "green" as const,
  },
  {
    label: "Total Immigration cases pending with you",
    value: "00",
    badge: "All clear",
    tone: "blue" as const,
  },
  {
    label: "Total Assignment cases pending with you",
    value: "00",
    badge: "All clear",
    tone: "blue" as const,
  },
  {
    label: "Total Travel cases pending with you",
    value: "00",
    badge: "All clear",
    tone: "blue" as const,
  },
];

const categories = [
  { label: "Assignments", Icon: Briefcase },
  { label: "Immigration", Icon: Globe2 },
  { label: "Travel", Icon: Plane },
  { label: "COC", Icon: FileCheck },
  { label: "LCA", Icon: Scale },
  { label: "Invite Letter", Icon: Mail },
];

// All actioned cases — shown in the "All Cases" section below
const rows = [
  ["WI231445780",       "Cristiana Lima Bonaldo", "Portugal",       "Approved",          "20/May/2026",  false],
  ["IWA1234567890",     "Marcus Ellison",         "United States",  "Approved",          "28/May/2026",  false],
  ["ATR1234567890",     "Yuki Tanaka",            "United Kingdom", "Completed",         "01/Jun/2026",  false],
  ["IWA1234567891",     "Priya Nair",             "Canada",         "Approved",          "10/Jun/2026",  false],
  ["WP9876543210",      "Andre Müller",           "Australia",      "Approved",          "15/Jun/2026",  false],
  ["IWA1234567892",     "Diana Prince",           "Germany",        "Completed",         "20/Jun/2026",  false],
  ["WP12103910391031",  "Clark Kent",             "Portugal",       "Approved",          "22/Jun/2026",  false],
  ["ATR9988776655",     "Barry Allen",            "Japan",          "Completed",         "25/Jun/2026",  false],
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Overdue":          "bg-brand-red/10 text-brand-red",
    "Pending Screening":"bg-brand-amber/10 text-brand-amber",
    "Docs Submitted":   "bg-emerald-500/10 text-emerald-600",
    "Visa Filed":       "bg-brand-blue/10 text-brand-blue",
    "Approved":         "bg-emerald-500/10 text-emerald-600",
    "Completed":        "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function Dashboard2() {
  const [alertsOpen, setAlertsOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCasesTab, setActiveCasesTab] = useState<"all" | "ongoing" | "sla" | "approval">("all");
  const [sortCol, setSortCol]         = useState<number | null>(null);
  const [sortAsc, setSortAsc]         = useState(true);
  const allCasesRef                   = useRef<HTMLElement>(null);
  const navigate                      = useNavigate();

  const handleSort = (col: number) => {
    if (sortCol === col) setSortAsc((a) => !a);
    else { setSortCol(col); setSortAsc(true); }
  };

  const sortedRows = sortCol === null ? rows : [...rows].sort((a, b) => {
    const av = String(a[sortCol]), bv = String(b[sortCol]);
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const scrollToAllCases = () => {
    allCasesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-brand-canvas">
      {/* Header */}
      <header className="bg-white border-b-2 border-brand-navy">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <span className="text-brand-blue">Immi</span>
            <span className="text-brand-orange">dart</span>
          </h1>
          <div className="flex items-center gap-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/search", search: { q: searchQuery } });
              }}
              className="relative"
            >
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-amber pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, visa guide, information portal."
                className="w-80 h-10 pl-9 pr-12 rounded border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <button type="submit" className="absolute right-0 top-0 h-10 w-10 bg-brand-navy text-white grid place-items-center rounded-r">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <ActionCentreButton />
            <CreateRequestButton />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Tools"
                  className="w-10 h-10 flex items-center justify-center bg-white border border-brand-navy text-brand-navy rounded hover:bg-brand-navy hover:text-white transition-colors"
                >
                  <Wrench className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-1">
                <Link to="/reports" className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <FileText className="w-4 h-4 text-brand-blue shrink-0" />
                  Reports
                </Link>
                <button type="button" className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <XCircle className="w-4 h-4 text-brand-blue shrink-0" />
                  Request Cancellation
                </button>
                <button type="button" className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <UserCog className="w-4 h-4 text-brand-blue shrink-0" />
                  Change Supervisor / Host Manager
                </button>
                <button type="button" className="flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <Settings className="w-4 h-4 text-brand-blue shrink-0" />
                  Configurations
                </button>
              </PopoverContent>
            </Popover>
            <button
              type="button"
              onClick={() => setAlertsOpen(true)}
              aria-label="Alerts"
              className="w-10 h-10 flex items-center justify-center bg-white border border-brand-navy text-brand-navy rounded hover:bg-brand-navy hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            <UserMenu name="Clark Kent" role="Case Manager" />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

        {/* Hero — KPI cards + Things to do */}
        <section className="grid grid-cols-1 lg:grid-cols-[680px_1fr] gap-4 items-stretch lg:h-[475px]">

          {/* KPI stat cards */}
          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[475px]">
            {stats.map((s) => {
              const toneStyles = {
                red:   { border: "border-l-brand-red",   badge: "bg-brand-red/10 text-brand-red",    icon: <AlertCircle className="w-3 h-3" /> },
                amber: { border: "border-l-brand-amber", badge: "bg-brand-amber/10 text-brand-amber", icon: <Clock className="w-3 h-3" /> },
                blue:  { border: "border-l-brand-blue",  badge: "bg-brand-blue/10 text-brand-blue",   icon: <Briefcase className="w-3 h-3" /> },
                green: { border: "border-l-emerald-500", badge: "bg-emerald-500/10 text-emerald-600", icon: <CheckCircle2 className="w-3 h-3" /> },
              }[s.tone];
              return (
                <div
                  key={s.label}
                  className={`bg-white border border-border border-l-4 ${toneStyles.border} rounded-lg p-4 shadow-sm flex flex-col justify-between gap-2`}
                >
                  <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
                  <span className="text-[38px] font-bold text-brand-navy leading-none">{s.value}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded w-fit ${toneStyles.badge}`}>
                    {toneStyles.icon}{s.badge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Things to do — empty state */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Things to do
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">0</span>
              </h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 grid place-items-center">
                <PartyPopper className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-bold text-brand-navy">Queue: 0. Legendary status: achieved.</p>
                <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                  Your things-to-do is emptier than a passport on day one. You can ask anything mobility with{" "}
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent("immibro:open"))}
                    className="text-brand-blue font-semibold hover:underline"
                  >
                    Immibro
                  </button>.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[264px]">
                <Link
                  to="/actions"
                  className="flex items-center justify-center gap-2 bg-brand-blue text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-blue/90 transition-colors"
                >
                  <ListChecks className="w-4 h-4" />
                  Open To-do
                </Link>
                <button
                  type="button"
                  onClick={scrollToAllCases}
                  className="flex items-center justify-center gap-2 bg-white border border-brand-navy text-brand-navy rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  View all case you've taken action
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick links strip */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-brand-navy">Applications</h2>
          <div className="grid grid-cols-6 gap-3">
            {categories.map(({ label, Icon }) => {
              const isImmigration = label === "Immigration";
              const base = "flex items-center gap-3 bg-white border border-border rounded-lg px-4 py-3 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-navy hover:text-white transition-colors group";
              if (isImmigration) {
                return (
                  <Link key={label} to="/immigration" className={base}>
                    <Icon className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
                    {label}
                  </Link>
                );
              }
              return (
                <button key={label} type="button" className={base}>
                  <Icon className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* All Cases — actioned */}
        <section ref={allCasesRef}>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h2 className="text-lg font-bold text-brand-navy cursor-default flex items-center gap-1.5">
                      All Cases
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </h2>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    All requests you've taken action on.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-4 border-b border-border flex items-center gap-8">
              {([
                { key: "all",      label: "All Cases"        },
                { key: "ongoing",  label: "Ongoing"          },
                { key: "sla",      label: "Nearing SLA"      },
                { key: "approval", label: "Pending approval" },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveCasesTab(key)}
                  className={`relative pb-3 text-sm font-semibold transition-colors ${
                    activeCasesTab === key ? "text-brand-blue" : "text-muted-foreground hover:text-brand-navy"
                  }`}
                >
                  {label}
                  {activeCasesTab === key && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-1.5 rounded text-sm font-medium hover:bg-brand-blue/90 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-brand-navy">Destination country</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portugal">Portugal</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-brand-navy">Visa Type</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Work Permit</SelectItem>
                          <SelectItem value="business">Business Visa</SelectItem>
                          <SelectItem value="travel">Travel Visa</SelectItem>
                          <SelectItem value="iwa">IWA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-brand-navy">Sort by</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select sort option" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sla-high">SLA: High to Low</SelectItem>
                          <SelectItem value="sla-low">SLA: Low to High</SelectItem>
                          <SelectItem value="travel-earliest">Travel Start: Earliest</SelectItem>
                          <SelectItem value="travel-latest">Travel Start: Latest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <Button variant="ghost" size="sm">Reset</Button>
                      <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90">Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search with case number, name, email"
                  className="w-full h-9 pl-9 pr-24 border-b border-border bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue"
                />
                <button className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 bg-transparent border border-brand-sky text-brand-sky px-3 py-1.5 rounded text-xs font-medium hover:bg-brand-sky/10 transition-colors">
                  <Search className="w-3.5 h-3.5" />
                  Search
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-table-head/60 text-brand-navy">
                    {["Case No.", "Assignee Name", "Traveling to", "Status", "Last date for action"].map((col, i) => (
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
                  {sortedRows.map((r, i) => (
                    <tr key={i} className="border-b border-border/60 hover:bg-accent/40">
                      <td className="px-4 py-3.5">
                        <Link to="/case/$caseId" params={{ caseId: String(r[0]) }} className="text-brand-blue underline">
                          {r[0]}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-foreground">{r[1]}</td>
                      <td className="px-4 py-3.5 text-foreground">{r[2]}</td>
                      <td className="px-4 py-3.5"><StatusPill status={String(r[3])} /></td>
                      <td className="px-4 py-3.5 text-sm font-medium text-foreground">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-1 border-t border-border pt-4">
              <button className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-40 transition-colors" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${p === 1 ? "bg-brand-navy text-white" : "text-muted-foreground hover:bg-accent"}`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 rounded flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Help section */}
        <section className="bg-white rounded-lg border border-border shadow-sm px-6 py-5">
          <h2 className="text-base font-bold text-brand-navy flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4" />
            Help
          </h2>
          <div className="flex items-center gap-3">
            <Link
              to="/visa-guide"
              className="flex items-center gap-2.5 bg-brand-canvas border border-border rounded-lg px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors group"
            >
              <Globe2 className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
              Visa Guide
            </Link>
            <button
              type="button"
              className="flex items-center gap-2.5 bg-brand-canvas border border-border rounded-lg px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors group"
            >
              <BookOpen className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
              Information Portal
            </button>
          </div>
        </section>

      </main>

      <Sheet open={alertsOpen} onOpenChange={setAlertsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-brand-navy flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-blue" />
              Alerts
            </SheetTitle>
          </SheetHeader>
          <ul className="flex-1 overflow-y-auto divide-y divide-border">
            <li className="p-8 text-center text-sm text-muted-foreground">No alerts right now.</li>
          </ul>
        </SheetContent>
      </Sheet>

      <AskImmibroButton />
    </div>
  );
}
