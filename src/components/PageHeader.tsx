import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Bell, Sparkles, AlertCircle, Clock, CheckCircle2, FileText } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { ActionCentreButton } from "@/components/ActionCentreButton";
import { CreateRequestButton } from "@/components/CreateRequestButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const alerts = [
  {
    id: "a1",
    type: "urgent" as const,
    icon: AlertCircle,
    iconColor: "text-brand-red",
    iconBg: "bg-brand-red/10",
    title: "Documents required for Work Permit",
    body: "2 documents are missing from your WP filing. Upload them before 21 May 2026 to avoid delays.",
    time: "2 hours ago",
    caseId: "WP1039203903",
  },
  {
    id: "a2",
    type: "info" as const,
    icon: Clock,
    iconColor: "text-brand-amber",
    iconBg: "bg-brand-amber/10",
    title: "Visa decision pending",
    body: "Your US Work Permit application is under review by the immigration authority. Expected decision by 19 Jun 2026.",
    time: "Yesterday",
    caseId: "WP1039203903",
  },
  {
    id: "a3",
    type: "success" as const,
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
    title: "LOA signed by Authorized Signatory",
    body: "Your Letter of Assignment has been countersigned. All authorizations are in place to proceed with filing.",
    time: "15 May 2026",
    caseId: "WP1039203903",
  },
  {
    id: "a4",
    type: "info" as const,
    icon: FileText,
    iconColor: "text-brand-blue",
    iconBg: "bg-brand-blue/10",
    title: "Travel authorization submitted",
    body: "Your UK business travel request (ATR5556667777) has been submitted for manager approval.",
    time: "22 Apr 2026",
    caseId: "ATR5556667777",
  },
];

interface PageHeaderProps {
  name?: string;
  role?: string;
  compact?: boolean;
  hideCreateRequest?: boolean;
}

export function PageHeader({ name = "Clark Kent", role = "Case Manager", compact, hideCreateRequest }: PageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="bg-white border-b-2 border-brand-navy">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold shrink-0">
            <span className="text-brand-blue">Immi</span>
            <span className="text-brand-orange">dart</span>
          </Link>
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
            {!hideCreateRequest && <CreateRequestButton />}
            <button
              type="button"
              onClick={() => setAlertsOpen(true)}
              aria-label="Alerts"
              className="w-10 h-10 flex items-center justify-center bg-white border border-brand-navy text-brand-navy rounded hover:bg-brand-navy hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
            <UserMenu name={name} role={role} compact={compact} />
          </div>
        </div>
      </header>

      <Sheet open={alertsOpen} onOpenChange={setAlertsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-brand-navy flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-blue" />
              Alerts
            </SheetTitle>
          </SheetHeader>
          <ul className="flex-1 overflow-y-auto divide-y divide-border">
            {alerts.map((alert) => (
              <li key={alert.id} className="p-4 flex flex-col gap-2 hover:bg-accent/30 transition-colors">
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${alert.iconBg}`}>
                    <alert.icon className={`w-4 h-4 ${alert.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-brand-navy leading-snug">{alert.title}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{alert.time}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{alert.body}</p>
                  </div>
                </div>
                <div className="pl-11">
                  <Link
                    to="/case/$caseId"
                    params={{ caseId: alert.caseId }}
                    onClick={() => setAlertsOpen(false)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-blue border border-brand-blue/40 rounded px-3 py-1 hover:bg-brand-blue hover:text-white transition-colors"
                  >
                    View request →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
