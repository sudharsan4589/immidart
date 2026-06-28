import { Briefcase, Globe2, Plane, FileCheck, Scale, Mail, type LucideIcon } from "lucide-react";

export type SavedReport = {
  id: string;
  name: string;
  generatedOn: string;
  generatedBy: string;
  format: "PDF" | "XLSX" | "CSV";
};

export type ReportApplication = {
  id: string;
  label: string;
  Icon: LucideIcon;
  description: string;
  reports: SavedReport[];
};

export const reportApplications: ReportApplication[] = [
  {
    id: "assignments",
    label: "Assignments",
    Icon: Briefcase,
    description: "Assignment lifecycle, cost projection and headcount reports.",
    reports: [
      { id: "asg-1", name: "Active Assignments — May 2026", generatedOn: "28/May/2026", generatedBy: "Clark Kent", format: "PDF" },
      { id: "asg-2", name: "Assignment Cost Summary — Q2", generatedOn: "02/Jun/2026", generatedBy: "Diana Prince", format: "XLSX" },
      { id: "asg-3", name: "Headcount by Destination", generatedOn: "10/Jun/2026", generatedBy: "Clark Kent", format: "XLSX" },
    ],
  },
  {
    id: "immigration",
    label: "Immigration",
    Icon: Globe2,
    description: "Visa filings, approvals and SLA performance reports.",
    reports: [
      { id: "imm-1", name: "Visa Filings — May 2026", generatedOn: "20/May/2026", generatedBy: "Clark Kent", format: "PDF" },
      { id: "imm-2", name: "SLA Breach Tracker", generatedOn: "01/Jun/2026", generatedBy: "Marcus Ellison", format: "XLSX" },
      { id: "imm-3", name: "Approvals by Country", generatedOn: "08/Jun/2026", generatedBy: "Clark Kent", format: "PDF" },
      { id: "imm-4", name: "Pending Screening Cases", generatedOn: "12/Jun/2026", generatedBy: "Yuki Tanaka", format: "CSV" },
      { id: "imm-5", name: "Decision Turnaround Time", generatedOn: "15/Jun/2026", generatedBy: "Clark Kent", format: "PDF" },
    ],
  },
  {
    id: "travel",
    label: "Travel",
    Icon: Plane,
    description: "Business travel volume and upcoming trip reports.",
    reports: [
      { id: "trv-1", name: "Travel Requests — May 2026", generatedOn: "25/May/2026", generatedBy: "Andre Müller", format: "PDF" },
      { id: "trv-2", name: "Upcoming Trips — Next 30 Days", generatedOn: "11/Jun/2026", generatedBy: "Clark Kent", format: "XLSX" },
    ],
  },
  {
    id: "coc",
    label: "COC",
    Icon: FileCheck,
    description: "Certificate of coverage issuance and renewal reports.",
    reports: [],
  },
  {
    id: "lca",
    label: "LCA",
    Icon: Scale,
    description: "Labor condition application filings and compliance reports.",
    reports: [
      { id: "lca-1", name: "LCA Filings — Q2 2026", generatedOn: "05/Jun/2026", generatedBy: "Priya Nair", format: "PDF" },
    ],
  },
  {
    id: "invite-letter",
    label: "Invite Letter",
    Icon: Mail,
    description: "Invitation letter issuance and turnaround reports.",
    reports: [
      { id: "inv-1", name: "Letters Issued — May 2026", generatedOn: "29/May/2026", generatedBy: "Clark Kent", format: "PDF" },
      { id: "inv-2", name: "Letters Issued — Jun 2026 (WTD)", generatedOn: "14/Jun/2026", generatedBy: "Clark Kent", format: "PDF" },
      { id: "inv-3", name: "Turnaround Time by Country", generatedOn: "14/Jun/2026", generatedBy: "Diana Prince", format: "XLSX" },
      { id: "inv-4", name: "Pending Requests", generatedOn: "16/Jun/2026", generatedBy: "Clark Kent", format: "CSV" },
    ],
  },
];
