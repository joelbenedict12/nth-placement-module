import { BadgeCheck, Download, Plus, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const ResumeBuilder = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:px-10 lg:py-12">
        <aside className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Resume builder</p>
            <h1 className="text-2xl font-semibold text-slate-100">Create a placement-ready résumé</h1>
            <p className="text-sm text-slate-400">
              Your changes autosave. Export a polished PDF once every section meets the completion checklist.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-100">Overall progress</span>
              <span className="text-slate-400">85%</span>
            </div>
            <Progress value={85} className="mt-3 h-2 bg-slate-800 [&>div]:bg-slate-100" />
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-slate-200" />
                Summary drafted
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-slate-200" />
                Education updated
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-slate-500" />
                Add two project highlights
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button className="w-full justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white">
              <Download className="h-4 w-4" />
              Export PDF preview
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center gap-2 rounded-xl border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Import existing résumé
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm font-semibold text-slate-100">Best practices</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Quantify impact using metrics (%, ₹, people, time saved).</li>
              <li>Keep the file under one page unless experience exceeds 4 years.</li>
              <li>Match keywords from the job description for higher ATS scores.</li>
            </ul>
            <Link to="#" className="text-sm font-semibold text-slate-200 hover:text-white">
              Browse sample résumés →
            </Link>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <Tabs defaultValue="summary" className="space-y-6">
              <TabsList className="flex flex-wrap gap-2 rounded-lg border border-slate-800 bg-slate-950/80 p-1 text-slate-300">
                <TabsTrigger
                  value="summary"
                  className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="skills"
                  className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                >
                  Skills & Tools
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="extras"
                  className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
                >
                  Achievements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-6">
                <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <h2 className="text-lg font-semibold text-slate-100">Personal details</h2>
                  <p className="text-sm text-slate-400">Keep contact details updated before sharing with recruiters.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full-name" className="text-slate-200">
                        Full name
                      </Label>
                      <Input
                        id="full-name"
                        placeholder="Aditi Sharma"
                        className="border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="aditi.sharma@nthuniv.edu"
                        className="border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-200">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        className="border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-200">
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="Bengaluru, India"
                        className="border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="portfolio" className="text-slate-200">
                        Portfolio / LinkedIn
                      </Label>
                      <Input
                        id="portfolio"
                        placeholder="https://linkedin.com/in/aditisharma"
                        className="border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">Professional summary</h2>
                      <p className="text-sm text-slate-400">Use 3-4 bullet statements tailored to target roles.</p>
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-lg border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      <Sparkles className="h-4 w-4" />
                      AI rewrite suggestions
                    </Button>
                  </div>
                  <Textarea
                    id="summary"
                    rows={6}
                    placeholder="• Final-year Computer Science student with hands-on experience in ML-driven analytics.\n• Led a 4-member team to build a placement insights dashboard adopted across campus.\n• Seeking AI Product roles combining user research with data-backed decision making."
                    className="mt-4 border-slate-800 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                  />
                </section>
              </TabsContent>

              <TabsContent value="experience" className="space-y-5">
                <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">Experience entries</h2>
                      <p className="text-sm text-slate-400">Highlight outcomes and tooling per role.</p>
                    </div>
                    <Button className="gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white">
                      <Plus className="h-4 w-4" />
                      Add experience
                    </Button>
                  </header>

                  <div className="space-y-6">
                    {[1, 2].map((item) => (
                      <div key={item} className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Role title</Label>
                            <Input
                              placeholder="AI Product Intern"
                              className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Organization</Label>
                            <Input
                              placeholder="NeuraTech Labs"
                              className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Duration</Label>
                            <Input
                              placeholder="May 2025 - Aug 2025"
                              className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Location / Mode</Label>
                            <Input
                              placeholder="Bengaluru · Hybrid"
                              className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">Impact statements</Label>
                          <Textarea
                            rows={4}
                            placeholder="• Increased demo adoption by 34% after launching AI-driven personalization.\n• Automated recruiter summary reports, saving 10+ hours weekly.\n• Collaborated with product and design to ship 3 features in 6 weeks."
                            className="border-slate-800 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="education" className="space-y-5">
                <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">Education</h2>
                      <p className="text-sm text-slate-400">Include CGPA, graduation year, and key coursework.</p>
                    </div>
                    <Button className="gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white">
                      <Plus className="h-4 w-4" />
                      Add education
                    </Button>
                  </header>

                  <div className="space-y-6">
                    <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-slate-200">Institution</Label>
                          <Input
                            placeholder="Nth Place University"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">Degree & Branch</Label>
                          <Input
                            placeholder="B.Tech · Computer Science"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">Duration</Label>
                          <Input
                            placeholder="2021 - 2025"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">CGPA</Label>
                          <Input
                            placeholder="8.6 / 10"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-200">Coursework & notes</Label>
                        <Textarea
                          rows={3}
                          placeholder="Advanced Machine Learning, Product Strategy, Data Visualization"
                          className="border-slate-800 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="skills" className="space-y-5">
                <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <h2 className="text-lg font-semibold text-slate-100">Skills & tools</h2>
                  <p className="text-sm text-slate-400">
                    Group skills into technical, analytical, and collaboration buckets to improve readability.
                  </p>
                  <div className="mt-4 space-y-3">
                    {["Technical", "Analytics", "Collaboration"].map((category) => (
                      <div key={category} className="space-y-2">
                        <Label className="text-slate-200">{category}</Label>
                        <Input
                          placeholder={
                            category === "Technical"
                              ? "Python, TensorFlow, React, Node.js"
                              : category === "Analytics"
                              ? "SQL, Tableau, Power BI, Pandas"
                              : "Cross-functional communication, Agile, User research"
                          }
                          className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="mt-4 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add certification or badge
                  </Button>
                </section>
              </TabsContent>

              <TabsContent value="projects" className="space-y-5">
                <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">Project highlights</h2>
                      <p className="text-sm text-slate-400">Emphasize outcomes and your contribution.</p>
                    </div>
                    <Button className="gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-white">
                      <Plus className="h-4 w-4" />
                      Add project
                    </Button>
                  </header>

                  <div className="space-y-6">
                    {[1, 2].map((item) => (
                      <div key={item} className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/80 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-slate-200">Project title</Label>
                            <Input
                              placeholder="Placement Intelligence Dashboard"
                              className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Timeline</Label>
                            <Input
                              placeholder="Jan 2025 - Apr 2025"
                              className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">Key outcomes</Label>
                          <Textarea
                            rows={4}
                            placeholder="• Deployed analytics suite adopted by placement cell for decision-making.\n• Surfaced eligibility insights that raised shortlisting accuracy by 22%.\n• Integrated recruiter feedback loop to refine matching models."
                            className="border-slate-800 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-200">Tools & stack</Label>
                          <Input
                            placeholder="Next.js, Supabase, Python, Power BI"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="extras" className="space-y-5">
                <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                  <h2 className="text-lg font-semibold text-slate-100">Achievements & extracurriculars</h2>
                  <p className="text-sm text-slate-400">
                    Include awards, leadership roles, hackathons, and certifications relevant to your target roles.
                  </p>
                  <Textarea
                    rows={6}
                    placeholder="• Winner, Smart India Hackathon 2024 · AI-driven student analytics module.\n• President, University Product Club · Led community of 180+ students.\n• AWS Certified Cloud Practitioner · Issued Aug 2024."
                    className="mt-4 border-slate-800 bg-slate-950/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300"
                  />
                  <Button
                    variant="ghost"
                    className="mt-4 h-auto justify-start px-0 text-sm font-semibold text-slate-200 hover:text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add language or hobby
                  </Button>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResumeBuilder;

