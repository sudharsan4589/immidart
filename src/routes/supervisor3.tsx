import { AppLoader } from "@/components/AppLoader";
import { AskImmibroButton } from "@/components/AskImmibroButton";
import { PageHeader } from "@/components/PageHeader";
import { ApplicationBadge } from "@/components/ApplicationBadge";
import { FlagIcon } from "@/components/FlagIcon";
import { MyAssignmentCard } from "@/components/MyAssignmentCard";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Info,
  LifeBuoy,
  Globe2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  ListChecks,
  LayoutGrid,
  Plane,
  FileCheck,
  Scale,
  Mail,
  ArrowDown,
  ChevronRight,
  SlidersHorizontal,
  PartyPopper,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/supervisor3")({
  head: () => ({
    meta: [
      { title: "Immidart — Supervisor Dashboard (All caught up)" },
      { name: "description", content: "Supervisor view when there are no pending actions or cases." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: SupervisorDashboardV3,
});

// ── Data ────────────────────────────────────────────────────────────────────
// All pending/action-required counts are 0 to simulate a clear supervisor queue.
// Change these arrays to populate the view and the layout will adapt automatically.

const stats = [
  { label: "Pending Approvals",     value: "00", badge: "Nothing to sign off", tone: "green" as const },
  { label: "Team Members Abroad",   value: "12", badge: "On assignment",        tone: "blue"  as const },
  { label: "Cases In Progress",     value: "00", badge: "All cases closed",     tone: "green" as const },
  { label: "Total Team Assignments",value: "148",badge: "All time",             tone: "green" as const },
];

// Empty — the whole page adapts when items are added here
const supervisorTasks: {
  id: string;
  type: "task" | "approval" | "clarification";
  app: "Immigration" | "Assignments" | "Travel";
  label: string;
  title: string;
  dueDate: string;
  urgent: boolean;
  actionLabel: string;
  caseId: string;
}[] = [];

// Team cases — supervisor3 always shows the full history, including completed cases.
const rows: string[][] = [
  ["WI231445780",      "Clark Kent",      "Portugal",       "Approved",            "20/Apr/2026"],
  ["IWA1234567890",    "Diana Prince",    "United States",  "Visa Filed",          "28/May/2026"],
  ["ATR1234567890",    "Bruce Wayne",     "United Kingdom", "Awaiting Decision",   "01/Jun/2026"],
  ["WP12103910391031", "Barry Allen",     "Germany",        "Docs Submitted",      "05/Jun/2026"],
  ["IWA1234567891",    "Hal Jordan",      "Canada",         "Approved",            "10/Mar/2026"],
  ["WP9876543210",     "Arthur Curry",    "Australia",      "Completed",           "15/Feb/2026"],
  ["WI231445781",      "Natasha Romanoff","Germany",        "Completed",           "22/Jan/2026"],
  ["ATR1234567891",    "Peter Parker",    "Canada",         "Approved",            "18/Dec/2025"],
];

const supervisorTodoTabs = [
  { key: "task",          label: "My Requests"   },
  { key: "approval",      label: "Approvals"     },
  { key: "clarification", label: "Clarifications"},
] as const;
type SupervisorTodoTabKey = (typeof supervisorTodoTabs)[number]["key"];

// 6-button application strip, matching the case manager dashboard pattern
const appCategories = [
  { label: "Assignments",   Icon: Briefcase, to: "/"            as const },
  { label: "Immigration",   Icon: Globe2,    to: "/immigration" as const },
  { label: "Travel",        Icon: Plane,     to: "/"            as const },
  { label: "COC",           Icon: FileCheck, to: "/"            as const },
  { label: "LCA",           Icon: Scale,     to: "/"            as const },
  { label: "Invite Letter", Icon: Mail,      to: "/"            as const },
];

const assignmentSteps = ["Initiated", "Documents", "Filing", "Decision", "Active"];
const currentAssignmentStep = 1;
const assignmentProgress = Math.round((currentAssignmentStep / (assignmentSteps.length - 1)) * 100);

const overlayCases: string[][] = [];

// ── Helpers ─────────────────────────────────────────────────────────────────

function StatusPill({ status, className }: { status: string; className?: string }) {
  const map: Record<string, string> = {
    "Pending for Approval":  "bg-brand-amber/10 text-brand-amber",
    "Visa Filed":            "bg-brand-blue/10 text-brand-blue",
    "Awaiting Decision":     "bg-brand-sky/20 text-brand-navy",
    "Docs Submitted":        "bg-emerald-500/10 text-emerald-600",
    "Pending for Screening": "bg-emerald-500/10 text-emerald-600",
    "Approved":              "bg-emerald-500/10 text-emerald-600",
    "Completed":             "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${map[status] ?? "bg-muted text-muted-foreground"} ${className ?? ""}`}>
      {status}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

function SupervisorDashboardV3() {
  const [openCaseList,  setOpenCaseList]  = useState<string | null>(null);
  const [activeTab,     setActiveTab]     = useState<"team" | "approval">("team");
  const [todoTab,       setTodoTab]       = useState<SupervisorTodoTabKey>("task");

  // Drives the entire layout — populate supervisorTasks to switch to the active (supervisor2-style) layout.
  // Team Cases (rows) is independent — supervisor3 always shows the full team-case history here.
  const hasPendingCases = supervisorTasks.length > 0;

  const toneStyles = {
    red:   { border: "border-l-brand-red",   badge: "bg-brand-red/10 text-brand-red",    icon: <AlertCircle  className="w-3 h-3" /> },
    amber: { border: "border-l-brand-amber", badge: "bg-brand-amber/10 text-brand-amber", icon: <Clock        className="w-3 h-3" /> },
    blue:  { border: "border-l-brand-blue",  badge: "bg-brand-blue/10 text-brand-blue",   icon: <Briefcase    className="w-3 h-3" /> },
    green: { border: "border-l-emerald-500", badge: "bg-emerald-500/10 text-emerald-600", icon: <CheckCircle2 className="w-3 h-3" /> },
  };

  // ── Shared sub-sections ────────────────────────────────────────────────────

  const helpResources = (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-border flex flex-col">
      <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wide mb-3">Help &amp; Resources</h3>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {[
          { label: "Information Portal", Icon: Info,     desc: "Guides & FAQs"       },
          { label: "Get Support",        Icon: LifeBuoy, desc: "Raise a request"     },
          { label: "Mobility Resources", Icon: Globe2,   desc: "Tools & templates"   },
          { label: "Knowledge Base",     Icon: BookOpen, desc: "Learn & explore"     },
        ].map(({ label, Icon, desc }) => (
          <button
            key={label}
            type="button"
            title={label}
            className="rounded-md bg-white border border-border text-brand-navy flex flex-col items-center justify-center gap-1 px-2 py-4 shadow-sm hover:bg-brand-navy hover:text-white transition-colors group"
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
            <span className="text-[9px] text-muted-foreground group-hover:text-white/70 text-center">{desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const thingsToDo = (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <ListChecks className="w-4 h-4" />
          Things to do
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-red text-white text-[10px] font-bold">
            {supervisorTasks.length}
          </span>
        </h2>
        <Link to="/actions" className="text-xs text-brand-blue font-medium hover:underline">View all {supervisorTasks.length} requests</Link>
      </div>

      {hasPendingCases ? (
        <Tabs value={todoTab} onValueChange={(v) => setTodoTab(v as SupervisorTodoTabKey)} className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <TabsList className="self-start">
              {supervisorTodoTabs.map(({ key, label }) => {
                const count = supervisorTasks.filter((t) => t.type === key).length;
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

          {supervisorTodoTabs.map(({ key }) => {
            const filtered = supervisorTasks.filter((t) => t.type === key);
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
      ) : (
        // Empty state — "You're all caught up!"
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 grid place-items-center">
            <PartyPopper className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <p className="text-base font-bold text-brand-navy">You're all caught up!</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">No pending actions or approvals right now.</p>
          </div>
        </div>
      )}
    </div>
  );

  const yourAssignment = (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Your assignment
        </h2>
      </div>

      {/* Two-column body: left = progress + fields + buttons · right = notification */}
      <div className="flex-1 flex gap-4 min-h-0">

        {/* Left column */}
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

          {/* Status + action buttons */}
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
  );

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Supervisor" />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

        {/* Overdue reportee card — only shown when there are pending cases */}
        {hasPendingCases && <MyAssignmentCard />}

        {/* ── Hero section — layout adapts based on hasPendingCases ──────────── */}
        {hasPendingCases ? (
          // Active layout: [KPI cards] | [Your Assignment (wide)] | [Help & Resources]
          <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr_240px] gap-6 items-stretch lg:h-[475px]">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[240px]">
              {stats.map((s, i) => {
                const ts = toneStyles[s.tone];
                return (
                  <article
                    key={i}
                    onClick={() => setOpenCaseList(s.label)}
                    className={`bg-white border border-border border-l-4 ${ts.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-2`}
                  >
                    <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
                    <span className="text-[38px] font-bold text-brand-navy leading-none">{s.value}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded w-fit ${ts.badge}`}>
                      {ts.icon}{s.badge}
                    </span>
                  </article>
                );
              })}
            </div>
            {yourAssignment}
            {helpResources}
          </section>
        ) : (
          // Caught-up layout: [Your Assignment (wide)] | [Help & Resources]
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 items-stretch lg:h-[475px]">
            {yourAssignment}
            {helpResources}
          </section>
        )}

        {/* Applications — full-width 6-button row, matches the case manager dashboard */}
        <section>
          <h2 className="text-base font-bold text-brand-navy mb-3 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" />
            Applications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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

        {/* Team Cases */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-brand-navy">Team Cases</h2>
    
          </div>

          <div className="border-b border-border flex items-center gap-0 mb-5">
            <button
              onClick={() => setActiveTab("team")}
              className={`relative pb-3 px-4 text-sm font-semibold transition-colors ${activeTab === "team" ? "text-brand-blue" : "text-muted-foreground hover:text-brand-navy"}`}
            >
              All team cases
              {activeTab === "team" && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />}
            </button>
            <button
              onClick={() => setActiveTab("approval")}
              className={`relative pb-3 px-4 text-sm font-semibold transition-colors inline-flex items-center gap-1.5 ${activeTab === "approval" ? "text-brand-blue" : "text-muted-foreground hover:text-brand-navy"}`}
            >
              Needs your sign-off
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${activeTab === "approval" ? "bg-brand-blue text-white" : "bg-muted text-muted-foreground"}`}>
                {rows.filter((r) => r[3] === "Pending for Approval").length}
              </span>
              {activeTab === "approval" && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand-blue" />}
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mb-4">
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
                placeholder="Search by name, case number or country"
                className="w-full h-9 pl-9 pr-4 border-b border-border bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-table-head/60 text-brand-navy">
                  <th className="text-left font-semibold px-4 py-3">
                    <span className="inline-flex items-center gap-1">Case No. <ArrowDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left font-semibold px-4 py-3">Team Member</th>
                  <th className="text-left font-semibold px-4 py-3">Travelling to</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-left font-semibold px-4 py-3">Action by</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === "approval" ? rows.filter((r) => r[3] === "Pending for Approval") : rows).map((r, i) => (
                  <tr key={i} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-4 py-3.5">
                      <Link to="/case/$caseId" params={{ caseId: r[0] }} className="text-brand-blue underline">{r[0]}</Link>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{r[1]}</td>
                    <td className="px-4 py-3.5 text-foreground">{r[2]}</td>
                    <td className="px-4 py-3.5"><StatusPill status={r[3]} /></td>
                    <td className="px-4 py-3.5 text-foreground">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Stat card overlay sheet */}
      <Sheet open={openCaseList !== null} onOpenChange={(o) => !o && setOpenCaseList(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-brand-navy">{openCaseList}</SheetTitle>
          </SheetHeader>
          <div className="p-6 space-y-4 overflow-y-auto">
            {overlayCases.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No cases to display.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-table-head/60 text-brand-navy">
                      <th className="text-left font-semibold px-4 py-3">Case No.</th>
                      <th className="text-left font-semibold px-4 py-3">Destination Country</th>
                      <th className="text-left font-semibold px-4 py-3">Status</th>
                      <th className="text-left font-semibold px-4 py-3">Travel start date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overlayCases.map((r, i) => (
                      <tr key={i} className="border-b border-border/60 hover:bg-accent/40">
                        <td className="px-4 py-3.5">
                          <Link to="/case/$caseId" params={{ caseId: r[0] }} className="text-brand-blue underline">{r[0]}</Link>
                        </td>
                        <td className="px-4 py-3.5 text-foreground">{r[1]}</td>
                        <td className="px-4 py-3.5"><StatusPill status={r[2]} /></td>
                        <td className="px-4 py-3.5 text-foreground">{r[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AskImmibroButton />
    </div>
  );
}
