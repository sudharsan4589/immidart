import { Link } from "@tanstack/react-router";
import { FileBarChart2 } from "lucide-react";

export function ReportsButton() {
  return (
    <Link
      to="/reports"
      className="inline-flex items-center gap-2 bg-white border border-border text-brand-navy px-4 py-2 rounded text-sm font-semibold hover:bg-brand-navy hover:text-white hover:border-brand-navy transition-colors"
    >
      <FileBarChart2 className="w-4 h-4" />
      Reports
    </Link>
  );
}
