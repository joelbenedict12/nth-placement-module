import { useMemo, type ComponentType, type SVGProps } from "react";
import { GraduationCap, Building2, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RoleKey = "student" | "university" | "recruiter";

type RoleConfig = {
  key: RoleKey;
  label: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  highlight: string;
  fields: Array<{ id: string; label: string; type?: string; placeholder?: string }>;
};

const roles: RoleConfig[] = [
  {
    key: "student",
    label: "Students",
    description: "Access personalized dashboards, AI interview prep, and application tracking.",
    icon: GraduationCap,
    highlight: "Stay ahead with AI-powered recommendations tailored to your career goals.",
    fields: [
      { id: "studentId", label: "Student ID", placeholder: "e.g. STU-2048" },
      { id: "email", label: "Email", type: "email", placeholder: "name@university.edu" },
      { id: "password", label: "Password", type: "password", placeholder: "Enter your password" },
    ],
  },
  {
    key: "university",
    label: "Universities",
    description: "Manage placement drives, recruiter onboarding, and intelligent analytics.",
    icon: Building2,
    highlight: "Coordinate cohorts and recruiters from a single unified control center.",
    fields: [
      { id: "institutionCode", label: "Institution Code", placeholder: "e.g. NTH-U-487" },
      { id: "email", label: "Official Email", type: "email", placeholder: "placements@campus.edu" },
      { id: "password", label: "Password", type: "password", placeholder: "Enter your password" },
    ],
  },
  {
    key: "recruiter",
    label: "Recruiters",
    description: "Discover curated talent, automate scheduling, and track offers effortlessly.",
    icon: Briefcase,
    highlight: "Reach verified students with AI-matched shortlists in minutes.",
    fields: [
      { id: "companyCode", label: "Company Code", placeholder: "e.g. RECR-512" },
      { id: "email", label: "Work Email", type: "email", placeholder: "name@company.com" },
      { id: "password", label: "Password", type: "password", placeholder: "Enter your password" },
    ],
  },
];

const RoleLoginForm = ({ role }: { role: RoleConfig }) => {
  const Icon = role.icon;

  const groupedFields = useMemo(() => {
    const [primary, ...rest] = role.fields;
    return { primary, secondary: rest };
  }, [role.fields]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
      <div className="space-y-6 rounded-3xl border border-white/20 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple text-white">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{role.label} Login</h3>
            <p className="text-sm text-white/70">{role.description}</p>
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            // TODO: integrate with backend auth flow
          }}
        >
          <div className="space-y-4">
            {[groupedFields.primary, ...groupedFields.secondary].map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`${role.key}-${field.id}`} className="text-white">
                  {field.label}
                </Label>
                <Input
                  id={`${role.key}-${field.id}`}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  required
                  className="border-white/15 bg-black/60 text-white placeholder:text-white/40 focus-visible:ring-accent-cyan"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/25 bg-black/70 text-accent-cyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-cyan"
              />
              Keep me signed in
            </label>
            <a href="#" className="text-sm font-semibold text-accent-cyan hover:text-accent-cyan/80">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-purple py-6 text-lg font-semibold text-white shadow-lg shadow-accent-glow/20 transition-all hover:shadow-xl hover:shadow-accent-glow/30"
          >
            Sign in
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <p className="text-center text-sm text-white/60">
            New to Nth Place?{" "}
            <a href="#" className="font-semibold text-accent-cyan hover:text-accent-cyan/80">
              Request onboarding access
            </a>
          </p>
        </form>
      </div>

      <aside className="space-y-6 rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
          <ShieldCheck className="h-4 w-4 text-accent-cyan" />
          Secure Access
        </div>
        <h4 className="text-2xl font-semibold text-white">Why {role.label} love Nth Place</h4>
        <p className="text-sm text-white/70 leading-relaxed">{role.highlight}</p>
        <ul className="space-y-3 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-cyan" />
            Enterprise-grade security with granular role permissions.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-purple" />
            Real-time analytics dashboards to monitor progress instantly.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent-blue" />
            Integrated messaging, scheduling, and follow-ups out of the box.
          </li>
        </ul>
      </aside>
    </div>
  );
};

const Login = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20 lg:px-12">
        <header className="mb-12 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70">
            Unified Access
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Sign in to <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue bg-clip-text text-transparent">Nth Place</span>
          </h1>
          <p className="text-lg text-white/70">
            Choose your portal to continue. Each workspace is tailored with AI insights for your role.
          </p>
        </header>

        <Tabs
          defaultValue={roles[0]?.key}
          className="space-y-8"
        >
          <TabsList className="flex flex-wrap justify-center gap-3 rounded-2xl border border-white/15 bg-black/60 p-2 text-white/60 backdrop-blur">
            {roles.map((role) => (
              <TabsTrigger
                key={role.key}
                value={role.key}
                className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:hover:text-white"
              >
                <role.icon className="h-4 w-4" />
                {role.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {roles.map((role) => (
            <TabsContent key={role.key} value={role.key} className="space-y-8">
              <RoleLoginForm role={role} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Login;

