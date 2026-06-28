import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  FileBarChart2,
  LayoutDashboard,
  Globe2,
  Briefcase,
  Plane,
  FileCheck,
  TrendingUp,
  Clock,
  ExternalLink,
} from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/PageHeader";
import { reportApplications } from "@/data/reportApplications";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Immidart — Reports" },
      {
        name: "description",
        content: "Generate and review saved reports for each application.",
      },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: () => (
    <RequireAuth>
      <ReportsHome />
    </RequireAuth>
  ),
});

const dashboards = [
  {
    id: "db-1",
    name: "Assignment Overview",
    description: "Live headcount, destination breakdown and assignment stage funnel across all active relocations.",
    Icon: Briefcase,
    lastViewed: "Today, 09:14 AM",
    tag: "Assignments",
  },
  {
    id: "db-2",
    name: "Immigration Pipeline",
    description: "Visa filing stages, SLA health and decision turnaround times across all open immigration cases.",
    Icon: Globe2,
    lastViewed: "Yesterday, 03:40 PM",
    tag: "Immigration",
  },
  {
    id: "db-3",
    name: "Travel Analytics",
    description: "Business travel volume, destination frequency and trip cost trends for the current quarter.",
    Icon: Plane,
    lastViewed: "22 Jun 2026",
    tag: "Travel",
  },
  {
    id: "db-4",
    name: "SLA Performance",
    description: "Tracks SLA compliance rates, breach counts and average processing times by case type and region.",
    Icon: TrendingUp,
    lastViewed: "20 Jun 2026",
    tag: "All modules",
  },
  {
    id: "db-5",
    name: "Compliance Monitor",
    description: "Certificate of coverage, LCA filings and invite letter issuance status across the portfolio.",
    Icon: FileCheck,
    lastViewed: "18 Jun 2026",
    tag: "Compliance",
  },
  {
    id: "db-6",
    name: "Pending Actions Tracker",
    description: "Real-time view of overdue actions, approvals awaiting sign-off and clarifications pending response.",
    Icon: Clock,
    lastViewed: "Today, 08:52 AM",
    tag: "All modules",
  },
];

type Tab = "reports" | "dashboards";

function ReportsHome() {
  const [activeTab, setActiveTab] = useState<Tab>("reports");

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader role="Case Manager" />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* Tab bar */}
        <div className="border-b border-border flex items-center gap-0">
          <button
            onClick={() => setActiveTab("reports")}
            className={`relative pb-3 px-4 text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
              activeTab === "reports" ? "text-brand-blue" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            <FileBarChart2 className="w-4 h-4" />
            Reports
            {activeTab === "reports" && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />}
          </button>
          <button
            onClick={() => setActiveTab("dashboards")}
            className={`relative pb-3 px-4 text-sm font-semibold transition-colors inline-flex items-center gap-2 ${
              activeTab === "dashboards" ? "text-brand-blue" : "text-muted-foreground hover:text-brand-navy"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboards
            {activeTab === "dashboards" && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />}
          </button>
        </div>

        {/* Reports tab */}
        {activeTab === "reports" && (
          <>
            <p className="text-sm text-muted-foreground">
              Select an application to view its saved reports or generate a new one.
            </p>
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {reportApplications.map(({ id, label, Icon, description, reports }) => (
                <Link
                  key={id}
                  to="/reports/$appId"
                  params={{ appId: id }}
                  className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all flex flex-col gap-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-md bg-brand-blue/10 grid place-items-center">
                      <Icon className="w-5 h-5 text-brand-blue" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-brand-navy/5 text-brand-navy">
                      {reports.length} saved {reports.length === 1 ? "report" : "reports"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                      {label}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{description}</p>
                  </div>
                </Link>
              ))}
            </section>
          </>
        )}

        {/* Dashboards tab */}
        {activeTab === "dashboards" && (
          <>
            <p className="text-sm text-muted-foreground">
              Open a live dashboard to monitor real-time metrics across your mobility programme.
            </p>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboards.map(({ id, name, description, Icon, lastViewed, tag }) => (
                <button
                  key={id}
                  type="button"
                  className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow-md hover:border-brand-blue/40 transition-all flex flex-col gap-3 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-10 h-10 rounded-md bg-brand-blue/10 grid place-items-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-blue" />
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-brand-blue transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                      {name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-1 rounded bg-brand-navy/5 text-brand-navy">
                      {tag}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Last viewed: {lastViewed}</span>
                  </div>
                </button>
              ))}
            </section>
          </>
        )}

      </main>
    </div>
  );
}
