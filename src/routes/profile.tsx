import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Users,
  Building2,
  UserRound,
  MapPin,
  GraduationCap,
  LayoutGrid,
  BookOpen,
  Plane,
  Briefcase,
  Pencil,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Immidart" },
      { name: "description", content: "View and manage your organizational and personal profile information." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: () => (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  ),
});

type TabKey =
  | "organization"
  | "personal"
  | "address"
  | "qualification"
  | "passport"
  | "immigration"
  | "experience";

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "organization", label: "ORGANIZATION", icon: Building2 },
  { key: "personal", label: "PERSONAL", icon: UserRound },
  { key: "address", label: "ADDRESS", icon: Home },
  { key: "qualification", label: "QUALIFICATION", icon: GraduationCap },
  { key: "passport", label: "PASSPORT", icon: BookOpen },
  { key: "immigration", label: "IMMIGRATION", icon: Plane },
  { key: "experience", label: "EXPERIENCE", icon: Briefcase },
];

const organizationFields: { label: string; value: string }[] = [
  { label: "GLOBAL GROUP ID (GGID)", value: "77788" },
  { label: "OFFICIAL EMAIL ID", value: "BENEFICIARY.DEMO1@CAPGEMINI2DEMO.COM" },
  { label: "OPERATING UNIT (OU)", value: "GBO5" },
  { label: "PERSONNEL NUMBER (PERNR)", value: "998" },
  { label: "EMPLOYMENT STATUS", value: "1" },
  { label: "EMPLOYEE ID", value: "77808" },
  { label: "GLOBAL GRADE", value: "F2" },
  { label: "HIRE COUNTRY", value: "INDIA" },
  { label: "LOCAL GRADE", value: "F2" },
  { label: "CURRENT DESIGNATION", value: "—" },
  { label: "LEGAL ENTITY NAME", value: "—" },
  { label: "PRODUCTION UNIT (PU)", value: "—" },
  { label: "BUSINESS AREA", value: "BSV" },
  { label: "STRATEGIC BUSINESS UNIT (SBU)", value: "DDD" },
  { label: "BUSINESS UNIT (BU)", value: "BSV INDIGO" },
];

function ProfilePage() {
  const [active, setActive] = useState<TabKey>("organization");

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Supervisor" />

      {/* Section nav */}
      <nav className="bg-brand-blue text-white">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center">
          <button className="px-3 py-4 hover:bg-white/10 transition-colors" aria-label="Previous">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center gap-10 px-4">
            <button className="py-4 text-sm font-semibold tracking-wide border-b-2 border-white">
              MY PROFILE
            </button>
            <button className="py-4 text-sm font-semibold tracking-wide opacity-90 hover:opacity-100">
              PORTAL
            </button>
            <button className="py-4 text-sm font-semibold tracking-wide opacity-90 hover:opacity-100">
              KNOWLEDGE BASE
            </button>
          </div>
          <button className="px-3 py-4 hover:bg-white/10 transition-colors" aria-label="Next">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Sub nav */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1400px] mx-auto px-8 py-3 flex items-center gap-8 text-sm">
          <button className="font-semibold text-brand-navy">My Profile</button>
          <button className="text-muted-foreground hover:text-brand-navy">Documents</button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Left profile card */}
          <aside className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded border border-brand-blue text-brand-blue text-xs font-medium hover:bg-brand-blue/10 transition-colors">
                <Users className="w-4 h-4" />
                Dependents
              </button>
            </div>

            <div className="flex flex-col items-center mt-2">
              <div className="w-28 h-28 rounded-full bg-muted grid place-items-center">
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
              <p className="mt-4 text-base font-semibold text-muted-foreground tracking-wide">
                IMMIDART ONE
              </p>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="grid grid-cols-3 gap-3">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    className={`aspect-square rounded flex flex-col items-center justify-center gap-2 transition-colors ${
                      isActive
                        ? "bg-brand-navy text-white"
                        : "bg-brand-blue text-white hover:bg-brand-blue/90"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                    <span className="text-[10px] font-bold tracking-wide text-center leading-tight px-1">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right info panel */}
          <section className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 text-brand-navy">
              <h2 className="text-base font-bold tracking-wide">
                ORGANIZATIONAL INFORMATION [IMMIDART ONE]
              </h2>
              <button aria-label="Edit" className="hover:text-brand-blue">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 border-t border-border pt-8">
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
                {organizationFields.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-semibold text-muted-foreground tracking-wide">
                      {f.label}
                    </dt>
                    <dd className="mt-2 text-sm text-foreground break-words">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Copyright © 2026 Immidart Technologies LLP
        </footer>
      </main>
    </div>
  );
}
