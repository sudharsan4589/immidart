import { Link, useNavigate } from "@tanstack/react-router";
import { User, LogOut, UserCircle, ShieldCheck, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { clearAuth } from "@/lib/auth";

interface UserMenuProps {
  name?: string;
  role?: string;
  /** icon-only variant for compact headers (e.g. case detail page) */
  compact?: boolean;
}

export function UserMenu({ name = "Clark Kent", role = "Supervisor", compact = false }: UserMenuProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {compact ? (
          <button
            type="button"
            aria-label="Open user menu"
            className="w-9 h-9 rounded-full bg-brand-sky/15 grid place-items-center text-brand-blue hover:bg-brand-sky/30 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Open user menu"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-brand-navy/10 grid place-items-center">
              <User className="w-5 h-5 text-brand-navy" />
            </div>
            <span className="text-brand-navy font-semibold">{name}</span>
            <ChevronDown className="w-4 h-4 text-brand-navy" />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-0 overflow-hidden">
        {/* User identity */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-accent/30">
          <div className="w-10 h-10 rounded-full bg-brand-navy/10 grid place-items-center shrink-0">
            <User className="w-5 h-5 text-brand-navy" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-navy truncate">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>

        {/* View profile */}
        <div className="px-2 py-1.5 border-b border-border">
          <Link
            to="/profile"
            className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-sm font-medium text-brand-navy hover:bg-accent transition-colors"
          >
            <UserCircle className="w-4 h-4 text-brand-blue shrink-0" />
            View profile
          </Link>
        </div>

        {/* Consent / privacy notice */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-brand-navy mb-1">Data &amp; Privacy</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Immidart processes your personal data to manage assignments and immigration cases under applicable data‑protection law. Your data is handled securely and used only for mobility services.
              </p>
              <button
                type="button"
                className="text-[11px] text-brand-blue hover:underline mt-1.5 inline-block"
              >
                Read full privacy notice →
              </button>
            </div>
          </div>
        </div>

        {/* Log out */}
        <div className="px-2 py-1.5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full rounded-md px-2.5 py-2 text-sm font-medium text-brand-red hover:bg-brand-red/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Log out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
