import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/immigration")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Immigration" },
      {
        name: "description",
        content:
          "Immigration operations dashboard with clarification status, screener queue and allocated cases.",
      },
      { property: "og:title", content: "Operations Dashboard — Immigration" },
      {
        property: "og:description",
        content: "Track immigration screening, clarifications and allocated cases.",
      },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: ImmigrationDashboard,
});

const tabs = [
  { label: "Operations Dashboard", active: true },
  { label: "My Work Permit" },
  { label: "Approvals" },
  { label: "Screening" },
  { label: "Compensation Benefits" },
  { label: "Processing" },
  { label: "Visa Processing" },
];

const stats = [
  { value: 2, label: "Clarification Pending with me" },
  { value: 10, label: "Clarification Responded" },
  { value: 28, label: "Clarification Requested" },
  { value: 33, label: "Pending for Screener Review" },
  { value: 425, label: "Allocated Case" },
];

function ImmigrationDashboard() {
  return (
    <div className="min-h-screen bg-brand-canvas flex flex-col">
      <PageHeader role="Case Manager" />

      {/* Tabs bar */}
      <nav className="bg-brand-navy">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.label}
              className={`px-5 py-3.5 text-sm font-semibold uppercase tracking-wide whitespace-nowrap ${
                t.active
                  ? "bg-white text-brand-navy rounded-t-md"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>



      {/* Sub-tab */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1400px] mx-auto px-8">
          <button className="relative py-3 text-sm font-medium text-brand-blue">
            Operations Dashboard
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />
          </button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-6 w-full flex-1 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Screener" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">Me</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[220px] bg-white">
              <SelectValue placeholder="--Select Destination Geo--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emea">EMEA</SelectItem>
              <SelectItem value="apac">APAC</SelectItem>
              <SelectItem value="amer">Americas</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[240px] bg-white">
              <SelectValue placeholder="--Select Destination Country--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Portugal</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="us">United States</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="--Select Request Type--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wp">Work Permit</SelectItem>
              <SelectItem value="iwa">IWA</SelectItem>
              <SelectItem value="atr">ATR</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[240px] flex">
            <input
              placeholder="Search By Request No / Name"
              className="flex-1 h-10 px-4 rounded-l border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <button
              aria-label="Search"
              className="h-10 w-10 bg-emerald-500 hover:bg-emerald-600 text-white grid place-items-center border border-emerald-500"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              aria-label="Clear"
              className="h-10 w-10 bg-brand-orange hover:opacity-90 text-white grid place-items-center rounded-r border border-brand-orange"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <article
              key={s.label}
              className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between min-h-[140px]"
            >
              <div className="flex flex-col">
                <p className="text-4xl font-light text-brand-navy">{s.value}</p>
                <div className="my-3 border-t border-dashed border-border w-32" />
                <p className="text-sm text-muted-foreground leading-tight max-w-[180px]">
                  {s.label}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-brand-sky/15 grid place-items-center shrink-0">
                <Send className="w-5 h-5 text-brand-sky -rotate-12" />
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        Copyright © 2026 Immidart Technologies LLP
      </footer>
    </div>
  );
}
