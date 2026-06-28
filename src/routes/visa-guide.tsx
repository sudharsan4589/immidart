import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Search, Check, ChevronsUpDown } from "lucide-react";

export const Route = createFileRoute("/visa-guide")({
  head: () => ({
    meta: [
      { title: "Immidart — Visa Guide" },
      { name: "description", content: "Look up visa information by origin, destination, and visa type." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: VisaGuide,
});

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "India", "Singapore", "Netherlands", "Ireland", "Japan",
  "United Arab Emirates", "Switzerland", "Sweden", "Spain",
];
const visaTypes = [
  "Work", "Business", "Student", "Tourist", "Dependent",
  "Permanent Residence", "Intra-Company Transfer", "Short-Term Assignment",
];

function VisaGuide() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [visa, setVisa] = useState("");

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader role="Case Manager" />

      <main className="max-w-3xl mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-10">
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Visa Guide</h2>
          <p className="text-muted-foreground mb-6">Know more about your assignment.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SearchableSelect label="Travelling from" placeholder="Country of origin" emptyText="No country found." value={from} onChange={setFrom} options={countries} />
            <SearchableSelect label="To" placeholder="Destination country" emptyText="No country found." value={to} onChange={setTo} options={countries} />
            <div className="flex items-end gap-2">
              <div className="flex-1 min-w-0">
                <SearchableSelect label="Visa Type" placeholder="e.g. Work, Business" emptyText="No visa type found." value={visa} onChange={setVisa} options={visaTypes} />
              </div>
              <button
                type="button"
                aria-label="Search"
                title="Search"
                className="bg-brand-navy text-white w-11 h-11 rounded-lg hover:bg-brand-navy/90 transition-colors inline-flex items-center justify-center shadow-sm shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SearchableSelect({
  label, placeholder, emptyText, value, onChange, options,
}: {
  label: string;
  placeholder: string;
  emptyText: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className="h-11 w-full px-3 rounded-lg border border-border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 inline-flex items-center justify-between gap-2"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
            <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={(v) => {
                      onChange(v === value ? "" : v);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === opt ? "opacity-100" : "opacity-0")} />
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
