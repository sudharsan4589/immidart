import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Briefcase, Plane } from "lucide-react";

const options = [
  {
    label: "International Assignment",
    description: "Relocate an employee to work in another country under a formal assignment.",
    icon: Briefcase,
    to: "/assignment-request" as const,
  },
  {
    label: "Business Visa",
    description: "Request a short-term visa for business travel, meetings, or conferences.",
    icon: Plane,
    to: "/assignment-request" as const,
  },
];

export function CreateRequestButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 bg-transparent border border-emerald-600 text-emerald-600 px-4 py-2 rounded text-sm font-semibold hover:bg-emerald-600/5 transition-colors"
      >
        + Create Request
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-lg shadow-lg border border-border z-50 overflow-hidden">
          {options.map(({ label, description, icon: Icon, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-4 py-3.5 hover:bg-accent transition-colors group"
            >
              <span className="mt-0.5 w-8 h-8 rounded-md bg-emerald-600/10 grid place-items-center shrink-0">
                <Icon className="w-4 h-4 text-emerald-600" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground group-hover:text-brand-navy">
                  {label}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
