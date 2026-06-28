import { AppLoader } from "@/components/AppLoader";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { setAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  loader: async () => { await new Promise(r => setTimeout(r, 3000)); },
  pendingComponent: () => <AppLoader />,
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!role) return;

    if (email !== "sudharsan@immidart.com" || password !== "$Immidart@123$") {
      setError("Invalid email or password.");
      return;
    }

    setAuth(role);
    if (role === "Case Manager") {
      navigate({ to: "/" });
    } else if (role === "Supervisor") {
      navigate({ to: "/supervisor2" });
    } else if (role === "Supervisor (All Caught Up)") {
      navigate({ to: "/supervisor3" });
    } else if (role === "Supervisor (All Caught Up + KPI)") {
      navigate({ to: "/supervisor4" });
    } else if (role === "Employee") {
      navigate({ to: "/employee" });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-canvas px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg"
      >
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold">
            <span className="text-brand-blue">Immi</span>
            <span className="text-brand-orange">dart</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Case Manager">Case Manager</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Supervisor (All Caught Up)">Supervisor — All Caught Up</SelectItem>
                <SelectItem value="Supervisor (All Caught Up + KPI)">Supervisor — All Caught Up + KPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90" disabled={!role || !email || !password}>
            Sign in
          </Button>
        </div>
      </form>
    </main>
  );
}
