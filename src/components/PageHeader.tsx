import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Bell, Sparkles } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { ActionCentreButton } from "@/components/ActionCentreButton";
import { CreateRequestButton } from "@/components/CreateRequestButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface PageHeaderProps {
  name?: string;
  role?: string;
  compact?: boolean;
}

export function PageHeader({ name = "Clark Kent", role = "Case Manager", compact }: PageHeaderProps) {
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
            <CreateRequestButton />
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
            <li className="p-8 text-center text-sm text-muted-foreground">No alerts right now.</li>
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
