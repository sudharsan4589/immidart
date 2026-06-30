import { AppLoader } from "@/components/AppLoader";
import { AskImmibroButton } from "@/components/AskImmibroButton";
import { createFileRoute } from "@tanstack/react-router";
import { FlagIcon } from "@/components/FlagIcon";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect } from "react";
import {
  ClipboardList, FileText, FileCheck, DollarSign, Mail,
  Globe2, Briefcase, Layers, Shield, ShieldCheck,
  CheckCircle2, Clock, ChevronRight, ChevronLeft, ChevronDown,
  History, MessageSquare, User as UserIcon, Calendar,
  Building2, Info, ArrowRight, Check, X, Minus, Pencil, Send, BookMarked, Download, Plus,
  Sparkles, AlertCircle, Loader2,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/case/$caseId")({
  head: ({ params }) => ({
    meta: [
      { title: `Case ${params.caseId} — Immidart` },
      { name: "description", content: "Case detail view with questionnaire, documents and milestones." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: CaseSummary,
});

// ── Static data ───────────────────────────────────────────────────────────────

const CASE = {
  name:            "Clark Kent",
  fromCountry:     "India",
  fromCode:        "in",
  toCountry:       "United States",
  toCode:          "us",
  startDate:       "23 May 2026",
  endDate:         "22 Oct 2026",
  hostEntity:      "Immidart Technologies LLC",
  status:          "Pending for Visa Decision",
  visaType:        "H-1B Work Permit",
  iwaNo:           "IWA00260534751",
  department:      "Engineering",
  jobTitle:        "Senior Software Engineer",
  caseInitiator:   "Sarah Mitchell",
  globalGrade:     "Grade 6",
  deploymentModel: "International Assignment",
  passportNo:      "Z1234567",
  passportExpiry:  "14 Aug 2029",
  dob:             "12 Apr 1990",
  nationality:     "Indian",
  reportingManager:"Perry White",
  workLocation:    "New York, United States",
  assignmentType:  "International Transfer",
};

const sidebarTabs = [
  { key: "questionnaire",   label: "Questionnaire",              Icon: ClipboardList },
  { key: "documents",       label: "Documents",                  Icon: FileCheck     },
  { key: "visa-info",       label: "Visa Information",           Icon: Globe2        },
  { key: "work-permit",     label: "Work Permit",                Icon: Briefcase     },
  { key: "salary",          label: "Salary",                     Icon: DollarSign    },
  { key: "loa",             label: "Letter of Assignment",       Icon: FileText      },
  { key: "support-letter",  label: "Support Letter",             Icon: Mail          },
  { key: "casekit",         label: "Case Kit",                   Icon: Layers        },
  { key: "resident-permit", label: "Resident Permit",            Icon: Shield        },
  { key: "coc",             label: "COC",                        Icon: ShieldCheck   },
  { key: "pwn",             label: "Posted Worker Notification", Icon: ClipboardList },
] as const;
type TabKey = (typeof sidebarTabs)[number]["key"];

// ── Email / alert data ────────────────────────────────────────────────────────

type AlertEmail = {
  id: string;
  subject: string;
  fromName: string;
  from: string;
  to: string[];
  cc: string[];
  date: string;
  time: string;
  read: boolean;
  body: string;
};

const ALERTS: AlertEmail[] = [
  {
    id: "1",
    subject: "Request initiated for Clark Kent",
    fromName: "Immidart System",
    from: "system@immidart.com",
    to: ["sarah.mitchell@immidart.com"],
    cc: ["perry.white@dailyplanet.com", "hr@immidart.com"],
    date: "28 Jun 2026, 10:30 AM",
    time: "2 days ago",
    read: false,
    body: `Dear Sarah,

This is to inform you that a new international assignment request has been initiated for Clark Kent.

Case Reference: IWA00260534751
Employee: Clark Kent
Origin Country: India
Destination Country: United States
Visa Type: H-1B Work Permit
Assignment Period: 23 May 2026 – 22 Oct 2026
Host Entity: Immidart Technologies LLC

Please review the request in the system and proceed with the necessary immigration processing steps.

Regards,
Immidart System`,
  },
  {
    id: "2",
    subject: "Documents requested from employee",
    fromName: "Sarah Mitchell",
    from: "sarah.mitchell@immidart.com",
    to: ["clark.kent@dailyplanet.com"],
    cc: ["hr@immidart.com"],
    date: "25 Jun 2026, 02:15 PM",
    time: "5 days ago",
    read: true,
    body: `Dear Clark,

As part of your H-1B work permit application process, we require the following documents to proceed:

1. Passport copy (all pages, including blank pages)
2. Updated CV / Resume
3. Educational certificates (degree, transcripts)
4. Previous US visa copies (if any)
5. I-94 record (if previously in the US)
6. Current US visa status documentation

Please upload these documents to the Immidart portal at your earliest convenience. The deadline for submission is 05 Jul 2026.

If you have any questions, feel free to reach out.

Best regards,
Sarah Mitchell
Immigration Case Manager — Immidart`,
  },
  {
    id: "3",
    subject: "Visa appointment scheduled — 15 Jun 2026",
    fromName: "US Consulate Chennai (via Immidart)",
    from: "appointments@immidart.com",
    to: ["clark.kent@dailyplanet.com"],
    cc: ["sarah.mitchell@immidart.com", "perry.white@dailyplanet.com"],
    date: "19 Jun 2026, 11:00 AM",
    time: "1 week ago",
    read: true,
    body: `Dear Clark Kent,

Your H-1B visa stamping appointment has been successfully scheduled. Please find the details below:

Appointment Date: 15 Jul 2026
Time: 09:30 AM (IST)
Location: US Consulate General, Chennai
          220 Anna Salai, Chennai – 600 006

Case Reference: IWA00260534751
Petition Number: WAC-26-123-45678

Documents to carry on the day:
- DS-160 confirmation page
- Valid passport (and all previous passports)
- Appointment confirmation print-out
- Passport-size photographs (2 nos, as per US specs)
- H-1B approval notice (I-797)
- LCA copy
- Offer / assignment letter

Please arrive at least 15 minutes before your scheduled time. Mobile phones and electronic devices are not permitted inside.

Regards,
Immidart Appointment Team`,
  },
];

type DraftEmail = {
  id: string;
  to: string;
  cc: string;
  subject: string;
  body: string;
  savedAt: string;
};

type SentEmail = {
  id: string;
  subject: string;
  fromName: string;
  to: string[];
  cc: string[];
  date: string;
  body: string;
};

const INITIAL_DRAFTS: DraftEmail[] = [
  {
    id: "d1",
    to: "clark.kent@dailyplanet.com",
    cc: "",
    subject: "RE: Visa appointment rescheduling request",
    body: `Hi Clark,

Regarding your request to reschedule the visa appointment — I have contacted the consulate and am awaiting confirmation of available slots.

I will revert by end of this week.

Best,
Sarah`,
    savedAt: "29 Jun 2026",
  },
];

const INITIAL_SENT: SentEmail[] = [
  {
    id: "s1",
    subject: "Screening completed — next steps",
    fromName: "Sarah Mitchell",
    to: ["clark.kent@dailyplanet.com"],
    cc: ["perry.white@dailyplanet.com"],
    date: "14 May 2026, 11:30 AM",
    body: `Dear Clark,

Your eligibility screening has been successfully completed. Your case is now moving to the LCA certification phase.

You will receive further updates as the process progresses. Please ensure your passport remains valid for at least 12 months from the intended travel date.

Best regards,
Sarah Mitchell`,
  },
  {
    id: "s2",
    subject: "Case initiated — IWA00260534751",
    fromName: "Sarah Mitchell",
    to: ["clark.kent@dailyplanet.com", "perry.white@dailyplanet.com"],
    cc: ["hr@immidart.com"],
    date: "01 May 2026, 09:15 AM",
    body: `Hi Clark, Hi Perry,

I am pleased to inform you that the international assignment case for Clark Kent has been formally initiated in the Immidart system.

Case Reference: IWA00260534751
Visa Category: H-1B Specialty Occupation
Assignment: India → United States (23 May – 22 Oct 2026)

I will be the primary case manager for this assignment. Please don't hesitate to reach out with any queries.

Best regards,
Sarah Mitchell
Immigration Case Manager — Immidart`,
  },
];

// ── Other static data ─────────────────────────────────────────────────────────

const milestones = [
  {
    id: "m1",
    name: "LOA Signed by Authorized Signatory",
    description: "Letter of Assignment reviewed and countersigned. All authorizations in place.",
    status: "completed" as const,
    date: "15 May 2026",
    actions: ["Document uploaded by HR", "Reviewed by Legal", "Countersignature obtained"],
  },
  {
    id: "m2",
    name: "Filing with Immigration Authorities",
    description: "Work permit application submitted to USCIS for formal review and processing.",
    status: "in-progress" as const,
    date: "Est. 19 Jun 2026",
    actions: ["Application prepared", "LCA certified", "Filing submitted to USCIS"],
  },
  {
    id: "m3",
    name: "Biometrics & Consular Interview",
    description: "Employee attends biometrics appointment and visa interview at the consulate.",
    status: "upcoming" as const,
    date: "Est. 30 Jun 2026",
    actions: [],
  },
  {
    id: "m4",
    name: "Visa Decision",
    description: "USCIS issues approval or request for additional evidence.",
    status: "upcoming" as const,
    date: "Est. 30 Jul 2026",
    actions: [],
  },
  {
    id: "m5",
    name: "Visa Stamping",
    description: "Employee collects visa stamp from consulate after approval.",
    status: "upcoming" as const,
    date: "Est. 10 Aug 2026",
    actions: [],
  },
];

const caseLogs = [
  { date: "01 Jun 2026", time: "10:30 AM", action: "Application filed with USCIS",              user: "Sarah Mitchell" },
  { date: "15 May 2026", time: "03:15 PM", action: "LOA countersigned by authorized signatory", user: "Perry White"    },
  { date: "14 May 2026", time: "11:00 AM", action: "Screening completed",                       user: "Sarah Mitchell" },
  { date: "10 May 2026", time: "09:45 AM", action: "All documents uploaded and verified",       user: "System"         },
  { date: "05 May 2026", time: "02:00 PM", action: "LCA application certified",                 user: "Sarah Mitchell" },
  { date: "03 May 2026", time: "10:00 AM", action: "Questionnaire sent to employee",            user: "Sarah Mitchell" },
  { date: "01 May 2026", time: "09:00 AM", action: "Case initiated",                            user: "Sarah Mitchell" },
];

const clarifications = [
  {
    id: "c1",
    title: "Clarify previous US travel history",
    detail: "Please provide details of your last 3 visits to the United States including dates, visa type used, and purpose of travel.",
    status: "Pending" as const,
    dueDate: "21 May 2026",
    raisedBy: "Sarah Mitchell",
  },
  {
    id: "c2",
    title: "Confirm educational qualification dates",
    detail: "The dates on the uploaded educational certificates appear to conflict with the employment start date. Please confirm the correct graduation year.",
    status: "Resolved" as const,
    dueDate: "08 May 2026",
    raisedBy: "Sarah Mitchell",
  },
];

type AiCheckItem = { check: string; result: string; passed: boolean | null };
type DocFile     = { name: string; size: string; uploaded: string };
type Document    = {
  id: string;
  name: string;
  description: string;
  status: "Verified" | "Submitted" | "Pending";
  uploaded: string;
  size: string;
  files: DocFile[];
  aiRemarks: { status: string; checkedAt: string | null; items: AiCheckItem[] };
};

const documents: Document[] = [
  {
    id: "doc1",
    name: "Passport",
    description: "Valid travel document — minimum 12-month validity from travel date required",
    status: "Verified",
    uploaded: "10 Mar 2026",
    size: "1.2 MB",
    files: [
      { name: "Passport_CK_Z1234567_all_pages.pdf", size: "1.2 MB", uploaded: "10 Mar 2026" },
    ],
    aiRemarks: {
      status: "Passed",
      checkedAt: "10 Mar 2026, 03:45 PM",
      items: [
        { check: "Passport validity",  result: "Valid until 14 Aug 2029 — exceeds 12-month minimum from travel date", passed: true  },
        { check: "Name match",         result: "Name matches assignment record: Clark Joseph Kent",                   passed: true  },
        { check: "MRZ integrity",      result: "Machine-readable zone verified and intact",                          passed: true  },
        { check: "Photo quality",      result: "Photo meets ICAO biometric standards",                               passed: true  },
        { check: "Issuing authority",  result: "Government of India — verified against issuer database",             passed: true  },
      ],
    },
  },
  {
    id: "doc2",
    name: "H-1B Approval Notice",
    description: "USCIS Form I-797 confirming approval of H-1B petition for specialty occupation",
    status: "Submitted",
    uploaded: "15 Mar 2026",
    size: "820 KB",
    files: [
      { name: "I-797_Approval_WAC-26-123-45678.pdf", size: "820 KB", uploaded: "15 Mar 2026" },
    ],
    aiRemarks: {
      status: "In Progress",
      checkedAt: "15 Mar 2026, 10:00 AM",
      items: [
        { check: "Petition number format", result: "WAC-26-123-45678 — format validated",                               passed: true  },
        { check: "Employer details",        result: "Immidart Technologies LLC — matches case record",                   passed: true  },
        { check: "USCIS database check",    result: "Cross-check with USCIS records in progress — awaiting response",    passed: null  },
        { check: "Validity period",         result: "Document extraction in progress",                                   passed: null  },
      ],
    },
  },
  {
    id: "doc3",
    name: "Offer Letter",
    description: "Signed employment offer confirming role, compensation and assignment start date",
    status: "Verified",
    uploaded: "02 Feb 2026",
    size: "210 KB",
    files: [
      { name: "Offer_Letter_ClarkKent_Signed.pdf", size: "210 KB", uploaded: "02 Feb 2026" },
    ],
    aiRemarks: {
      status: "Passed",
      checkedAt: "02 Feb 2026, 05:10 PM",
      items: [
        { check: "Candidate name",      result: "Clark Kent — matches assignment record",             passed: true },
        { check: "Designation match",   result: "Senior Software Engineer — consistent with LCA",    passed: true },
        { check: "Salary disclosed",    result: "$120,000 per annum — meets LCA prevailing wage",    passed: true },
        { check: "Signature presence",  result: "Authorised signatory signature detected",            passed: true },
        { check: "Company letterhead",  result: "Immidart Technologies LLC — letterhead verified",   passed: true },
      ],
    },
  },
  {
    id: "doc4",
    name: "Educational Certificates",
    description: "Degree certificates and transcripts required to establish specialty occupation eligibility",
    status: "Pending",
    uploaded: "—",
    size: "—",
    files: [],
    aiRemarks: {
      status: "Pending",
      checkedAt: null,
      items: [],
    },
  },
  {
    id: "doc5",
    name: "I-94 Record",
    description: "US Customs and Border Protection arrival/departure record for prior US visits",
    status: "Verified",
    uploaded: "28 Apr 2026",
    size: "95 KB",
    files: [
      { name: "I94_Record_ClarkKent_Mar2024.pdf", size: "95 KB", uploaded: "28 Apr 2026" },
    ],
    aiRemarks: {
      status: "Passed",
      checkedAt: "28 Apr 2026, 01:20 PM",
      items: [
        { check: "Name match",         result: "Clark Kent — matches passport record",                       passed: true },
        { check: "Entry status",       result: "B-1 entry — lawful admission confirmed",                     passed: true },
        { check: "Overstay check",     result: "No overstay detected — departed within authorised period",   passed: true },
        { check: "Record integrity",   result: "CBP record hash validated",                                  passed: true },
      ],
    },
  },
  {
    id: "doc6",
    name: "Assignment Letter",
    description: "Letter of Assignment detailing scope, duration, benefits and terms of international assignment",
    status: "Verified",
    uploaded: "30 Apr 2026",
    size: "150 KB",
    files: [
      { name: "LOA_ClarkKent_IWA00260534751_v2.pdf", size: "150 KB", uploaded: "30 Apr 2026" },
      { name: "LOA_ClarkKent_IWA00260534751_v1.pdf", size: "148 KB", uploaded: "22 Apr 2026" },
    ],
    aiRemarks: {
      status: "Passed",
      checkedAt: "30 Apr 2026, 09:55 AM",
      items: [
        { check: "Assignment period",   result: "23 May 2026 – 22 Oct 2026 — matches case record",          passed: true },
        { check: "Destination country", result: "United States — consistent with visa application",         passed: true },
        { check: "Host entity",         result: "Immidart Technologies LLC — verified",                     passed: true },
        { check: "Signatory",           result: "Authorised signatory present — countersignature detected", passed: true },
        { check: "Compensation terms",  result: "Allowances and salary band detected and validated",        passed: true },
      ],
    },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const docStatusStyle: Record<string, string> = {
  Verified:  "bg-emerald-500/10 text-emerald-600",
  Submitted: "bg-brand-blue/10 text-brand-blue",
  Pending:   "bg-brand-amber/10 text-brand-amber",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
      <p className="text-sm font-semibold text-brand-navy">{value}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest mb-4 pb-2 border-b border-border">
      {children}
    </h3>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold whitespace-nowrap">
      {status}
    </span>
  );
}

// ── Tab content panels ────────────────────────────────────────────────────────

function QuestionnairePanel({ onSendForClarification }: { onSendForClarification: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading>Personal Information</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="Full Legal Name"   value="Clark Joseph Kent"                        />
          <Field label="Date of Birth"     value="12 Apr 1990"                              />
          <Field label="Nationality"       value="Indian"                                   />
          <Field label="Passport Number"   value="Z1234567"                                 />
          <Field label="Passport Expiry"   value="14 Aug 2029"                              />
          <Field label="Current Address"   value="344 Clinton St, Metropolis, IN 62960"     />
        </div>
      </div>
      <div>
        <SectionHeading>Assignment Details</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="Job Title"           value="Senior Software Engineer"    />
          <Field label="Department"          value="Engineering"                 />
          <Field label="Reporting Manager"   value="Perry White"                 />
          <Field label="Receiving Company"   value="Immidart Technologies LLC"   />
          <Field label="Work Location"       value="New York, United States"     />
          <Field label="Assignment Type"     value="International Transfer"      />
          <Field label="Assignment Duration" value="6 Months"                    />
          <Field label="Start Date"          value="23 May 2026"                 />
          <Field label="End Date"            value="22 Oct 2026"                 />
        </div>
      </div>
      <div>
        <SectionHeading>Immigration History</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="Previously visited US?" value="Yes"                              />
          <Field label="Last US Visit"           value="March 2024 (B-1 Business Visa)"  />
          <Field label="Any visa refusals?"      value="No"                              />
          <Field label="Current US Visa Status"  value="None"                            />
          <Field label="Criminal record?"        value="No"                              />
          <Field label="Dependants travelling?"  value="No"                              />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onSendForClarification}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-amber text-brand-amber text-sm font-semibold hover:bg-brand-amber/10 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Send for Clarification
        </button>
      </div>
    </div>
  );
}

function DocumentDetailSheet({ doc, onClose, onSendForClarification }: { doc: Document | null; onClose: () => void; onSendForClarification: () => void }) {
  if (!doc) return null;

  const aiStatusStyle: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Passed:      { bg: "bg-emerald-500/10", text: "text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    "In Progress": { bg: "bg-brand-blue/10",  text: "text-brand-blue",  icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
    Pending:     { bg: "bg-brand-amber/10", text: "text-brand-amber", icon: <Clock className="w-3.5 h-3.5" /> },
  };

  const ai = aiStatusStyle[doc.aiRemarks.status] ?? aiStatusStyle.Pending;

  return (
    <Sheet open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 pr-12 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-sky/20 grid place-items-center shrink-0 mt-0.5">
              <FileCheck className="w-4.5 h-4.5 text-brand-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-brand-navy leading-snug">{doc.name}</SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{doc.description}</p>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${docStatusStyle[doc.status] ?? "bg-muted text-muted-foreground"}`}>
              {doc.status}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Uploaded files */}
          <div>
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest mb-3 pb-2 border-b border-border">
              Uploaded Files
            </h3>
            {doc.files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 gap-2 rounded-lg border border-dashed border-border bg-accent/30">
                <FileText className="w-6 h-6 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No files uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {doc.files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-3">
                    <div className="w-8 h-8 rounded-md bg-brand-blue/10 grid place-items-center shrink-0">
                      <FileText className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-navy truncate">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{f.size} · Uploaded {f.uploaded}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Download file"
                      className="w-7 h-7 grid place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-brand-navy transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI screening remarks */}
          <div>
            <h3 className="text-xs font-bold text-brand-navy uppercase tracking-widest mb-3 pb-2 border-b border-border flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
              AI Document Screening
            </h3>

            {/* Overall status */}
            <div className={`flex items-center gap-2.5 rounded-lg px-4 py-3 mb-4 ${ai.bg}`}>
              <span className={ai.text}>{ai.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${ai.text}`}>
                  {doc.aiRemarks.status === "Passed"      && "All checks passed — document verified"}
                  {doc.aiRemarks.status === "In Progress" && "Screening in progress — checks running"}
                  {doc.aiRemarks.status === "Pending"     && "Awaiting upload — screening not started"}
                </p>
                {doc.aiRemarks.checkedAt && (
                  <p className={`text-[10px] mt-0.5 ${ai.text} opacity-70`}>Last checked {doc.aiRemarks.checkedAt}</p>
                )}
              </div>
            </div>

            {/* Check-by-check results */}
            {doc.aiRemarks.items.length > 0 ? (
              <div className="space-y-2">
                {doc.aiRemarks.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-white px-4 py-3">
                    <span className={`shrink-0 mt-0.5 ${
                      item.passed === true  ? "text-emerald-500" :
                      item.passed === false ? "text-brand-red"   :
                      "text-brand-amber"
                    }`}>
                      {item.passed === true  && <CheckCircle2 className="w-4 h-4" />}
                      {item.passed === false && <AlertCircle  className="w-4 h-4" />}
                      {item.passed === null  && <Loader2      className="w-4 h-4 animate-spin" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-brand-navy uppercase tracking-wide">{item.check}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {doc.status === "Pending"
                  ? "Upload the document to trigger AI screening."
                  : "Screening results will appear here once processing is complete."}
              </p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-brand-canvas/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => { onClose(); onSendForClarification(); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-amber text-brand-amber text-sm font-semibold hover:bg-brand-amber/10 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Send for Clarification
          </button>
        </div>

      </SheetContent>
    </Sheet>
  );
}

function DocumentsPanel({ onSendForClarification }: { onSendForClarification: () => void }) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  return (
    <div>
      <SectionHeading>Uploaded Documents</SectionHeading>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-canvas text-brand-navy text-[11px] font-semibold uppercase tracking-wide">
              <th className="text-left px-4 py-3">Document</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Uploaded</th>
              <th className="text-left px-4 py-3">Size</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr
                key={d.id}
                onClick={() => setSelectedDoc(d)}
                className="border-t border-border/60 hover:bg-brand-sky/10 transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3.5">
                  <span className="font-semibold text-brand-blue group-hover:underline underline-offset-2">
                    {d.name}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs max-w-[220px]">
                  <span className="line-clamp-2 leading-relaxed">{d.description}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${docStatusStyle[d.status] ?? "bg-muted text-muted-foreground"}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{d.uploaded}</td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs">{d.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DocumentDetailSheet
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onSendForClarification={() => { setSelectedDoc(null); onSendForClarification(); }}
      />
    </div>
  );
}

function VisaInfoPanel() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading>Visa Details</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="Visa Type"          value="H-1B Specialty Occupation"   />
          <Field label="Visa Category"      value="Work Permit"                 />
          <Field label="Consulate"          value="US Consulate, Chennai"       />
          <Field label="Appointment Date"   value="15 Jun 2026"                 />
          <Field label="Filing Date"        value="01 Jun 2026"                 />
          <Field label="Priority Date"      value="01 Mar 2026"                 />
          <Field label="Expected Decision"  value="Est. 30 Jul 2026"            />
          <Field label="Petition Number"    value="WAC-26-123-45678"            />
          <Field label="Attorney of Record" value="Immigration Partners LLP"    />
        </div>
      </div>
      <div>
        <SectionHeading>LCA Information</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="LCA Number"      value="I-200-26012-345678"  />
          <Field label="LCA Status"      value="Certified"           />
          <Field label="Certified On"    value="05 May 2026"         />
          <Field label="SOC Code"        value="15-1252"             />
          <Field label="Wage Level"      value="Level III"           />
          <Field label="Prevailing Wage" value="$115,000 / year"     />
        </div>
      </div>
    </div>
  );
}

function WorkPermitPanel() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading>Work Permit Information</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="Permit Type"        value="H-1B Work Permit"           />
          <Field label="Authorised Period"  value="23 May 2026 – 22 Oct 2026"  />
          <Field label="Employer of Record" value="Immidart Technologies LLC"  />
          <Field label="Work Site"          value="350 5th Ave, New York, NY"  />
          <Field label="USCIS Case No."     value="WAC-26-123-45678"           />
          <Field label="Premium Processing" value="Yes"                        />
        </div>
      </div>
      <div>
        <SectionHeading>Port of Entry</SectionHeading>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
          <Field label="Planned Entry Port"  value="JFK International Airport, New York" />
          <Field label="Entry Date"          value="Est. 20 Aug 2026"                    />
          <Field label="Entry Visa Required" value="Yes — H-1B Stamp"                   />
          <Field label="I-94 Auto-Issued"    value="Yes"                                 />
        </div>
      </div>
    </div>
  );
}

function SalaryPanel() {
  return (
    <div>
      <SectionHeading>Compensation Details</SectionHeading>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
        <Field label="Base Salary"               value="$120,000 per annum"  />
        <Field label="Currency"                  value="USD"                 />
        <Field label="Pay Frequency"             value="Monthly"             />
        <Field label="Host Country Allowance"    value="$1,500 / month"      />
        <Field label="Housing Allowance"         value="$2,000 / month"      />
        <Field label="Cost Equalization Applied" value="Yes"                 />
        <Field label="Tax Equalization"          value="Yes"                 />
        <Field label="Social Security"           value="Employer-covered"    />
        <Field label="Bonus Eligible"            value="Yes — Annual"        />
      </div>
    </div>
  );
}

function LOAPanel() {
  return (
    <div>
      <SectionHeading>Letter of Assignment</SectionHeading>
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <Field label="LOA Reference"    value="LOA-2026-0142"            />
        <Field label="Issue Date"       value="10 May 2026"              />
        <Field label="Signed Date"      value="15 May 2026"              />
        <Field label="Signatory"        value="Regional HR Director"     />
        <Field label="LOA Status"       value="Signed & Countersigned"   />
        <Field label="Assignment Title" value="Senior Software Engineer"  />
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">LOA fully executed</p>
          <p className="text-xs text-emerald-700 mt-0.5">All parties have signed. The letter is legally binding and on file.</p>
        </div>
      </div>
    </div>
  );
}

function GenericPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-sky/10 grid place-items-center">
        <Info className="w-5 h-5 text-brand-blue" />
      </div>
      <p className="text-sm font-semibold text-brand-navy">{title}</p>
      <p className="text-xs text-muted-foreground max-w-[240px]">This section is being prepared. Content will appear here once the case reaches this stage.</p>
    </div>
  );
}

// ── Shared action buttons ─────────────────────────────────────────────────────

function ApproveRejectButtons() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
      >
        <Check className="w-3.5 h-3.5" /> Approve
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg border border-brand-red text-brand-red text-sm font-semibold hover:bg-brand-red/5 transition-colors"
      >
        <X className="w-3.5 h-3.5" /> Reject
      </button>
    </div>
  );
}

// ── Alerts Sheet (multi-view email overlay) ───────────────────────────────────

type AlertsView = "inbox" | "detail" | "compose" | "drafts" | "sent";

function AlertsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView]               = useState<AlertsView>("inbox");
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [selectedSentId, setSelectedSentId]   = useState<string | null>(null);
  const [drafts, setDrafts]           = useState<DraftEmail[]>(INITIAL_DRAFTS);
  const [sent, setSent]               = useState<SentEmail[]>(INITIAL_SENT);
  const [composeTo, setComposeTo]     = useState("");
  const [composeCC, setComposeCC]     = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  function resetToInbox() {
    setView("inbox");
    setSelectedAlertId(null);
    setSelectedDraftId(null);
    setSelectedSentId(null);
  }

  function handleClose() {
    resetToInbox();
    onClose();
  }

  function openCompose(prefill?: Partial<DraftEmail>) {
    setComposeTo(prefill?.to ?? "");
    setComposeCC(prefill?.cc ?? "");
    setComposeSubject(prefill?.subject ?? "");
    setComposeBody(prefill?.body ?? "");
    setView("compose");
  }

  function handleSend() {
    if (!composeTo.trim() && !composeSubject.trim()) return;
    const newSent: SentEmail = {
      id: `s${Date.now()}`,
      subject: composeSubject || "(no subject)",
      fromName: "Sarah Mitchell",
      to: composeTo.split(",").map(s => s.trim()).filter(Boolean),
      cc: composeCC.split(",").map(s => s.trim()).filter(Boolean),
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) + ", " +
            new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      body: composeBody,
    };
    setSent(prev => [newSent, ...prev]);
    resetToInbox();
  }

  function handleSaveDraft() {
    if (!composeSubject.trim() && !composeBody.trim()) return;
    const newDraft: DraftEmail = {
      id: `d${Date.now()}`,
      to: composeTo,
      cc: composeCC,
      subject: composeSubject || "(no subject)",
      body: composeBody,
      savedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDrafts(prev => [newDraft, ...prev]);
    resetToInbox();
  }

  function handleDeleteDraft(id: string) {
    setDrafts(prev => prev.filter(d => d.id !== id));
  }

  const selectedAlert = ALERTS.find(a => a.id === selectedAlertId) ?? null;
  const selectedDraft = drafts.find(d => d.id === selectedDraftId) ?? null;
  const selectedSent  = sent.find(s => s.id === selectedSentId) ?? null;

  const titles: Record<AlertsView, string> = {
    inbox:   "Alerts",
    detail:  selectedAlert?.subject ?? "Email",
    compose: "Compose Email",
    drafts:  "Drafts",
    sent:    "Sent",
  };

  const inputCls = "w-full rounded-lg border border-border px-3 py-2 text-sm text-brand-navy placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
        {/* Sheet header */}
        <SheetHeader className="px-5 py-4 pr-12 border-b border-border flex-row items-center gap-3 shrink-0">
          {view !== "inbox" && (
            <button
              type="button"
              onClick={resetToInbox}
              className="w-7 h-7 grid place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-brand-navy transition-colors"
              aria-label="Back to inbox"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <SheetTitle className="text-brand-navy text-base flex-1 truncate">{titles[view]}</SheetTitle>
          {view === "inbox" && (
            <button
              type="button"
              onClick={() => openCompose()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90 transition-colors"
            >
              <Pencil className="w-3 h-3" /> Compose
            </button>
          )}
          {view === "compose" && (
            <button
              type="button"
              onClick={resetToInbox}
              className="text-xs font-medium text-muted-foreground hover:text-brand-red transition-colors"
            >
              Discard
            </button>
          )}
        </SheetHeader>

        {/* ── Inbox view ── */}
        {view === "inbox" && (
          <div className="flex-1 overflow-y-auto">
            {/* Alert emails */}
            <div className="p-4 space-y-2">
              {ALERTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => { setSelectedAlertId(a.id); setView("detail"); }}
                  className={`w-full text-left rounded-lg border px-4 py-3 flex items-start gap-2 transition-colors hover:border-brand-blue/40 hover:bg-brand-sky/10 ${
                    !a.read ? "border-brand-blue/30 bg-brand-sky/10" : "border-border bg-white"
                  }`}
                >
                  {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mt-1.5" />}
                  <div className={`flex-1 min-w-0 ${a.read ? "ml-3.5" : ""}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[12px] font-semibold text-brand-navy leading-snug truncate">{a.subject}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">From: {a.fromName}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-border" />

            {/* Drafts section */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => setView("drafts")}
                className="flex items-center justify-between w-full group"
              >
                <span className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-widest">
                  <BookMarked className="w-3.5 h-3.5 text-brand-blue" />
                  Drafts
                  {drafts.length > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-amber/20 text-brand-amber text-[9px] font-bold">
                      {drafts.length}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand-navy transition-colors" />
              </button>
              {drafts.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {drafts.slice(0, 2).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => { setSelectedDraftId(d.id); openCompose(d); }}
                      className="w-full text-left rounded-lg border border-border bg-white px-3 py-2.5 hover:border-brand-blue/30 hover:bg-brand-sky/5 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[12px] font-medium text-brand-navy truncate">{d.subject}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{d.savedAt}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">To: {d.to || "(no recipient)"}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-border" />

            {/* Sent section */}
            <div className="p-4">
              <button
                type="button"
                onClick={() => setView("sent")}
                className="flex items-center justify-between w-full group"
              >
                <span className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-widest">
                  <Send className="w-3.5 h-3.5 text-brand-blue" />
                  Sent
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand-navy transition-colors" />
              </button>
              {sent.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {sent.slice(0, 2).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setSelectedSentId(s.id); setView("sent"); }}
                      className="w-full text-left rounded-lg border border-border bg-white px-3 py-2.5 hover:border-brand-blue/30 hover:bg-brand-sky/5 transition-colors"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-[12px] font-medium text-brand-navy truncate">{s.subject}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{s.date.split(",")[0]}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">To: {s.to.join(", ")}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Email detail view ── */}
        {view === "detail" && selectedAlert && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-brand-navy leading-snug">{selectedAlert.subject}</h2>
              <p className="text-[11px] text-muted-foreground">{selectedAlert.date}</p>
            </div>
            <div className="rounded-lg border border-border bg-brand-canvas/50 px-4 py-3 space-y-1.5 text-[12px]">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-8 shrink-0 font-medium">From</span>
                <span className="text-brand-navy font-semibold">{selectedAlert.fromName} <span className="text-muted-foreground font-normal">&lt;{selectedAlert.from}&gt;</span></span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-8 shrink-0 font-medium">To</span>
                <span className="text-brand-navy">{selectedAlert.to.join(", ")}</span>
              </div>
              {selectedAlert.cc.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-8 shrink-0 font-medium">CC</span>
                  <span className="text-brand-navy">{selectedAlert.cc.join(", ")}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-brand-navy leading-relaxed whitespace-pre-wrap font-mono bg-white rounded-lg border border-border/60 px-4 py-4">
              {selectedAlert.body}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => openCompose({
                  to: selectedAlert.from,
                  cc: selectedAlert.cc.join(", "),
                  subject: `RE: ${selectedAlert.subject}`,
                  body: `\n\n---\nOn ${selectedAlert.date}, ${selectedAlert.fromName} wrote:\n${selectedAlert.body.split("\n").map(l => `> ${l}`).join("\n")}`,
                })}
                className="px-4 py-2 rounded-lg bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90 transition-colors"
              >
                Reply
              </button>
              <button
                type="button"
                onClick={() => openCompose({
                  subject: `FWD: ${selectedAlert.subject}`,
                  body: `\n\n---\n${selectedAlert.body}`,
                })}
                className="px-4 py-2 rounded-lg border border-border text-brand-navy text-xs font-semibold hover:bg-accent transition-colors"
              >
                Forward
              </button>
            </div>
          </div>
        )}

        {/* ── Compose view ── */}
        {view === "compose" && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-5 space-y-3">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">To</label>
                  <input
                    type="email"
                    placeholder="recipient@example.com"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">CC</label>
                  <input
                    type="email"
                    placeholder="cc@example.com"
                    value={composeCC}
                    onChange={(e) => setComposeCC(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Email subject"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Message</label>
                <textarea
                  placeholder="Write your message here..."
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={14}
                  className={`${inputCls} resize-none font-mono leading-relaxed`}
                />
              </div>
            </div>
            {/* Footer actions */}
            <div className="px-5 py-4 border-t border-border bg-brand-canvas/50 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-navy text-white text-sm font-semibold hover:bg-brand-navy/90 transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-brand-navy text-sm font-semibold hover:bg-accent transition-colors"
              >
                <BookMarked className="w-3.5 h-3.5" /> Save draft
              </button>
            </div>
          </div>
        )}

        {/* ── Drafts view ── */}
        {view === "drafts" && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
                <BookMarked className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No drafts saved</p>
              </div>
            ) : (
              drafts.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-white px-4 py-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => openCompose(d)}
                      className="text-left w-full"
                    >
                      <p className="text-sm font-semibold text-brand-navy truncate">{d.subject}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">To: {d.to || "(no recipient)"}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 italic">{d.body.trim().split("\n")[0]}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Saved {d.savedAt}</p>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDraft(d.id)}
                    className="shrink-0 w-6 h-6 grid place-items-center rounded text-muted-foreground hover:bg-brand-red/10 hover:text-brand-red transition-colors"
                    aria-label="Delete draft"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Sent view ── */}
        {view === "sent" && !selectedSentId && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sent.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
                <Send className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No sent emails</p>
              </div>
            ) : (
              sent.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSentId(s.id)}
                  className="w-full text-left rounded-lg border border-border bg-white px-4 py-3 hover:border-brand-blue/30 hover:bg-brand-sky/5 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-brand-navy truncate">{s.subject}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{s.date.split(",")[0]}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">To: {s.to.join(", ")}</p>
                </button>
              ))
            )}
          </div>
        )}

        {/* Sent email detail */}
        {view === "sent" && selectedSentId && selectedSent && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => setSelectedSentId(null)}
                className="w-7 h-7 grid place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-brand-navy transition-colors shrink-0 mt-0.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-base font-bold text-brand-navy leading-snug">{selectedSent.subject}</h2>
                <p className="text-[11px] text-muted-foreground">{selectedSent.date}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-brand-canvas/50 px-4 py-3 space-y-1.5 text-[12px]">
              <div className="flex gap-2">
                <span className="text-muted-foreground w-8 shrink-0 font-medium">From</span>
                <span className="text-brand-navy font-semibold">{selectedSent.fromName}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-muted-foreground w-8 shrink-0 font-medium">To</span>
                <span className="text-brand-navy">{selectedSent.to.join(", ")}</span>
              </div>
              {selectedSent.cc.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground w-8 shrink-0 font-medium">CC</span>
                  <span className="text-brand-navy">{selectedSent.cc.join(", ")}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-brand-navy leading-relaxed whitespace-pre-wrap font-mono bg-white rounded-lg border border-border/60 px-4 py-4">
              {selectedSent.body}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── Clarifications Sheet ──────────────────────────────────────────────────────

type ClarifView = "list" | "add";

function ClarificationsSheet({ open, onClose, openInAdd }: { open: boolean; onClose: () => void; openInAdd?: boolean }) {
  const [view, setView]     = useState<ClarifView>("list");

  useEffect(() => {
    if (open && openInAdd) setView("add");
    if (!open) setView("list");
  }, [open, openInAdd]);
  const [items, setItems]   = useState(clarifications);
  const [title, setTitle]   = useState("");
  const [detail, setDetail] = useState("");
  const [dueDate, setDueDate]   = useState("");
  const [assignee, setAssignee] = useState("Clark Kent");

  function handleClose() { setView("list"); onClose(); }

  function handleSubmit() {
    if (!title.trim()) return;
    setItems(prev => [{
      id: `c${Date.now()}`,
      title,
      detail,
      status: "Pending" as const,
      dueDate: dueDate
        ? new Date(dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : "TBD",
      raisedBy: "Sarah Mitchell",
    }, ...prev]);
    setTitle(""); setDetail(""); setDueDate(""); setAssignee("Clark Kent");
    setView("list");
  }

  const inputCls = "w-full rounded-lg border border-border px-3 py-2.5 text-sm text-brand-navy placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30 bg-white";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">

        <SheetHeader className="px-6 py-4 pr-12 border-b border-border flex-row items-center gap-3 shrink-0">
          {view === "add" && (
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="Back to list"
              className="w-7 h-7 grid place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-brand-navy transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <SheetTitle className="text-brand-navy flex-1">
            {view === "list" ? "Clarifications" : "Add Clarification"}
          </SheetTitle>
          {view === "list" && (
            <button
              type="button"
              onClick={() => setView("add")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Clarification
            </button>
          )}
        </SheetHeader>

        {/* ── List view ── */}
        {view === "list" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No clarifications yet</p>
              </div>
            ) : (
              items.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg border px-4 py-4 ${c.status === "Pending" ? "border-brand-red/30 bg-brand-red/5" : "border-border bg-white"}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-semibold text-brand-navy leading-snug">{c.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${c.status === "Pending" ? "bg-brand-red/10 text-brand-red" : "bg-emerald-500/10 text-emerald-600"}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.detail}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">Raised by {c.raisedBy} · Due {c.dueDate}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Add form view ── */}
        {view === "add" && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-6 space-y-5">

              {/* Title */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Title <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="E.g. Clarify previous US travel history"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Describe in detail what needs to be clarified by the employee…"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={5}
                  className={`${inputCls} resize-none leading-relaxed`}
                />
              </div>

              {/* Two-column row — assignee + due date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Assign To
                  </label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Preview card */}
              {title && (
                <div className="rounded-lg border border-brand-red/20 bg-brand-red/5 px-4 py-3 space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Preview</p>
                  <p className="text-sm font-semibold text-brand-navy">{title}</p>
                  {detail && <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>}
                  <p className="text-[10px] text-muted-foreground">
                    Raised by Sarah Mitchell · Due {dueDate
                      ? new Date(dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      : "TBD"}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-brand-canvas/50 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-navy text-white text-sm font-semibold hover:bg-brand-navy/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                <Plus className="w-3.5 h-3.5" /> Submit Clarification
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-4 py-2.5 rounded-lg border border-border text-brand-navy text-sm font-semibold hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function CaseSummary() {
  const { caseId } = Route.useParams();
  const [activeTab, setActiveTab]               = useState<TabKey>("questionnaire");
  const [openSheet, setOpenSheet]               = useState<"details" | "milestones" | "logs" | "clarifications" | "alerts" | null>(null);
  const [clarifOpenInAdd, setClarifOpenInAdd]   = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);

  function openClarificationsAdd() {
    setClarifOpenInAdd(true);
    setOpenSheet("clarifications");
  }

  const prevMilestone = milestones.find((m) => m.status === "completed");
  const currMilestone = milestones.find((m) => m.status === "in-progress");

  function renderTabContent() {
    switch (activeTab) {
      case "questionnaire":   return <QuestionnairePanel onSendForClarification={openClarificationsAdd} />;
      case "documents":       return <DocumentsPanel onSendForClarification={openClarificationsAdd} />;
      case "visa-info":       return <VisaInfoPanel />;
      case "work-permit":     return <WorkPermitPanel />;
      case "salary":          return <SalaryPanel />;
      case "loa":             return <LOAPanel />;
      case "support-letter":  return <GenericPanel title="Support Letter" />;
      case "casekit":         return <GenericPanel title="Case Kit" />;
      case "resident-permit": return <GenericPanel title="Resident Permit" />;
      case "coc":             return <GenericPanel title="Certificate of Coverage (COC)" />;
      case "pwn":             return <GenericPanel title="Posted Worker Notification" />;
      default:                return null;
    }
  }

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader role="Case Manager" />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">

        {/* ── Summary header — full or mini ───────────────────────────────── */}
        {summaryCollapsed ? (
          <section className="bg-brand-sky/10 rounded-lg border border-border shadow-sm px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-full bg-brand-navy grid place-items-center shrink-0">
                  <UserIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold text-brand-navy">{CASE.name}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FlagIcon code={CASE.toCode} />
                  <span className="font-semibold text-brand-navy">{CASE.toCountry}</span>
                </span>
                <StatusBadge status={CASE.status} />
              </div>
              <div className="flex items-center gap-2">
                <ApproveRejectButtons />
                <button
                  type="button"
                  onClick={() => setSummaryCollapsed(false)}
                  aria-label="Expand summary"
                  className="w-8 h-8 grid place-items-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-brand-navy transition-colors"
                >
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-brand-sky/10 rounded-lg border border-border shadow-sm px-6 py-4">
            <div className="flex items-start justify-between gap-6">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-full bg-brand-navy grid place-items-center shrink-0">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-brand-navy">{CASE.name}</h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-semibold">Immigration</span>
                  <span className="text-[11px] font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded">{caseId}</span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 ml-10">
                  Travelling from
                  <FlagIcon code={CASE.fromCode} />
                  <span className="font-semibold text-brand-navy">{CASE.fromCountry}</span>
                  <span>to</span>
                  <FlagIcon code={CASE.toCode} />
                  <span className="font-semibold text-brand-navy">{CASE.toCountry}</span>
                </p>
                <div className="mt-3 ml-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-semibold text-brand-navy">{CASE.startDate}</span>
                    <span>→</span>
                    <span className="font-semibold text-brand-navy">{CASE.endDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-brand-navy">{CASE.hostEntity}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span>Visa type:</span>
                    <span className="font-semibold text-brand-navy">{CASE.visaType}</span>
                  </span>
                  <StatusBadge status={CASE.status} />
                </div>
              </div>

              {/* Right */}
              <div className="shrink-0 flex flex-col items-end gap-3">
                <div className="flex items-center gap-2">
                  <ApproveRejectButtons />
                  {/* Minimize button */}
                  <button
                    type="button"
                    onClick={() => setSummaryCollapsed(true)}
                    aria-label="Minimize summary"
                    className="w-8 h-8 grid place-items-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-brand-navy transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenSheet("details")}
                  className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
                >
                  View more details <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── 3-column body ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_300px] gap-6 items-start">

          {/* Left sidebar */}
          <aside className={`bg-brand-sky/10 rounded-lg border border-border flex flex-col transition-all duration-200 ${sidebarCollapsed ? "w-14" : "w-[200px]"}`}>
            {/* Collapse toggle */}
            <div className={`flex items-center border-b border-border/60 py-2 ${sidebarCollapsed ? "justify-center px-0" : "justify-end px-2"}`}>
              <button
                type="button"
                onClick={() => setSidebarCollapsed((v) => !v)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="w-8 h-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-brand-sky/30 hover:text-brand-navy transition-colors"
              >
                {sidebarCollapsed
                  ? <ChevronRight className="w-4 h-4" />
                  : <ChevronLeft className="w-4 h-4" />
                }
              </button>
            </div>

            <nav className="flex flex-col py-2">
              {sidebarTabs.map(({ key, label, Icon }) => {
                const active = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    title={sidebarCollapsed ? label : undefined}
                    className={`flex items-center gap-3 py-3 text-sm font-semibold text-left transition-colors mx-2 rounded-lg ${
                      sidebarCollapsed ? "px-2 justify-center" : "px-3"
                    } ${
                      active
                        ? "bg-brand-navy text-white"
                        : "text-brand-navy hover:bg-brand-sky/20"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-brand-blue"}`} />
                    {!sidebarCollapsed && <span className="leading-tight">{label}</span>}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-6 min-h-[560px]">
            {renderTabContent()}
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">

            {/* Alerts card */}
            {(() => {
              const unreadCount = ALERTS.filter(a => !a.read).length;
              const featured = ALERTS.find(a => !a.read) ?? ALERTS[0];
              return (
                <div className="bg-white rounded-lg border border-border shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-blue" />
                      Alerts
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-blue text-white text-[9px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setOpenSheet("alerts")}
                      className="text-[11px] font-semibold text-brand-blue hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenSheet("alerts")}
                    className={`w-full text-left rounded-lg border px-3 py-2.5 flex items-start gap-2 hover:border-brand-blue/40 transition-colors ${
                      !featured.read ? "border-brand-blue/30 bg-brand-sky/10" : "border-border bg-accent/20"
                    }`}
                  >
                    {!featured.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mt-1.5" />}
                    <div className={`flex-1 min-w-0 ${featured.read ? "ml-3.5" : ""}`}>
                      <p className="text-[12px] font-semibold text-brand-navy leading-snug">{featured.subject}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{featured.time}</p>
                    </div>
                  </button>
                </div>
              );
            })()}

            {/* Milestones card — in-progress only */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-brand-navy">Milestones</h2>
                <button
                  type="button"
                  onClick={() => setOpenSheet("milestones")}
                  className="text-[11px] font-semibold text-brand-blue hover:underline"
                >
                  View more
                </button>
              </div>
              {currMilestone && (
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <div className="w-7 h-7 rounded-full bg-brand-blue/10 border-2 border-brand-blue flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5 text-brand-blue" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-brand-navy leading-snug">{currMilestone.name}</p>
                    {currMilestone.actions.slice(0, 2).map((a) => (
                      <span key={a} className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <ArrowRight className="w-2.5 h-2.5 shrink-0" />{a}
                      </span>
                    ))}
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-blue">
                      <Clock className="w-3 h-3" /> In progress · {currMilestone.date}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons card */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setOpenSheet("logs")}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
                  Case Logs
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
              </button>
              <button
                type="button"
                onClick={() => setOpenSheet("clarifications")}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-blue group-hover:text-white transition-colors" />
                  Clarifications
                  {clarifications.filter((c) => c.status === "Pending").length > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-red text-white text-[9px] font-bold">
                      {clarifications.filter((c) => c.status === "Pending").length}
                    </span>
                  )}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
              </button>
            </div>

          </div>
        </div>

        <footer className="text-center text-xs text-muted-foreground py-2">
          Copyright © 2026 Immidart Technologies LLP
        </footer>
      </main>

      {/* ── Overlays ─────────────────────────────────────────────────────────── */}

      {/* Alerts — full email client overlay */}
      <AlertsSheet open={openSheet === "alerts"} onClose={() => setOpenSheet(null)} />

      {/* Full case details */}
      <Sheet open={openSheet === "details"} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 pr-12 border-b border-border">
            <SheetTitle className="text-brand-navy">Full Case Details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div>
              <SectionHeading>Personal</SectionHeading>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name"       value={CASE.name}           />
                <Field label="Date of Birth"   value={CASE.dob}            />
                <Field label="Nationality"     value={CASE.nationality}    />
                <Field label="Passport Number" value={CASE.passportNo}     />
                <Field label="Passport Expiry" value={CASE.passportExpiry} />
              </div>
            </div>
            <div>
              <SectionHeading>Assignment</SectionHeading>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Job Title"         value={CASE.jobTitle}         />
                <Field label="Department"        value={CASE.department}       />
                <Field label="Reporting Manager" value={CASE.reportingManager} />
                <Field label="Host Entity"       value={CASE.hostEntity}       />
                <Field label="Work Location"     value={CASE.workLocation}     />
                <Field label="Assignment Type"   value={CASE.assignmentType}   />
                <Field label="Global Grade"      value={CASE.globalGrade}      />
                <Field label="Deployment Model"  value={CASE.deploymentModel}  />
              </div>
            </div>
            <div>
              <SectionHeading>Case Management</SectionHeading>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Case ID"        value={caseId}             />
                <Field label="IWA Number"     value={CASE.iwaNo}         />
                <Field label="Visa Type"      value={CASE.visaType}      />
                <Field label="Start Date"     value={CASE.startDate}     />
                <Field label="End Date"       value={CASE.endDate}       />
                <Field label="Case Initiator" value={CASE.caseInitiator} />
                <Field label="Status"         value={CASE.status}        />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* All milestones */}
      <Sheet open={openSheet === "milestones"} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
          <SheetHeader className="p-6 pr-12 border-b border-border">
            <SheetTitle className="text-brand-navy">All Milestones</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-1">
              {milestones.map((m, idx) => (
                <div key={m.id} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      m.status === "completed"   ? "bg-emerald-500" :
                      m.status === "in-progress" ? "bg-brand-blue/10 border-2 border-brand-blue" :
                      "bg-border"
                    }`}>
                      {m.status === "completed"   && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {m.status === "in-progress" && <Clock className="w-4 h-4 text-brand-blue" />}
                      {m.status === "upcoming"    && <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />}
                    </div>
                    {idx < milestones.length - 1 && (
                      <div className={`w-0.5 flex-1 my-1 rounded-full min-h-[28px] ${m.status === "completed" ? "bg-emerald-200" : "bg-border"}`} />
                    )}
                  </div>
                  <div className={`pb-6 flex-1 min-w-0 ${idx === milestones.length - 1 ? "pb-0" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-snug ${m.status === "upcoming" ? "text-muted-foreground" : "text-brand-navy"}`}>
                        {m.name}
                      </p>
                      <span className={`text-[10px] shrink-0 font-medium ${m.status === "completed" ? "text-emerald-600" : m.status === "in-progress" ? "text-brand-blue" : "text-muted-foreground"}`}>
                        {m.date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.description}</p>
                    {m.actions.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1">
                        {m.actions.map((a) => (
                          <span key={a} className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3 shrink-0" />{a}
                          </span>
                        ))}
                      </div>
                    )}
                    {m.status === "completed" && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                    {m.status === "in-progress" && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-blue">
                        <Clock className="w-3 h-3" /> In progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Case logs */}
      <Sheet open={openSheet === "logs"} onOpenChange={(o) => !o && setOpenSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 pr-12 border-b border-border flex-row items-center">
            <SheetTitle className="text-brand-navy flex-1">Case Logs</SheetTitle>
            <button
              type="button"
              onClick={() => {
                const csv = [
                  ["Date", "Time", "Action", "User"],
                  ...caseLogs.map(l => [l.date, l.time, l.action, l.user]),
                ].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `case-logs-${caseId}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-brand-navy hover:bg-accent transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-1">
              {caseLogs.map((log, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-7 h-7 rounded-full bg-brand-sky/20 border border-brand-sky/40 flex items-center justify-center shrink-0">
                      <History className="w-3.5 h-3.5 text-brand-blue" />
                    </div>
                    {idx < caseLogs.length - 1 && (
                      <div className="w-0.5 flex-1 my-1 bg-border rounded-full min-h-[20px]" />
                    )}
                  </div>
                  <div className={`pb-5 flex-1 min-w-0 ${idx === caseLogs.length - 1 ? "pb-0" : ""}`}>
                    <p className="text-sm font-semibold text-brand-navy leading-snug">{log.action}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{log.date} at {log.time} · {log.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Clarifications */}
      <ClarificationsSheet
        open={openSheet === "clarifications"}
        onClose={() => { setOpenSheet(null); setClarifOpenInAdd(false); }}
        openInAdd={clarifOpenInAdd}
      />

      <AskImmibroButton />
    </div>
  );
}
