import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, User, CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/assignment-request")({
  head: () => ({
    meta: [
      { title: "Immidart — New Assignment Request" },
      { name: "description", content: "Initiate a new International Work Assignment request." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: AssignmentRequest,
});

type TabKey = "questionnaire" | "service";

const TABS: { key: TabKey; label: string }[] = [
  { key: "questionnaire", label: "Initiation Questionnaire" },
  { key: "service", label: "Select Service Required" },
];

function AssignmentRequest() {
  const [active, setActive] = useState<TabKey>("questionnaire");

  const goNext = () => {
    const idx = TABS.findIndex((t) => t.key === active);
    if (idx < TABS.length - 1) setActive(TABS[idx + 1].key);
  };

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader role="Case Manager" />

      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Stepper tabs */}
        <h2 className="text-lg font-semibold text-brand-navy mb-4">
          Provide the required details to create a new assignment request.
        </h2>
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2">
            {TABS.map((t, idx) => {
              const isActive = active === t.key;
              const activeIdx = TABS.findIndex((x) => x.key === active);
              const isComplete = idx < activeIdx;
              return (
                <div key={t.key} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => setActive(t.key)}
                    className="flex items-center gap-3 group"
                  >
                    <span
                      className={
                        "w-9 h-9 rounded-full grid place-items-center text-sm font-bold border-2 transition-colors " +
                        (isActive
                          ? "bg-brand-navy text-white border-brand-navy"
                          : isComplete
                          ? "bg-brand-navy/80 text-white border-brand-navy/80"
                          : "bg-white text-brand-navy/60 border-brand-navy/30")
                      }
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={
                        "text-sm font-semibold uppercase tracking-wide transition-colors " +
                        (isActive
                          ? "text-brand-navy"
                          : isComplete
                          ? "text-brand-navy/80"
                          : "text-brand-navy/50")
                      }
                    >
                      {t.label}
                    </span>
                  </button>
                  {idx < TABS.length - 1 && (
                    <div
                      className={
                        "flex-1 h-0.5 mx-4 " +
                        (idx < activeIdx ? "bg-brand-navy" : "bg-brand-navy/20")
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        
        {active === "questionnaire" && <InitiationQuestionnaire onNext={goNext} />}
        {active === "service" && <SelectService />}

      </main>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-border mb-6">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Link to="/employee-lite" className="text-brand-blue">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h2 className="text-brand-blue font-semibold uppercase tracking-wide text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value, required }: { label: string; value?: string; required?: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {label} {required && <span className="text-brand-red">*</span>}
      </div>
      {value ? (
        <div className="text-sm text-foreground">{value}</div>
      ) : (
        <input
          type="text"
          className="h-10 w-full px-3 rounded border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
      )}
    </div>
  );
}

function ProceedBar({ onNext, label = "Proceed" }: { onNext: () => void; label?: string }) {
  return (
    <div className="flex justify-end gap-3 mt-2">
      <Link
        to="/employee-lite"
        className="px-5 h-10 inline-flex items-center rounded text-sm font-semibold text-white bg-brand-orange hover:opacity-90"
      >
        Cancel
      </Link>
      <button
        type="button"
        onClick={onNext}
        className="px-5 h-10 inline-flex items-center rounded text-sm font-semibold text-white bg-green-600 hover:bg-green-700"
      >
        {label}
      </button>
    </div>
  );
}

function EmployeeInformation({ onNext }: { onNext: () => void }) {
  return (
    <>
      <SectionCard title="Employee Information">
        <div className="border border-border rounded p-6">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_1fr] gap-6 items-start">
            <div className="w-16 h-16 rounded-full border-2 border-border grid place-items-center">
              <User className="w-7 h-7 text-muted-foreground" />
            </div>
            <Field label="Employee Name" value="Immidart One" />
            <Field label="GGID" value="77788" />
            <Field label="Email ID" value="beneficiary.demo1@capgemini2demo.com" />
            <Field label="Home Country" value="India" />
          </div>
          <div className="border-t border-border mt-6 pt-6 grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_1fr] gap-6">
            <div />
            <Field label="Global Grade" value="F2" />
            <Field label="Global Hire Date" value="01/Jan/1900" />
            <Field label="Local Grade" value="F2" />
            <div />
          </div>
        </div>
      </SectionCard>
      <ProceedBar onNext={onNext} />
    </>
  );
}

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Singapore",
  "United Arab Emirates",
  "Japan",
];

const POLICIES = ["Temporary Assignment", "Permanent Transfer", "Local Hire"];

function LabeledSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {label} {required && <span className="text-brand-red">*</span>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full px-3 rounded border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function LabeledDate({
  label,
  value,
  onChange,
  min,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
  required?: boolean;
}) {
  const date = value ? new Date(value) : undefined;
  const minDate = min ? new Date(min) : undefined;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
        {label} {required && <span className="text-brand-red">*</span>}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "h-10 w-full px-3 rounded border border-border bg-white text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-blue/30",
              !date && "text-muted-foreground",
            )}
          >
            {date ? format(date, "dd MMM yyyy") : "Select date"}
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
            disabled={minDate ? (d) => d < minDate : undefined}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


function InitiationQuestionnaire({ onNext }: { onNext: () => void }) {
  const [residing, setResiding] = useState("");
  const [destination, setDestination] = useState("");
  const [policy, setPolicy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const endBeforeStart =
    startDate && endDate && endDate < startDate ? true : false;

  return (
    <>
      <SectionCard title="Initiation Questionnaire">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <LabeledSelect
            label="Residing Country"
            value={residing}
            onChange={setResiding}
            options={COUNTRIES}
            required
          />
          <LabeledSelect
            label="Destination Country"
            value={destination}
            onChange={setDestination}
            options={COUNTRIES}
            required
          />
          <LabeledSelect
            label="Assignment Policy"
            value={policy}
            onChange={setPolicy}
            options={POLICIES}
            required
          />
          <LabeledDate
            label="Tentative Start Date"
            value={startDate}
            onChange={(v) => {
              setStartDate(v);
              if (endDate && v && endDate < v) setEndDate("");
            }}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div>
            <LabeledDate
              label="Tentative End Date"
              value={endDate}
              onChange={setEndDate}
              min={startDate || undefined}
              required
            />
            {endBeforeStart && (
              <p className="text-xs text-brand-red mt-1">
                End date cannot be before start date.
              </p>
            )}
          </div>
        </div>
      </SectionCard>
      <ProceedBar onNext={onNext} />
    </>
  );
}


function SelectService() {
  return (
    <>
      <SectionCard title="Select Service Required">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Please select the service you require <span className="text-brand-red">*</span>
          </div>
          <select className="h-10 w-full md:w-1/3 px-3 rounded border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30">
            <option>Select</option>
            <option>Work Permit</option>
            <option>Business Visa</option>
            <option>Assignment Travel</option>
          </select>
        </div>
      </SectionCard>
      <div className="flex justify-end gap-3 mt-2">
        <Link
          to="/employee-lite"
          className="px-5 h-10 inline-flex items-center rounded text-sm font-semibold text-white bg-brand-orange hover:opacity-90"
        >
          Cancel
        </Link>
        <button
          type="button"
          className="px-5 h-10 inline-flex items-center rounded text-sm font-semibold text-white bg-green-600 hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </>
  );
}
