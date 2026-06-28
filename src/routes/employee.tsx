import { AppLoader } from "@/components/AppLoader";
import { AskImmibroButton } from "@/components/AskImmibroButton";
import { FlagIcon } from "@/components/FlagIcon";
import { MyAssignmentCard } from "@/components/MyAssignmentCard";
import { PageHeader } from "@/components/PageHeader";
import { ApplicationBadge } from "@/components/ApplicationBadge";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  LayoutGrid,
  Info,
  LifeBuoy,
  Globe2,
  BookOpen,
  Briefcase,
  ListChecks,
  ListTree,
  ChevronRight,
  CornerDownRight,
  Plane,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function StatusPill({ status, className }: { status: string; className?: string }) {
  const map: Record<string, string> = {
    "Pending for Approval":  "bg-brand-amber/10 text-brand-amber",
    "Pending for Screening": "bg-emerald-500/10 text-emerald-600",
    "Visa Filed":            "bg-brand-blue/10 text-brand-blue",
    "Awaiting Decision":     "bg-brand-sky/20 text-brand-navy",
    "Docs Submitted":        "bg-emerald-500/10 text-emerald-600",
    "Approved":              "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${map[status] ?? "bg-muted text-muted-foreground"} ${className ?? ""}`}>
      {status}
    </span>
  );
}

export const Route = createFileRoute("/employee")({
  head: () => ({
    meta: [
      { title: "Immidart — Employee" },
      { name: "description", content: "Employee home with actions, assignment progress and help centre." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: EmployeeHome,
});

// Plain-English tasks replacing the jargon-heavy action carousel
// type: "task" = general action items · "approval" = needs your confirmation/acceptance · "clarification" = case manager needs more info from you
const tasks = [
  {
    id: "WP1039203903",
    type: "task" as const,
    app: "Immigration" as const,
    label: "US Work Permit",
    title: "Upload your documents",
    description: "2 documents are needed from you before your Work Permit application can move forward.",
    dueDate: "20 May 2026",
    urgent: true,
    actionLabel: "Upload documents",
  },
  {
    id: "WP1039203903-2",
    type: "task" as const,
    app: "Assignments" as const,
    label: "US Work Permit",
    title: "Accept your relocation offer letter",
    description: "Review and accept the terms of your relocation offer so your assignment can proceed.",
    dueDate: "22 May 2026",
    urgent: false,
    actionLabel: "Review & accept",
  },
  {
    id: "ATR5556667777",
    type: "task" as const,
    app: "Travel" as const,
    label: "UK Business Travel",
    title: "Confirm your travel dates",
    description: "Your UK business trip is waiting for you to confirm your travel dates to proceed with booking.",
    dueDate: "28 May 2026",
    urgent: false,
    actionLabel: "Confirm dates",
  },
  {
    id: "WP1039203903-3",
    type: "clarification" as const,
    app: "Immigration" as const,
    label: "US Work Permit",
    title: "Clarify a discrepancy in your visa application",
    description: "Your case manager needs more detail about a previous travel entry before filing can continue.",
    dueDate: "21 May 2026",
    urgent: true,
    actionLabel: "Respond",
  },
];

const todoTabs = [
  { key: "task", label: "My request" },
  { key: "clarification", label: "Clarifications" },
] as const;
type TodoTabKey = (typeof todoTabs)[number]["key"];

// 5-step assignment journey
const assignmentSteps = ["Initiated", "Documents", "Filing", "Decision", "Active"];
const currentAssignmentStep = 1; // currently at "Documents"
const assignmentProgress = Math.round((currentAssignmentStep / (assignmentSteps.length - 1)) * 100);

// Application categories — static 2×2 grid
const appCategories = [
  { label: "Assignments", Icon: Briefcase, desc: "Your relocations & transfers", to: "/" as const },
  { label: "Immigration", Icon: Globe2, desc: "Visas & work permits", to: "/immigration" as const },
  { label: "Travel", Icon: Plane, desc: "Business trips & bookings", to: "/" as const },
  { label: "Coverage", Icon: ShieldCheck, desc: "Insurance & certificates", to: "/" as const },
];

const documents = [
  { name: "Passport.pdf", category: "Immigration", type: "Identity", request: "WP1039203903", uploaded: "10/Mar/2026", size: "1.2 MB", description: "Scanned copy of employee's passport (bio page) used for identity verification across all immigration filings." },
  { name: "H-1B Approval Notice.pdf", category: "Immigration", type: "Visa Document", request: "WP1039203903", uploaded: "15/Mar/2026", size: "820 KB", description: "USCIS Form I-797 approval notice confirming H-1B petition status and validity dates." },
  { name: "Offer Letter.pdf", category: "Assignments", type: "Employment", request: "WP1039203903", uploaded: "02/Feb/2026", size: "210 KB", description: "Official employment offer letter detailing role, salary, and work location used as supporting evidence." },
  { name: "Educational Certificates.pdf", category: "Assignments", type: "Supporting", request: "WP1039203903", uploaded: "05/Feb/2026", size: "3.4 MB", description: "Consolidated degree certificates and transcripts establishing the specialty occupation requirement." },
  { name: "Travel Itinerary.pdf", category: "Travel", type: "Travel", request: "ATR5556667777", uploaded: "20/Apr/2026", size: "180 KB", description: "Confirmed flight booking and itinerary for the upcoming short-term business travel." },
  { name: "Medical Insurance.pdf", category: "Travel", type: "Insurance", request: "ATR5556667777", uploaded: "22/Apr/2026", size: "640 KB", description: "International medical insurance certificate covering the duration of the assignment abroad." },
  { name: "I-94 Record.pdf", category: "Immigration", type: "Immigration", request: "WP1039203903", uploaded: "28/Apr/2026", size: "95 KB", description: "Latest CBP I-94 arrival/departure record confirming lawful admission and authorized stay." },
  { name: "Assignment Letter.pdf", category: "Assignments", type: "Employment", request: "WP1039203903", uploaded: "30/Apr/2026", size: "150 KB", description: "Formal assignment letter outlining the terms of the international assignment." },
  { name: "Visa Stamp.pdf", category: "Immigration", type: "Visa Document", request: "WP1039203903", uploaded: "05/May/2026", size: "420 KB", description: "Visa stamping confirmation issued by the consulate post-interview." },
];

// Case listing hierarchy — Assignments are the 1st-order (parent) record;
// WP / ATR cases are the child requests filed underneath each assignment.
type CaseTypeKey = "WP" | "ATR";

const caseTypeMeta: Record<CaseTypeKey, { badge: string }> = {
  WP: { badge: "bg-brand-blue/10 text-brand-blue" },
  ATR: { badge: "bg-brand-amber/10 text-brand-amber" },
};

const caseStatusBadge: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600",
  "Pending for Approval": "bg-brand-amber/10 text-brand-amber",
  "Docs Submitted": "bg-emerald-500/10 text-emerald-600",
  "Awaiting Confirmation": "bg-brand-sky/20 text-brand-navy",
};

const assignments = [
  {
    id: "ASN-2026-0142",
    title: "Permanent Transfer",
    route: "India → United States",
    flagCodes: ["in", "us"] as [string, string],
    status: "Active",
    startDate: "29 May 2026",
    cases: [
      {
        caseId: "WP1039203903",
        type: "WP" as CaseTypeKey,
        label: "US Work Permit filing",
        status: "Pending for Approval",
        updated: "05/May/2026",
      },
    ],
  },
  {
    id: "ASN-2026-0198",
    title: "Business Travel",
    route: "India → United Kingdom",
    flagCodes: ["in", "gb"] as [string, string],
    status: "Awaiting Confirmation",
    startDate: "—",
    cases: [
      {
        caseId: "ATR5556667777",
        type: "ATR" as CaseTypeKey,
        label: "UK travel authorization",
        status: "Docs Submitted",
        updated: "22/Apr/2026",
      },
    ],
  },
];

function EmployeeHome() {
  const [todoTab, setTodoTab] = useState<TodoTabKey>("task");
  const [caseQuery, setCaseQuery] = useState("");
  const [expandedAssignments, setExpandedAssignments] = useState<Record<string, boolean>>(
    () => Object.fromEntries(assignments.map((a) => [a.id, true])),
  );
  const urgentTask = tasks.find((t) => t.urgent);

  const toggleAssignment = (id: string) =>
    setExpandedAssignments((prev) => ({ ...prev, [id]: !prev[id] }));

  const caseSearch = caseQuery.trim().toLowerCase();
  const filteredAssignments = assignments
    .map((a) => {
      const parentMatch = !caseSearch || `${a.title} ${a.route}`.toLowerCase().includes(caseSearch);
      const cases = a.cases.filter(
        (c) => parentMatch || `${c.caseId} ${c.label}`.toLowerCase().includes(caseSearch),
      );
      return { ...a, cases };
    })
    .filter((a) => a.cases.length > 0);

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Employee" />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

{/* Reportee's overdue requests — shown when user is also a supervisor */}
        <MyAssignmentCard />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch lg:h-[475px]">

          {/* Your Assignment */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Your assignment
              </h2>
            </div>

            {/* Two-column body */}
            <div className="flex-1 flex gap-4 min-h-0">

              {/* Left column — 432px */}
              <div className="w-[432px] shrink-0 flex flex-col">
                {/* Flag progress bar */}
                <div className="bg-brand-canvas rounded-lg px-4 py-3 mb-4 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <FlagIcon code="in" className="text-2xl" />
                      <span className="text-[11px] font-semibold text-brand-navy mt-0.5">IND</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="relative pt-4">
                        <div className="absolute top-0 -translate-x-1/2 transition-all duration-700" style={{ left: `${assignmentProgress}%` }}>
                          <Plane className="w-3.5 h-3.5 text-brand-blue rotate-45" />
                        </div>
                        <div className="relative h-2 bg-border/70 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-blue via-brand-sky to-brand-blue/60 transition-all duration-700"
                            style={{ width: `${assignmentProgress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground">{assignmentSteps[currentAssignmentStep]}</span>
                        <span className="text-[10px] font-semibold text-brand-blue">{assignmentProgress}% complete</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center shrink-0">
                      <FlagIcon code="us" className="text-2xl" />
                      <span className="text-[11px] font-semibold text-brand-navy mt-0.5">US</span>
                    </div>
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
                  {[
                    { label: "Type",       value: "Permanent Transfer" },
                    { label: "Start date", value: "29 May 2026"        },
                    { label: "Visa type",  value: "Work Permit"        },
                    { label: "Case ref.",  value: "WP1039203903"       },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-accent/40 rounded-md px-2 py-1.5">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-xs font-semibold text-brand-navy">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Status + stacked action buttons */}
                <div className="mt-auto shrink-0">
                  <div className="mb-2">
                    <StatusPill status="Pending for Screening" className="w-full justify-center py-3.5 text-[15px]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to="/immigration" className="flex items-center justify-center gap-2 bg-transparent border border-brand-blue text-brand-blue rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-blue/5 transition-colors">
                      <Globe2 className="w-4 h-4" />
                      View Immigration Request
                    </Link>
                    <Link to="/assignment-request" className="flex items-center justify-center gap-2 bg-white border border-brand-navy text-brand-navy rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-navy hover:text-white transition-colors">
                      <Briefcase className="w-4 h-4" />
                      View Assignment Request
                    </Link>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-border shrink-0">
                  <span className="text-[11px] text-muted-foreground">Last updated: 15/May/2026</span>
                </div>
              </div>

              {/* Right column — notification + milestones */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">

                {/* Latest update — condensed */}
                <div className="rounded-lg border border-border bg-accent/30 px-4 py-2.5 shrink-0">
                  <div className="flex gap-2.5 items-start">
                    <span className="mt-1 block w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-0.5">Latest update</p>
                      <p className="text-[12px] font-semibold text-brand-navy leading-snug">Work Permit Filing — Documents Submitted</p>
                    </div>
                  </div>
                  <div className="mt-1.5 pl-4">
                    <Link to="/immigration" className="text-[11px] font-semibold text-brand-blue hover:underline">
                      Open request to read more →
                    </Link>
                  </div>
                </div>

                {/* Request progress */}
                <div className="flex-1 min-h-0 flex flex-col gap-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold shrink-0">Request progress</p>
                  {/* Current milestone — card */}
                  <div className="flex-1 flex items-center gap-3 px-3 rounded-lg border border-border bg-white shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 shrink-0 flex flex-col items-center justify-center text-white text-center">
                      <span className="text-[8px] font-bold leading-tight">May 17,</span>
                      <span className="text-[8px] font-bold leading-tight">2026</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-brand-navy leading-snug">LOA signed by Authorized Signatory</p>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">The letter of assignment has been reviewed and countersigned. All required authorizations are in place to proceed.</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2 self-start pt-0.5">15/May/2026</span>
                  </div>
                  {/* Next milestone — card, blinking, green */}
                  <div className="flex-1 flex items-center gap-3 px-3 rounded-lg border border-border bg-white shadow-sm animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-emerald-400 shrink-0 flex flex-col items-center justify-center text-white text-center">
                      <span className="text-[8px] font-bold leading-tight">Jun 19,</span>
                      <span className="text-[8px] font-bold leading-tight">2026</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-brand-navy leading-snug">Employee acknowledgement pending</p>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Awaiting review and acceptance of the assignment terms outlined in the letter of assignment.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Things to do — tabbed by My tasks / Approvals / Clarifications */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Things to do
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-red text-white text-[10px] font-bold">{tasks.length}</span>
              </h2>
              <Link to="/actions" className="text-xs text-brand-blue font-medium hover:underline">View all {tasks.length} requests</Link>
            </div>

            <Tabs value={todoTab} onValueChange={(v) => setTodoTab(v as TodoTabKey)} className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <TabsList className="self-start">
                  {todoTabs.map(({ key, label }) => {
                    const count = tasks.filter((t) => t.type === key).length;
                    return (
                      <TabsTrigger key={key} value={key} className="gap-1.5">
                        {label}
                        <span className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold ${todoTab === key ? "bg-brand-blue text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}>
                          {count}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" aria-label="Access info" className="text-muted-foreground hover:text-brand-blue cursor-help shrink-0">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      You have access both as an Employee (Assignee) and Supervisor
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {todoTabs.map(({ key }) => {
                const filtered = tasks.filter((t) => t.type === key);
                return (
                  <TabsContent key={key} value={key} className="flex-1 mt-0">
                    {filtered.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
                        Nothing here right now.
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {filtered.map((t) => (
                          <li key={t.id} className={`rounded-lg border px-3 py-2 ${t.urgent ? "border-brand-red/30 bg-brand-red/5" : "border-border bg-accent/20"}`}>
                            <div className="flex items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <ApplicationBadge app={t.app} />
                                  <span className="text-[10px] text-muted-foreground">{t.label}</span>
                                  <span className="text-[10px] text-muted-foreground">· Due <span className={t.urgent ? "text-brand-red font-medium" : ""}>{t.dueDate}</span></span>
                                </div>
                                <p className="text-sm font-semibold text-brand-navy truncate mt-0.5">{t.title}</p>
                              </div>
                              <Link
                                to="/case/$caseId"
                                params={{ caseId: t.caseId }}
                                aria-label={`Open ${t.caseId}`}
                                className={`shrink-0 w-8 h-8 grid place-items-center rounded-full transition-colors ${t.urgent ? "text-brand-red hover:bg-brand-red/10" : "text-brand-blue hover:bg-brand-blue/10"}`}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

        </section>

        {/* Applications — quick links strip, mirrors the case manager dashboard pattern */}
        <section>
          <h2 className="text-base font-bold text-brand-navy mb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Applications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {appCategories.map(({ label, Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 bg-white border border-border rounded-lg px-4 py-3 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-navy hover:text-white transition-colors group"
              >
                <Icon className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* My Documents + Help & Resources */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <ListTree className="w-4 h-4 text-brand-blue" />
                Case listing
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={caseQuery}
                  onChange={(e) => setCaseQuery(e.target.value)}
                  placeholder="Search assignments or cases"
                  className="h-9 pl-9 pr-3 w-64 rounded border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-table-head/60 text-[11px] font-semibold text-brand-navy uppercase tracking-wide">
                <span className="w-4 shrink-0" />
                <span className="flex-1">Assignment / Case</span>
                <span className="w-36 text-center shrink-0">Status</span>
                <span className="w-24 text-right shrink-0">Updated</span>
                <span className="w-8 shrink-0" />
              </div>

              <ul className="divide-y divide-border">
                {filteredAssignments.length === 0 && (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No assignments or cases match your search.
                  </li>
                )}
                {filteredAssignments.map((a) => {
                  const isExpanded = caseSearch ? true : (expandedAssignments[a.id] ?? true);
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => toggleAssignment(a.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-accent/30 transition-colors text-left"
                      >
                        <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        <Briefcase className="w-4 h-4 text-brand-blue shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brand-navy truncate">
                            {a.title} <span className="text-muted-foreground font-normal">· {a.route}</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <FlagIcon code={a.flagCodes[0]} />
                            <span>→</span>
                            <FlagIcon code={a.flagCodes[1]} />
                            <span>&nbsp;·&nbsp; {a.cases.length} case{a.cases.length === 1 ? "" : "s"}</span>
                          </p>
                        </div>
                        <span className={`hidden md:inline-flex w-36 justify-center items-center px-2.5 py-0.5 rounded text-[11px] font-semibold shrink-0 ${caseStatusBadge[a.status] ?? "bg-muted text-muted-foreground"}`}>
                          {a.status}
                        </span>
                        <span className="hidden md:block w-24 text-right text-xs text-muted-foreground shrink-0">{a.startDate}</span>
                        <span className="w-8 shrink-0" />
                      </button>

                      {isExpanded && (
                        <ul>
                          {a.cases.map((c) => {
                            const docCount = documents.filter((d) => d.request === c.caseId).length;
                            return (
                              <li
                                key={c.caseId}
                                className="flex items-center gap-3 pl-10 pr-4 py-3 border-t border-border/60 bg-accent/10 hover:bg-accent/30 transition-colors"
                              >
                                <CornerDownRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${caseTypeMeta[c.type].badge}`}>{c.type}</span>
                                <div className="flex-1 min-w-0">
                                  <Link to="/case/$caseId" params={{ caseId: c.caseId }} className="text-sm font-medium text-brand-blue hover:underline">
                                    {c.caseId}
                                  </Link>
                                  <p className="text-[11px] text-muted-foreground truncate">
                                    {c.label} · {docCount} document{docCount === 1 ? "" : "s"}
                                  </p>
                                </div>
                                <span className={`hidden md:inline-flex w-36 justify-center items-center px-2.5 py-0.5 rounded text-[11px] font-semibold shrink-0 ${caseStatusBadge[c.status] ?? "bg-muted text-muted-foreground"}`}>
                                  {c.status}
                                </span>
                                <span className="hidden md:block w-24 text-right text-xs text-muted-foreground shrink-0">{c.updated}</span>
                                <Link
                                  to="/case/$caseId"
                                  params={{ caseId: c.caseId }}
                                  aria-label={`Open case ${c.caseId}`}
                                  className="w-8 h-8 grid place-items-center rounded border border-border text-brand-blue hover:bg-brand-blue hover:text-white transition-colors shrink-0"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Help & Resources — labelled cards */}
          <div>
            <h2 className="text-base font-bold text-brand-navy mb-3">Help &amp; resources</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Information Portal", Icon: Info, desc: "Guides & FAQs" },
                { label: "Knowledge Base", Icon: BookOpen, desc: "Learn about mobility" },
                { label: "Get Support", Icon: LifeBuoy, desc: "Raise a request" },
                { label: "Mobility Resources", Icon: Globe2, desc: "Tools & templates" },
              ].map(({ label, Icon, desc }) => (
                <button
                  key={label}
                  type="button"
                  className="w-44 rounded border-2 border-brand-blue/20 bg-white hover:border-brand-blue hover:bg-brand-blue/5 transition-colors flex flex-col items-center justify-center gap-1.5 py-4 px-3"
                >
                  <Icon className="w-5 h-5 text-brand-blue" />
                  <span className="text-xs font-semibold text-brand-navy text-center leading-tight">{label}</span>
                  <span className="text-[10px] text-muted-foreground text-center">{desc}</span>
                </button>
              ))}
            </div>
          </div>

        </section>
      </main>


      <AskImmibroButton />
    </div>
  );
}
