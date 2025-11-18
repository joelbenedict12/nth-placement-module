import {
  BarChart3,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  Linkedin,
  MessageSquare,
  UserCircle2,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { studentAPI, jobAPI, JobMatch, Application } from "@/services/api";

const summaryCards = [
  {
    icon: FileText,
    title: "Resume Builder",
    value: "85% complete",
    action: "Open builder",
  },
  {
    icon: UserCircle2,
    title: "Profile Strength",
    value: "Needs update",
    action: "Edit details",
  },
  {
    icon: Linkedin,
    title: "LinkedIn Sync",
    value: "Active · Last synced 5h ago",
    action: "Sync now",
  },
  {
    icon: CheckCircle2,
    title: "Eligibility Score",
    value: "92% match to preferred tracks",
    action: "View criteria",
  },
];

const recommendedJobs = [
  {
    id: '1',
    title: "AI Product Intern",
    company: "NeuraTech Labs",
    location: "Bengaluru · Hybrid",
    match: "94% match",
    posted: "2 days ago",
    skills: ["Python", "TensorFlow", "Product Strategy"],
    requirements: ["Python", "TensorFlow", "Product Strategy"],
    matchScore: 94,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: "Data Analyst - Campus Program",
    company: "Orbit Analytics",
    location: "Remote",
    match: "89% match",
    posted: "1 day ago",
    skills: ["SQL", "Power BI", "Statistics"],
    requirements: ["SQL", "Power BI", "Statistics"],
    matchScore: 89,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: "Full Stack Developer Trainee",
    company: "SkyForge Systems",
    location: "Hyderabad · Onsite",
    match: "86% match",
    posted: "4 days ago",
    skills: ["React", "Node.js", "TypeScript"],
    requirements: ["React", "Node.js", "TypeScript"],
    matchScore: 86,
    createdAt: new Date().toISOString()
  },
];

const openJobs = [
  {
    title: "Machine Learning Engineer (Graduate)",
    company: "Aurora AI",
    location: "Remote",
    eligibility: "Eligible",
    deadline: "Closes in 5 days",
  },
  {
    title: "Business Analyst",
    company: "QuantaCorp",
    location: "Mumbai",
    eligibility: "Eligible",
    deadline: "Closes in 8 days",
  },
  {
    title: "Cloud DevOps Associate",
    company: "Nimbus Networks",
    location: "Chennai",
    eligibility: "In Review",
    deadline: "Closes in 3 days",
  },
  {
    title: "Cybersecurity Analyst",
    company: "Sentinel Secure",
    location: "Remote",
    eligibility: "Skill gap: Network Security",
    deadline: "Closes in 11 days",
  },
];

const applications = [
  {
    role: "AI Research Intern",
    company: "Cortex Innovations",
    status: "Interview scheduled",
    nextStep: "Nov 18 · 10:30 AM",
  },
  {
    role: "Data Science Fellow",
    company: "LogicLeap",
    status: "Assessment completed",
    nextStep: "Awaiting feedback",
  },
  {
    role: "Product Analyst",
    company: "Visionary Labs",
    status: "Application sent",
    nextStep: "Nov 1 · Pending review",
  },
];

const supportResources = [
  {
    title: "AI Interview Coach",
    description: "Practice interviews with tailored feedback based on your profile.",
    action: "Launch coach",
    icon: MessageSquare,
  },
  {
    title: "Placement Playbook",
    description: "Step-by-step guidance to prepare for every stage of the process.",
    action: "Download PDF",
    icon: Layers,
  },
  {
    title: "Skill Workshops",
    description: "Upcoming sessions to close gaps highlighted in eligibility checks.",
    action: "View schedule",
    icon: GraduationCap,
  },
];

const navItems = [
  { label: "Overview", icon: BarChart3, to: "/student" },
  { label: "Resume Builder", icon: FileText, to: "/student/resume" },
  { label: "Profile & Portfolio", icon: UserCircle2, to: "/student/profile" },
  { label: "Job Matches", icon: Briefcase, to: "/student/matches" },
  { label: "Applications", icon: ClipboardList, to: "/student/applications" },
  { label: "Support & Mentors", icon: MessageSquare, to: "/student/support" },
];

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: studentAPI.getDashboard,
    retry: 1,
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Fetch job matches
  const { data: jobMatches, isLoading: jobsLoading } = useQuery({
    queryKey: ['job-matches'],
    queryFn: jobAPI.getJobMatches,
    retry: 1,
    enabled: !!user, // Only fetch if user is authenticated
  });

  // Fetch applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: jobAPI.getApplications,
    retry: 1,
    enabled: !!user, // Only fetch if user is authenticated
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Use real data from API
  const currentDashboardData = dashboardData;
  const currentJobMatches = jobMatches;
  const currentApplications = applications;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Student dashboard</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-100">{user?.fullName || 'Student'}</h2>
              <p className="text-sm text-slate-400">
                {user?.course || 'Course'} · {user?.university || 'University'} · Batch {user?.graduationYear || '2025'}
              </p>
            </div>
            <Button className="mt-6 w-full justify-start gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700">
              <CalendarDays className="h-4 w-4" />
              Placement calendar
            </Button>
            <nav className="mt-8 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    location.pathname === item.to
                      ? "bg-slate-800 text-slate-100"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="mt-auto w-full justify-start gap-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </aside>

          <main className="space-y-8">
            <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-slate-100">Overview</h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Track your readiness, explore matched openings, and prepare for upcoming interviews.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white">
                    Export summary
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-lg border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Share with mentor
                  </Button>
                </div>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Resume Builder</p>
                    <p className="text-sm font-medium text-slate-100">
                      {currentDashboardData?.resumeCount || 0} {currentDashboardData?.resumeCount === 1 ? 'resume' : 'resumes'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                  onClick={() => navigate('/student/resume')}
                >
                  Open builder
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-100">
                    <UserCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Profile Strength</p>
                    <p className="text-sm font-medium text-slate-100">
                      {currentDashboardData?.profile?.profileStrength || 0}%
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                >
                  Edit details
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-100">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job Matches</p>
                    <p className="text-sm font-medium text-slate-100">
                      {currentDashboardData?.jobMatchesCount || 0} matches
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                  onClick={() => navigate('/student/matches')}
                >
                  View matches
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-100">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Applications</p>
                    <p className="text-sm font-medium text-slate-100">
                      {currentDashboardData?.applicationsCount || 0} submitted
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                  onClick={() => navigate('/student/applications')}
                >
                  View status
                </Button>
              </div>
            </section>

            <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Matched openings</h2>
                  <p className="text-sm text-slate-400">
                    Based on your skills, role preferences, and placement policy eligibility.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white">
                    View all jobs
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-lg border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Update preferences
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="recommended" className="space-y-5">
                <TabsList className="inline-flex gap-2 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-slate-300">
                  <TabsTrigger
                    value="recommended"
                    className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                  >
                    Recommended
                  </TabsTrigger>
                  <TabsTrigger
                    value="open"
                    className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                  >
                    All eligible roles
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recommended" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {jobsLoading ? (
                    <div className="col-span-full text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-100 mx-auto"></div>
                      <p className="mt-2 text-slate-400">Loading job matches...</p>
                    </div>
                  ) : currentJobMatches?.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-slate-400">No job matches found. Update your profile to get better matches.</p>
                    </div>
                  ) : (
                    currentJobMatches?.slice(0, 6).map((job: JobMatch) => (
                      <article key={job.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
                        <h3 className="text-base font-semibold text-slate-100">{job.title}</h3>
                        <p className="text-sm text-slate-400">{job.company}</p>
                        <p className="mt-3 text-sm text-slate-300">{job.location}</p>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                          <span>{job.matchScore}% match</span>
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {job.requirements?.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <Button 
                          className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
                          onClick={() => navigate(`/student/jobs/${job.id}`)}
                        >
                          View details
                        </Button>
                      </article>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="open" className="space-y-3">
                  {openJobs.map((job) => (
                    <article
                      key={job.title}
                      className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <h3 className="text-base font-semibold text-slate-100">{job.title}</h3>
                        <p className="text-sm text-slate-400">
                          {job.company} · {job.location}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">{job.deadline}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                          {job.eligibility}
                        </span>
                        <Button
                          variant="outline"
                          className="rounded-lg border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                        >
                          Apply
                        </Button>
                      </div>
                    </article>
                  ))}
                </TabsContent>
              </Tabs>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">Application status</h2>
                    <p className="text-sm text-slate-400">Latest updates across recruiters and upcoming actions.</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="px-0 text-sm font-semibold text-slate-200 hover:text-white"
                  >
                    View timeline
                  </Button>
                </div>
                <div className="space-y-3">
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-100 mx-auto"></div>
                      <p className="mt-2 text-slate-400">Loading applications...</p>
                    </div>
                  ) : currentApplications?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No applications yet. Start applying to jobs!</p>
                    </div>
                  ) : (
                    currentApplications?.slice(0, 3).map((application: Application) => (
                      <div key={application.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-slate-100">{application.job?.title || 'Unknown Position'}</p>
                            <p className="text-xs text-slate-400">{application.job?.company || 'Unknown Company'}</p>
                          </div>
                          <span className="text-xs font-medium text-slate-300 capitalize">{application.status.replace('_', ' ')}</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          Applied · {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Placement support</h2>
                  <p className="text-sm text-slate-400">
                    Resources and mentors to help you prepare at every stage.
                  </p>
                </div>
                <div className="space-y-3">
                  {supportResources.map((resource) => (
                    <div key={resource.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-100">
                          <resource.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-100">{resource.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">{resource.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="mt-3 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                      >
                        {resource.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

