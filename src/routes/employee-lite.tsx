
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
      <PageHeader name="Clark Kent" role="Employee" />

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


