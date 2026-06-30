
import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

import { RequireAuth } from "@/components/RequireAuth";
import { CreateRequestButton } from "@/components/CreateRequestButton";


import employeeLiteBg from "@/assets/employee-lite-bg.jpg";

import {
  LifeBuoy,
  BookOpen,
  Sparkles,
  FilePlus2,
  FileCheck2,
  PlaneTakeoff,
  Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/employee-lite")({
  head: () => ({
    meta: [
      { title: "Immidart — Employee (Lite)" },
      { name: "description", content: "Simplified employee home with quick actions and information portal search." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: () => (
    <RequireAuth>
      <EmployeeLite />
    </RequireAuth>
  ),
});

function EmployeeLite() {



  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Employee" hideCreateRequest />

      <div className="relative flex-1 min-h-[calc(100vh-73px)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: `url(${employeeLiteBg})` }}
        />
        <main className="relative max-w-[1400px] mx-auto px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-border p-10 flex flex-col items-center gap-10 px-[72px] max-w-4xl mx-auto">
          <p className="max-w-3xl text-center text-brand-navy text-base leading-relaxed font-medium">
            WorkAbroad is a single technology gateway for Capgemini employees enabling cross border mobility through business visa and travel, international work assignments with work permits and assignment travel services.
          </p>
          <CreateRequestButton />

          <p className="-mt-6 text-sm text-muted-foreground text-center">
            Verify your profile for up to date information before proceeding.
          </p>

          {/* Assignment process flow */}
          <div className="w-full">
            <div className="flex items-start justify-between relative">
              {/* connector line */}
              <div className="absolute top-5 left-[calc(12.5%+12px)] right-[calc(12.5%+12px)] h-0.5 bg-brand-blue/20 z-0" />
              {[
                { step: 1, Icon: FilePlus2,    label: "Create Assignment",                          sub: "HR initiates the request" },
                { step: 2, Icon: FileCheck2,   label: "Mobility creates visa request & processes",  sub: "Visa & work permit filing" },
                { step: 3, Icon: PlaneTakeoff, label: "Travel formalities managed",                 sub: "Flights, accommodation & more" },
                { step: 4, Icon: Briefcase,    label: "On Assignment",                              sub: "Employee begins work abroad" },
              ].map(({ step, Icon, label, sub }) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2 w-1/4 px-2">
                  <div className="w-10 h-10 rounded-full bg-brand-blue/10 border-2 border-brand-blue/30 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-brand-blue" />
                  </div>
                  <span className="text-[11px] font-bold text-brand-navy text-center leading-snug">{label}</span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl">
            {[
              { label: "Ask Immibro", Icon: Sparkles, ai: true, to: null },
              { label: "Visa Guide", Icon: BookOpen, ai: false, to: "/visa-guide" as const },
              { label: "Knowledge Base", Icon: BookOpen, ai: false, to: null },
              { label: "Service Now", Icon: LifeBuoy, ai: false, to: null },
            ].map(({ label, Icon, ai, to }) => {
              const className = ai
                ? "h-16 rounded-lg text-white font-semibold text-sm bg-gradient-to-r from-brand-blue to-brand-orange hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 px-3 shadow-sm"
                : "h-16 rounded-lg border-2 border-brand-blue text-brand-blue font-semibold text-sm bg-white hover:bg-brand-blue hover:text-white transition-colors inline-flex items-center justify-center gap-2 px-3";
              return to ? (
                <Link key={label} to={to} className={className}>
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ) : (
                <button key={label} type="button" className={className}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>

        </div>
        </main>
      </div>

    </div>
  );
}


