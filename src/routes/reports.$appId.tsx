import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Download, Eye, Trash2, FileText } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { PageHeader } from "@/components/PageHeader";
import { reportApplications, type SavedReport } from "@/data/reportApplications";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/reports/$appId")({
  head: ({ params }) => {
    const application = reportApplications.find((a) => a.id === params.appId);
    return {
      meta: [
        { title: `Immidart — ${application?.label ?? "Reports"}` },
        { name: "description", content: "Saved reports for this application." },
      ],
    };
  },
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: () => (
    <RequireAuth>
      <ApplicationReports />
    </RequireAuth>
  ),
});

function ApplicationReports() {
  const { appId } = Route.useParams();
  const application = reportApplications.find((a) => a.id === appId);

  const [reports, setReports] = useState<SavedReport[]>(application?.reports ?? []);
  const [open, setOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [format, setFormat] = useState<"PDF" | "XLSX" | "CSV">("PDF");

  if (!application) {
    return (
      <div className="min-h-screen bg-brand-canvas grid place-items-center">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Application not found.</p>
          <Link to="/reports" className="text-brand-blue underline text-sm">
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const Icon = application.Icon;

  const handleAdd = () => {
    if (!reportName.trim()) return;
    const newReport: SavedReport = {
      id: `${appId}-${Date.now()}`,
      name: reportName.trim(),
      generatedOn: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      generatedBy: "Clark Kent",
      format,
    };
    setReports((r) => [newReport, ...r]);
    setReportName("");
    setFormat("PDF");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-canvas">
      <PageHeader role="Case Manager" />

      <main className="max-w-[1400px] mx-auto px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Saved Reports</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {reports.length} {reports.length === 1 ? "report" : "reports"} generated for {application.label}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-navy hover:bg-brand-navy/90 gap-2">
                <Plus className="w-4 h-4" />
                Add New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-brand-navy">Report name</Label>
                  <input
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder={`e.g. ${application.label} Summary — Q2 2026`}
                    className="w-full h-9 px-3 rounded border border-border bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-brand-navy">Format</Label>
                  <Select value={format} onValueChange={(v) => setFormat(v as "PDF" | "XLSX" | "CSV")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={handleAdd}>
                  Generate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No reports saved yet for {application.label}. Click "Add New Report" to generate one.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-table-head/60 text-brand-navy">
                  <th className="text-left font-semibold px-4 py-3">Report name</th>
                  <th className="text-left font-semibold px-4 py-3">Generated on</th>
                  <th className="text-left font-semibold px-4 py-3">Generated by</th>
                  <th className="text-left font-semibold px-4 py-3">Format</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-4 py-3.5 text-foreground">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-blue" />
                        {r.name}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-foreground">{r.generatedOn}</td>
                    <td className="px-4 py-3.5 text-foreground">{r.generatedBy}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-navy/5 text-brand-navy">
                        {r.format}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button className="text-muted-foreground hover:text-brand-blue transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-brand-blue transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setReports((rs) => rs.filter((x) => x.id !== r.id))}
                          className="text-muted-foreground hover:text-brand-red transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
