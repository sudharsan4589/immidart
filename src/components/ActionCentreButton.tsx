import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

/** Static pending-action count shown as a badge on the Action Centre button.
 *  Kept in lockstep with the Things-to-do task count on each role's dashboard. */
const ACTION_COUNT = 4;

export function ActionCentreButton() {
  return (
    <Link
      to="/actions"
      className="relative inline-flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded text-sm font-semibold hover:bg-brand-navy/90 transition-colors"
    >
      <ClipboardList className="w-4 h-4" />
      Action Centre
      <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-brand-red text-white text-[10px] font-bold grid place-items-center leading-none">
        {ACTION_COUNT}
      </span>
    </Link>
  );
}
