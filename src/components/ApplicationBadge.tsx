import type { LucideIcon } from "lucide-react";
import { Briefcase, Globe2, Plane, FileCheck, Scale, Mail } from "lucide-react";

// The six applications/modules surfaced across the platform (quick-links strip on the
// case manager dashboard, application strips on supervisor/employee pages). Every
// Things-to-do task across the app is tagged with one of these so users can tell at a
// glance which application a task belongs to, without opening it.
export type ApplicationType =
  | "Assignments"
  | "Immigration"
  | "Travel"
  | "COC"
  | "LCA"
  | "Invite Letter";

export const APPLICATION_TYPES: { label: ApplicationType; Icon: LucideIcon; badge: string }[] = [
  { label: "Assignments", Icon: Briefcase, badge: "bg-brand-blue/10 text-brand-blue" },
  { label: "Immigration", Icon: Globe2, badge: "bg-brand-navy/10 text-brand-navy" },
  { label: "Travel", Icon: Plane, badge: "bg-brand-sky/20 text-brand-navy" },
  { label: "COC", Icon: FileCheck, badge: "bg-emerald-500/10 text-emerald-600" },
  { label: "LCA", Icon: Scale, badge: "bg-violet-500/10 text-violet-600" },
  { label: "Invite Letter", Icon: Mail, badge: "bg-teal-500/10 text-teal-600" },
];

const APPLICATION_LOOKUP = Object.fromEntries(APPLICATION_TYPES.map((c) => [c.label, c])) as Record<
  ApplicationType,
  (typeof APPLICATION_TYPES)[number]
>;

// Small colored pill identifying which application a Things-to-do task belongs to.
// Reused on the case manager dashboard, supervisor dashboard(s) and employee dashboard
// so the visual language for "which app is this task from" is consistent everywhere.
export function ApplicationBadge({ app, className = "" }: { app: ApplicationType; className?: string }) {
  const cfg = APPLICATION_LOOKUP[app];
  if (!cfg) return null;
  const { Icon, badge } = cfg;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${badge} ${className}`}>
      <Icon className="w-3 h-3" />
      {app}
    </span>
  );
}
