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
  MapPin,
  Phone,
  Calendar,
  RefreshCcw,
  Building2,
  AlertTriangle,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/supervisor5")({
  head: () => ({
    meta: [
      { title: "Immidart — Supervisor Dashboard (Active Assignment)" },
      { name: "description", content: "Supervisor view when the assignee is actively working in the host country." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: SupervisorDashboardV5,
});

// ── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Pending Approvals",      value: "00", badge: "Nothing to sign off", tone: "green" as const },
  { label: "Team Members Abroad",    value: "12", badge: "On assignment",        tone: "blue"  as const },
  { label: "Cases In Progress",      value: "00", badge: "All cases closed",     tone: "green" as const },
  { label: "Total Team Assignments", value: "148",badge: "All time",             tone: "green" as const },
];

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

const rows: string[][] = [
  ["WI231445780",      "Clark Kent",       "Portugal",       "Approved",          "20/Apr/2026"],
  ["IWA1234567890",    "Diana Prince",     "United States",  "Visa Filed",        "28/May/2026"],
  ["ATR1234567890",    "Bruce Wayne",      "United Kingdom", "Awaiting Decision", "01/Jun/2026"],
  ["WP12103910391031", "Barry Allen",      "Germany",        "Docs Submitted",    "05/Jun/2026"],
  ["IWA1234567891",    "Hal Jordan",       "Canada",         "Approved",          "10/Mar/2026"],
  ["WP9876543210",     "Arthur Curry",     "Australia",      "Completed",         "15/Feb/2026"],
  ["WI231445781",      "Natasha Romanoff", "Germany",        "Completed",         "22/Jan/2026"],
  ["ATR1234567891",    "Peter Parker",     "Canada",         "Approved",          "18/Dec/2025"],
];

const supervisorTodoTabs = [
  { key: "task",          label: "My Requests"   },
  { key: "approval",      label: "Approvals"     },
  { key: "clarification", label: "Clarifications"},
] as const;
type SupervisorTodoTabKey = (typeof supervisorTodoTabs)[number]["key"];

const appCategories = [
  { label: "Assignments",   Icon: Briefcase, to: "/"            as const },
  { label: "Immigration",   Icon: Globe2,    to: "/immigration" as const },
  { label: "Travel",        Icon: Plane,     to: "/"            as const },
  { label: "COC",           Icon: FileCheck, to: "/"            as const },
  { label: "LCA",           Icon: Scale,     to: "/"            as const },
  { label: "Invite Letter", Icon: Mail,      to: "/"            as const },
];

// Assignment is now Active — assignee has arrived and is working in the host country.
// Assignment: 23 May 2026 → 22 Oct 2026 (152 days total).
// As of 30 Jun 2026: 38 days elapsed, 114 days remaining, ~25% complete.
const ASSIGNMENT = {
  startDate:      "23 May 2026",
  endDate:        "22 Oct 2026",
  daysTotal:      152,
  daysElapsed:    38,
  daysRemaining:  114,
  progressPct:    25,
  permitExpiry:   "22 Oct 2026",
  permitType:     "H-1B Work Permit",
  permitNumber:   "WAC-26-123-45678",
  caseRef:        "WP1039203903",
  hostCity:       "New York",
  hostCountry:    "United States",
  hostCountryCode:"us",
  hostEntity:     "Immidart Technologies LLC",
  lastUpdated:    "01 Jun 2026",
};

const upcomingActions = [
  {
    label:  "Quarterly compliance check-in",
    detail: "Submit your host-country compliance declaration via the portal.",
    due:    "Today",
    urgent: true,
    Icon:   AlertTriangle,
  },
  {
    label:  "US address registration update",
    detail: "Ensure your current residential address is filed with local HR.",
    due:    "15 Jul 2026",
    urgent: false,
    Icon:   MapPin,
  },
  {
    label:  "ITIN application deadline",
    detail: "File for Individual Taxpayer Identification Number if not yet done.",
    due:    "31 Jul 2026",
    urgent: false,
    Icon:   Calendar,
  },
  {
    label:  "Work permit renewal window opens",
    detail: "Extension can be filed 6 months before permit expiry.",
    due:    "22 Apr 2027",
    urgent: false,
    Icon:   ShieldCheck,
  },
];

const quickContacts = [
  { role: "Local HR",            name: "Jennifer Ross",  detail: "+1 (212) 555-0192", Icon: UserIcon  },
  { role: "Immigration Attorney", name: "Robert Kane",    detail: "+1 (212) 555-0341", Icon: Briefcase },
  { role: "Emergency Line",       name: "Immidart 24/7", detail: "+1-800-466-3427",    Icon: Phone     },
  { role: "Housing Support",      name: "Helen Troy",    detail: "+1 (212) 555-0876", Icon: Building2 },
];

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
    "Active":                "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${map[status] ?? "bg-muted text-muted-foreground"} ${className ?? ""}`}>
      {status}
    </span>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

function SupervisorDashboardV5() {
  const [openCaseList, setOpenCaseList] = useState<string | null>(null);
  const [activeTab,    setActiveTab]    = useState<"team" | "approval">("team");
  const [todoTab,      setTodoTab]      = useState<SupervisorTodoTabKey>("task");

  const hasPendingCases = supervisorTasks.length > 0;

  const toneStyles = {
    red:   { border: "border-l-brand-red",   badge: "bg-brand-red/10 text-brand-red",     icon: <AlertCircle  className="w-3 h-3" /> },
    amber: { border: "border-l-brand-amber", badge: "bg-brand-amber/10 text-brand-amber",  icon: <Clock        className="w-3 h-3" /> },
    blue:  { border: "border-l-brand-blue",  badge: "bg-brand-blue/10 text-brand-blue",    icon: <Briefcase    className="w-3 h-3" /> },
    green: { border: "border-l-emerald-500", badge: "bg-emerald-500/10 text-emerald-600",  icon: <CheckCircle2 className="w-3 h-3" /> },
  };

  // ── Help & Resources ───────────────────────────────────────────────────────

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

  // ── Things to do ──────────────────────────────────────────────────────────

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

  // ── Your Assignment — Active in host country ───────────────────────────────

  const yourAssignment = (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full overflow-hidden">

      {/* Card header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Your Immigration Request
        </h2>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          Active in Host Country
        </span>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex gap-4 min-h-0">

        {/* ── Left column ── */}
        <div className="w-[432px] shrink-0 flex flex-col">

          {/* Location + duration progress */}
          <div className="bg-brand-canvas rounded-lg px-4 py-3 mb-4 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <FlagIcon code={ASSIGNMENT.hostCountryCode} className="text-2xl" />
                <div>
                  <p className="text-sm font-bold text-brand-navy leading-tight">{ASSIGNMENT.hostCity}, {ASSIGNMENT.hostCountry}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> Currently working here
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-brand-navy leading-none">{ASSIGNMENT.daysRemaining}</p>
                <p className="text-[10px] text-muted-foreground">days remaining</p>
              </div>
            </div>
            <div className="h-2 bg-border/70 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-brand-blue transition-all duration-700"
                style={{ width: `${ASSIGNMENT.progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">{ASSIGNMENT.startDate}</span>
              <span className="text-[10px] font-semibold text-emerald-600">{ASSIGNMENT.progressPct}% complete</span>
              <span className="text-[10px] text-muted-foreground">{ASSIGNMENT.endDate}</span>
            </div>
          </div>

          {/* Meta details */}
          <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
            {[
              { label: "Permit type",    value: ASSIGNMENT.permitType      },
              { label: "Permit expires", value: ASSIGNMENT.permitExpiry    },
              { label: "Permit number",  value: ASSIGNMENT.permitNumber    },
              { label: "Host entity",    value: "Immidart Technologies"    },
            ].map(({ label, value }) => (
              <div key={label} className="bg-accent/40 rounded-md px-2 py-1.5">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-xs font-semibold text-brand-navy">{value}</p>
              </div>
            ))}
          </div>

          {/* Status + action buttons */}
          <div className="mt-auto shrink-0">
            <div className="mb-2 flex items-center justify-center rounded px-2.5 py-3.5 bg-emerald-500/10 text-emerald-700 text-[15px] font-semibold">
              Active
            </div>
            <div className="flex flex-col gap-2">
              <Link
                to="/immigration"
                className="flex items-center justify-center gap-2 bg-transparent border border-brand-blue text-brand-blue rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-blue/5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                View Work Permit
              </Link>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-white border border-brand-amber text-brand-amber rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-brand-amber/5 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Request Extension
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-border shrink-0">
            <span className="text-[11px] text-muted-foreground">Last updated: {ASSIGNMENT.lastUpdated}</span>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 overflow-y-auto">

          {/* Upcoming actions */}
          <div className="shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">Upcoming actions</p>
            <div className="space-y-1.5">
              {upcomingActions.map((a) => (
                <div
                  key={a.label}
                  className={`rounded-lg border px-3 py-2.5 flex items-start gap-2.5 ${
                    a.urgent ? "border-brand-red/30 bg-brand-red/5" : "border-border bg-accent/20"
                  }`}
                >
                  <a.Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${a.urgent ? "text-brand-red" : "text-brand-blue"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[12px] font-semibold text-brand-navy leading-snug truncate">{a.label}</p>
                      <span className={`text-[10px] font-semibold shrink-0 ${a.urgent ? "text-brand-red" : "text-muted-foreground"}`}>{a.due}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{a.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick contacts */}
          <div className="shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">Quick contacts</p>
            <div className="grid grid-cols-2 gap-1.5">
              {quickContacts.map(({ role, name, detail, Icon }) => (
                <button
                  key={role}
                  type="button"
                  className="rounded-lg border border-border bg-white px-3 py-2.5 text-left hover:border-brand-blue/30 hover:bg-brand-sky/5 transition-colors group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3 text-brand-blue group-hover:text-brand-blue shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-none">{role}</p>
                  </div>
                  <p className="text-[12px] font-semibold text-brand-navy leading-snug">{name}</p>
                  <p className="text-[10px] text-brand-blue mt-0.5">{detail}</p>
                </button>
              ))}
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

        {hasPendingCases && <MyAssignmentCard />}

        {/* ── Hero section ──────────────────────────────────────────────────── */}
        {hasPendingCases ? (
          <section className="grid grid-cols-1 lg:grid-cols-[340px_1fr_340px] gap-6 items-stretch lg:h-[475px]">
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
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch lg:h-[475px]">
            {yourAssignment}
            {helpResources}
          </section>
        )}

        {/* Applications */}
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

      {/* Stat card overlay */}
      <Sheet open={openCaseList !== null} onOpenChange={(o) => !o && setOpenCaseList(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 pr-12 border-b border-border">
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
