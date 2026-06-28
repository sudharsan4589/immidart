import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { FlagIcon } from "@/components/FlagIcon";

// Overdue reportee requests requiring supervisor action.
// In production, replace with data from the assignments/actions API.
const OVERDUE_REQUESTS = [
  {
    caseRef: "WP1234567890",
    reportee: "Barry Allen",
    description: "Travelling to Germany",
    flagCode: "de",
    status: "Pending for Supervisor Approval",
  },
  {
    caseRef: "IWA9876543210",
    reportee: "Diana Prince",
    description: "Relocation to Canada",
    flagCode: "ca",
    status: "Pending for Supervisor Approval",
  },
];

export function MyAssignmentCard() {
  const [expanded, setExpanded] = useState(false);
  const primary = OVERDUE_REQUESTS[0];
  const extras = OVERDUE_REQUESTS.slice(1);
  const hasMore = extras.length > 0;

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">

      {/* ── Primary row ────────────────────────────────────────────────── */}
      <div className="bg-brand-navy flex items-center gap-4 px-5 py-3.5">

        {/* Overdue badge */}
        <div className="shrink-0 flex items-center gap-2 bg-brand-red text-white px-3.5 py-2 rounded-lg text-sm font-bold whitespace-nowrap">
          <AlertTriangle className="w-4 h-4" />
          Overdue Task
        </div>

        {/* Case info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-brand-sky uppercase tracking-wider leading-none mb-1">
            Reportee's Request · <span className="text-white/90 normal-case tracking-normal">{primary.reportee}</span>
          </p>
          <p className="text-sm font-bold text-white flex items-baseline gap-0 flex-wrap">
            <Link
              to="/case/$caseId"
              params={{ caseId: primary.caseRef }}
              className="underline underline-offset-2 decoration-white/40 hover:decoration-white/80 transition-colors"
            >
              {primary.caseRef}
            </Link>
            <span className="mx-2 text-white/40 font-normal">·</span>
            <span>{primary.description}&nbsp;<FlagIcon code={primary.flagCode} /></span>
          </p>
        </div>

        {/* Status + action + chevron */}
        <div className="shrink-0 flex items-center gap-3">
          <span className="border border-brand-red text-brand-red text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">
            {primary.status}
          </span>
          <button
            type="button"
            className="bg-brand-blue text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors whitespace-nowrap"
          >
            Complete action
          </button>

          {/* Chevron — interactive only when there are additional overdue items */}
          <div className="relative">
            <button
              type="button"
              onClick={() => hasMore && setExpanded((v) => !v)}
              disabled={!hasMore}
              aria-label={
                hasMore
                  ? expanded
                    ? "Collapse overdue requests"
                    : "Expand overdue requests"
                  : undefined
              }
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                hasMore
                  ? "border-white/30 text-white hover:bg-white/10 cursor-pointer"
                  : "border-white/10 text-white/20 cursor-default"
              }`}
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {hasMore && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-red text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {extras.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Expanded extra rows ─────────────────────────────────────────── */}
      {expanded &&
        extras.map((req) => (
          <div
            key={req.caseRef}
            className="bg-[oklch(0.22_0.14_265)] border-t border-white/10 flex items-center gap-4 px-5 py-3"
          >
            {/* Align case info under the badge column */}
            <div className="shrink-0 flex items-center gap-1.5 text-brand-red/80">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">Overdue</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-brand-sky uppercase tracking-wider leading-none mb-1">
                Reportee's Request · <span className="text-white/90 normal-case tracking-normal">{req.reportee}</span>
              </p>
              <p className="text-sm font-bold text-white flex items-baseline flex-wrap gap-0">
                <Link
                  to="/case/$caseId"
                  params={{ caseId: req.caseRef }}
                  className="underline underline-offset-2 decoration-white/40 hover:decoration-white/80 transition-colors"
                >
                  {req.caseRef}
                </Link>
                <span className="mx-2 text-white/40 font-normal">·</span>
                <span>{req.description}&nbsp;<FlagIcon code={req.flagCode} /></span>
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <span className="border border-brand-red text-brand-red text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap">
                {req.status}
              </span>
              <button
                type="button"
                className="bg-brand-blue text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors whitespace-nowrap"
              >
                Complete action
              </button>
              {/* spacer to align with primary row chevron column */}
              <div className="w-8 h-8 shrink-0" />
            </div>
          </div>
        ))}
    </div>
  );
}
