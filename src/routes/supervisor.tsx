import { AppLoader } from "@/components/AppLoader";
import { AskImmibroButton } from "@/components/AskImmibroButton";
import { PageHeader } from "@/components/PageHeader";
import { CreateRequestButton } from "@/components/CreateRequestButton";
import { MyAssignmentCard } from "@/components/MyAssignmentCard";
import { ApplicationBadge } from "@/components/ApplicationBadge";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  ArrowDown,
  SlidersHorizontal,
  Info,
  LifeBuoy,
  Globe2,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  ListChecks,
  LayoutGrid,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/supervisor")({
  head: () => ({
    meta: [
      { title: "Immidart — Supervisor Dashboard" },
      {
        name: "description",
        content: "Supervisor view of team approvals, reportee assignments and case progress.",
      },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: SupervisorDashboard,
});

// Plain-English stat labels — "Reportees" replaced with "Team Members"
const stats = [
  { label: "Pending Approvals", value: "07", badge: "Needs your sign-off", tone: "red" as const },
  { label: "Team Members Abroad", value: "12", badge: "On assignment", tone: "blue" as const },
  { label: "Cases In Progress", value: "23", badge: "Across all stages", tone: "blue" as const },
  { label: "Total Team Assignments", value: "148", badge: "All time", tone: "green" as const },
];

// Things to do — supervisor's own action items, split by Approvals / Clarifications (no "My tasks" — that's an employee concept)
const supervisorTasks = [
  {
    id: "t1",
    type: "approval" as const,
    app: "Assignments" as const,
    label: "Clark Kent · Letter of Assignment",
    title: "Sign off on Letter of Assignment",
    description: "Clark Kent's assignment is on hold until you sign off on the Letter of Assignment.",
    dueDate: "21 May 2026",
    urgent: true,
    actionLabel: "Sign off",
    caseId: "WP12103910391031",
  },
  {
    id: "t2",
    type: "approval" as const,
    app: "Immigration" as const,
    label: "Diana Prince · Visa Filing",
    title: "Approve visa filing",
    description: "Review and approve Diana Prince's visa filing so her case manager can proceed.",
    dueDate: "24 May 2026",
    urgent: false,
    actionLabel: "Approve",
    caseId: "IWA1234567890",
  },
  {
    id: "t3",
    type: "clarification" as const,
    app: "Immigration" as const,
    label: "Barry Allen · Extension Request",
    title: "Provide clarification on extension request",
    description: "Immigration needs more detail from you on Barry Allen's requested assignment extension.",
    dueDate: "03 Jun 2026",
    urgent: true,
    actionLabel: "Respond",
    caseId: "WP1112223334",
  },
  {
    id: "t4",
    type: "clarification" as const,
    app: "Assignments" as const,
    label: "Hal Jordan · Onboarding",
    title: "Confirm reporting structure change",
    description: "HR needs you to confirm Hal Jordan's reporting line before onboarding can be finalized.",
    dueDate: "10 Jun 2026",
    urgent: false,
    actionLabel: "Respond",
    caseId: "IWA4445556666",
  },
];

const supervisorTodoTabs = [
  { key: "approval", label: "Approvals" },
  { key: "clarification", label: "Clarifications" },
] as const;
type SupervisorTodoTabKey = (typeof supervisorTodoTabs)[number]["key"];

// Application categories — same set surfaced on the employee page, for quick access to team applications
const appCategories = [
  { label: "Assignments", Icon: Briefcase, to: "/" as const },
  { label: "Immigration", Icon: Globe2, to: "/immigration" as const },
  { label: "Travel", Icon: Plane, to: "/" as const },
  { label: "Coverage", Icon: ShieldCheck, to: "/" as const },
];

const rows = [
  ["WI231445780", "Clark Kent", "Portugal", "Pending for Approval", "20/May/2026"],
  ["IWA1234567890", "Diana Prince", "United States", "Visa Filed", "28/May/2026"],
  ["ATR1234567890", "Bruce Wayne", "United Kingdom", "Awaiting Decision", "01/Jun/2026"],
  ["WP12103910391031", "Barry Allen", "Germany", "Docs Submitted", "05/Jun/2026"],
  ["IWA1234567891", "Hal Jordan", "Canada", "Pending for Screening", "10/Jun/2026"],
  ["WP9876543210", "Arthur Curry", "Australia", "Approved", "15/Jun/2026"],
];

const overlayCases = [
  ["WI231445780", "Portugal", "Pending for Approval", "20/May/2026"],
  ["WP12103910391031", "Germany", "Docs Submitted", "22/May/2026"],
  ["IWA1234567890", "United States", "Visa Filed", "28/May/2026"],
  ["ATR1234567890", "United Kingdom", "Awaiting Decision", "01/Jun/2026"],
  ["IWA1234567891", "Canada", "Pending for Screening", "10/Jun/2026"],
  ["WP9876543210", "Australia", "Approved", "15/Jun/2026"],
];

// Color-coded status pills
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Pending for Approval": "bg-brand-amber/10 text-brand-amber",
    "Visa Filed": "bg-brand-blue/10 text-brand-blue",
    "Awaiting Decision": "bg-brand-sky/20 text-brand-navy",
    "Docs Submitted": "bg-emerald-500/10 text-emerald-600",
    "Pending for Screening": "bg-brand-amber/10 text-brand-amber",
    "Approved": "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function SupervisorDashboard() {
  const [openCaseList, setOpenCaseList] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"team" | "approval">("team");
  const [todoTab, setTodoTab] = useState<SupervisorTodoTabKey>("approval");

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Supervisor" />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-8">

        {/* Personal assignment card — only shown when user is also an assignee */}
        <MyAssignmentCard />

        {/* KPI stat cards, Things to do and Help & Resources — three adjacent columns, all equal height, pinned to 354px */}
        <section className="grid grid-cols-1 lg:grid-cols-[440px_1fr_280px] gap-6 items-stretch lg:h-[475px]">

          <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
            {stats.map((s, i) => {
              const toneStyles = {
                red:   { border: "border-l-brand-red",   badge: "bg-brand-red/10 text-brand-red",    icon: <AlertCircle className="w-3 h-3" /> },
                amber: { border: "border-l-brand-amber", badge: "bg-brand-amber/10 text-brand-amber", icon: <Clock className="w-3 h-3" /> },
                blue:  { border: "border-l-brand-blue",  badge: "bg-brand-blue/10 text-brand-blue",   icon: <Briefcase className="w-3 h-3" /> },
                green: { border: "border-l-emerald-500", badge: "bg-emerald-500/10 text-emerald-600", icon: <CheckCircle2 className="w-3 h-3" /> },
              }[s.tone];
              return (
                <article
                  key={i}
                  onClick={() => setOpenCaseList(s.label)}
                  className={`bg-white border border-border border-l-4 ${toneStyles.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-2`}
                >
                  <p className="text-xs text-muted-foreground leading-snug">{s.label}</p>
                  <span className="text-[38px] font-bold text-brand-navy leading-none">{s.value}</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded w-fit ${toneStyles.badge}`}>
                    {toneStyles.icon}{s.badge}
                  </span>
                </article>
              );
            })}
          </div>

          {/* Things to do — sized to match the employee page's Things to do card */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-brand-navy flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Things to do
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-red text-white text-[10px] font-bold">{supervisorTasks.length}</span>
              </h2>
              <Link to="/actions" className="text-xs text-brand-blue font-medium hover:underline">View all {supervisorTasks.length} requests</Link>
            </div>

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
          </div>

          {/* Help & Resources — same card chrome + height as the other two columns */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-border flex flex-col h-full">
            <h2 className="text-base font-bold text-brand-navy mb-4">Help &amp; Resources</h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
              {[
                { label: "Information Portal", Icon: Info, desc: "Guides & FAQs" },
                { label: "Get Support", Icon: LifeBuoy, desc: "Raise a request" },
                { label: "Mobility Resources", Icon: Globe2, desc: "Tools & templates" },
                { label: "Knowledge Base", Icon: BookOpen, desc: "Learn & explore" },
              ].map(({ label, Icon, desc }) => (
                <button
                  key={label}
                  type="button"
                  title={label}
                  className="rounded-md bg-white border border-border text-brand-navy flex flex-col items-center justify-center gap-1.5 px-2 shadow-sm hover:bg-brand-navy hover:text-white transition-colors group"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
                  <span className="text-[9px] text-muted-foreground group-hover:text-white/70 text-center">{desc}</span>
                </button>
              ))}
            </div>
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

        {/* Team Cases — full width */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-brand-navy">Team Cases</h2>
            {/* Relabelled: "New request for team member" */}
            <CreateRequestButton />
          </div>

          {/* Tabs — "Pending Approvals" renamed to "Needs your sign-off" */}
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
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
                      <Link to="/case/$caseId" params={{ caseId: r[0] }} className="text-brand-blue underline">
                        {r[0]}
                      </Link>
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

      {/* Stat card cases overlay */}
      <Sheet open={openCaseList !== null} onOpenChange={(o) => !o && setOpenCaseList(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-brand-navy">{openCaseList}</SheetTitle>
          </SheetHeader>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search by case number, country or status"
                className="w-full h-9 pl-9 pr-24 border-b border-border bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:border-brand-blue"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 bg-brand-navy text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-brand-navy/90 transition-colors">
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-table-head/60 text-brand-navy">
                    <th className="text-left font-semibold px-4 py-3">
                      <span className="inline-flex items-center gap-1">Case No. <ArrowDown className="w-3 h-3" /></span>
                    </th>
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
          </div>
        </SheetContent>
      </Sheet>

      <AskImmibroButton />
    </div>
  );
}
