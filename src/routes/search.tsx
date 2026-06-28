import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { Search } from "lucide-react";
type SearchParams = { q: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Results — Immidart" },
      { name: "description", content: "Search results for cases, visa guide and information portal." },
    ],
  }),
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: SearchPage,
});

const searchResults = [
  { employeeName: "Cristiana Lima Bonaldo", requestNumber: "WI231445780", fromCountry: "India", toCountry: "Portugal", startDate: "20/May/2026", endDate: "20/Nov/2026" },
  { employeeName: "Clark Kent", requestNumber: "IWA1234567890", fromCountry: "India", toCountry: "United States", startDate: "01/Jun/2026", endDate: "01/Jun/2027" },
  { employeeName: "Diana Prince", requestNumber: "WP9876543210", fromCountry: "India", toCountry: "Australia", startDate: "15/Jun/2026", endDate: "15/Dec/2026" },
  { employeeName: "Bruce Wayne", requestNumber: "ATR1234567890", fromCountry: "India", toCountry: "United Kingdom", startDate: "10/Jul/2026", endDate: "10/Aug/2026" },
  { employeeName: "Peter Parker", requestNumber: "IWA1234567891", fromCountry: "India", toCountry: "Canada", startDate: "05/Aug/2026", endDate: "05/Aug/2027" },
  { employeeName: "Natasha Romanoff", requestNumber: "WI231445781", fromCountry: "India", toCountry: "Germany", startDate: "22/May/2026", endDate: "22/Nov/2026" },
];

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [input, setInput] = useState(q);

  const filtered = q.trim()
    ? searchResults.filter((r) => {
        const ql = q.toLowerCase();
        return (
          r.employeeName.toLowerCase().includes(ql) ||
          r.requestNumber.toLowerCase().includes(ql) ||
          r.fromCountry.toLowerCase().includes(ql) ||
          r.toCountry.toLowerCase().includes(ql)
        );
      })
    : searchResults;

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader name="Clark Kent" role="Case Manager" />

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-navy">Search Results</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {q.trim() ? <>Showing results for "<span className="font-semibold">{q}</span>"</> : "Showing all cases"}
            {" "}· {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <section className="bg-white rounded-lg border border-border">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-semibold text-brand-navy uppercase tracking-wider">Cases</span>
          </div>
          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">No results found</div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((r) => (
                <li key={r.requestNumber}>
                  <Link
                    to="/case/$caseId"
                    params={{ caseId: r.requestNumber }}
                    className="block px-5 py-4 hover:bg-brand-canvas transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-brand-navy">{r.employeeName}</p>
                      <span className="text-xs font-mono text-brand-blue shrink-0">{r.requestNumber}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.fromCountry} → {r.toCountry}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.startDate} – {r.endDate}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
