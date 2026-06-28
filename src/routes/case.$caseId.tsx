import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FlagIcon } from "@/components/FlagIcon";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Crosshair,
  FileText,
  ClipboardList,
  CheckSquare,
  DollarSign,
  Mail,
  FileCheck,
  Layers,
  LayoutGrid,
  Briefcase,
  CalendarDays,
  Shield,
  HelpCircle,
  ListChecks,
  History,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

export const Route = createFileRoute("/case/$caseId")({
  head: ({ params }) => ({
    meta: [
      { title: `Case ${params.caseId} — Screening Summary` },
      { name: "description", content: "Case screening summary with assignment details, status and quick actions." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: CaseSummary,
});

const tabs = [
  "Operations Dashboard",
  "My Work Permit",
  "Approvals",
  "Screening",
  "Compensation Benefits",
  "Processing",
  "Visa Processing",
  "Review",
];

const quickLinks = [
  { label: "Initiation Questionnaire", icon: ClipboardList },
  { label: "Questionnaire", icon: FileText },
  { label: "Documents", icon: FileCheck },
  { label: "Qualifying Rules", icon: CheckSquare },
  { label: "Salary", icon: DollarSign },
  { label: "Letters", icon: Mail },
  { label: "Generate Letters", icon: FileText },
  { label: "Casekit", icon: Layers },
  { label: "Visa/Work Information", icon: Briefcase },
  { label: "Appointment details", icon: CalendarDays },
  { label: "Insurance Details", icon: Shield },
  { label: "Clarification", icon: HelpCircle },
  { label: "Progress Tracker", icon: ListChecks },
  { label: "Emails", icon: Mail },
  { label: "Case Logs", icon: History },
];

function CaseSummary() {
  const { caseId } = Route.useParams();
  const tabsRef = useRef<HTMLDivElement>(null);
  const storageKey = `case-summary-collapsed:${caseId}`;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(storageKey) === "1");
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const scrollTabs = (dir: "left" | "right") => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
  };




  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader role="Case Manager" />

      {/* Nav tabs */}
      <nav className="bg-brand-navy">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 flex items-center">
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollTabs("left")}
            className="shrink-0 w-8 h-8 grid place-items-center text-white/90 hover:text-white hover:bg-white/10 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={tabsRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((t) => (
              <button
                key={t}
                className={`px-5 py-3.5 text-sm font-semibold uppercase tracking-wide whitespace-nowrap ${
                  t === "Screening"
                    ? "bg-white text-brand-navy rounded-t-md"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollTabs("right")}
            className="shrink-0 w-8 h-8 grid place-items-center text-white/90 hover:text-white hover:bg-white/10 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </nav>


      {/* Sub tab */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1400px] mx-auto px-8">
          <button className="relative py-3 text-sm font-semibold text-brand-navy">
            Screening Search
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />
          </button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">
        {/* Summary card */}
        <section className="bg-white rounded-lg shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm uppercase tracking-wide hover:underline">
              <ArrowLeft className="w-4 h-4" /> Summary
            </Link>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Expand summary" : "Collapse summary"}
              className="w-8 h-8 grid place-items-center rounded-full text-brand-blue hover:bg-brand-sky/15 transition-colors"
            >
              <ChevronUp className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          {collapsed && (
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-brand-navy">Immidart AU4</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-sky/20 text-brand-blue text-xs font-semibold">
                    Employee
                  </span>
                </div>
                <span className="text-brand-navy font-semibold">{caseId}</span>
                <span className="inline-flex items-center gap-1.5">
                  <FlagIcon code="in" />
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-semibold text-brand-navy">India</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FlagIcon code="au" />
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-semibold text-brand-navy">Australia</span>
                </span>
                <span>
                  <span className="text-brand-navy font-semibold">Status: </span>
                  <span className="text-emerald-600 font-semibold">Pending for Screening</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-5 py-1.5 rounded bg-emerald-500 text-white text-sm font-semibold shadow hover:bg-emerald-600 transition-colors">
                  Approve
                </button>
                <button className="px-5 py-1.5 rounded border border-brand-orange text-brand-orange text-sm font-semibold hover:bg-brand-orange/10 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          )}

          {!collapsed && (
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brand-navy">Immidart AU4</h1>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-brand-sky/20 text-brand-blue text-xs font-semibold">
                Employee
              </span>
            </div>

            <div className="mt-3 flex items-center gap-6 text-sm">
              <span className="text-brand-navy font-semibold">{caseId}</span>
              <span className="h-4 w-px bg-border" />
              <span className="text-muted-foreground">482-Skills in Demand (SID) Visa</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border bg-white text-sm">
                <span>🇮🇳</span>
                <span className="text-muted-foreground">Source:</span>
                <span className="font-semibold text-brand-navy">India</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border bg-white text-sm">
                <span>🇦🇺</span>
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-semibold text-brand-navy">Australia</span>
              </span>
            </div>

            {/* Details grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                { icon: Calendar, label: "Start Date", value: "23/May/2026" },
                { icon: Calendar, label: "End Date", value: "22/Oct/2026" },
                { icon: UserIcon, label: "Global Grade", value: "N/A" },
                { icon: Crosshair, label: "Deployment Model", value: "Local Hire" },
                { icon: UserIcon, label: "IWA No", value: "IWA00260534751" },
                { icon: UserIcon, label: "Case Initiator", value: "Iwa Six" },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-border grid place-items-center text-brand-blue shrink-0">
                    <d.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{d.label}</p>
                    <p className="text-sm font-semibold text-brand-navy">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status + actions */}
            <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm">
                <span className="text-brand-navy font-semibold">Status: </span>
                <span className="text-emerald-600 font-semibold">Pending for Screening</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-6 py-2 rounded bg-emerald-500 text-white text-sm font-semibold shadow hover:bg-emerald-600 transition-colors">
                  Approve
                </button>
                <button className="px-6 py-2 rounded border border-brand-orange text-brand-orange text-sm font-semibold hover:bg-brand-orange/10 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
          )}
        </section>

        {/* Quick links */}
        <section className="bg-white rounded-lg shadow-sm border border-border p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-5">
            {quickLinks.map((q) => (
              <button
                key={q.label}
                className="flex items-center gap-4 py-2 group"
                type="button"
              >
                <div className="w-12 h-12 rounded-full border border-border grid place-items-center text-brand-blue group-hover:bg-brand-sky/10 transition-colors shrink-0">
                  <q.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-brand-navy group-hover:text-brand-blue">
                  {q.label}
                </span>
              </button>
            ))}
          </div>
        </section>



        <footer className="text-center text-xs text-muted-foreground py-2">
          Copyright © 2026 Immidart Technologies LLP
        </footer>
      </main>
    </div>
  );
}
