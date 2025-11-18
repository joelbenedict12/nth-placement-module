import { BadgeCheck, Download, Plus, Sparkles, Upload, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { resumeAPI, Resume } from "@/services/api";
import { toast } from "sonner";

const ResumeBuilder = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { token, isLoading: isAuthLoading } = useAuth();
  const isAuthenticated = !!token;

  // Form state for resume data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: {
      technical: '',
      analytics: '',
      collaboration: ''
    },
    projects: [],
    achievements: ''
  });

  // State to track which fields were auto-filled
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  // Function to fill form with parsed resume data
  const fillFormWithParsedData = (extractedData: any) => {
    if (!extractedData) return;

    const newResumeData = { ...resumeData };
    const newAutoFilledFields = new Set<string>();

    // Fill personal info
    if (extractedData.personal_info) {
      if (extractedData.personal_info.full_name) {
        newResumeData.personalInfo.fullName = extractedData.personal_info.full_name;
        newAutoFilledFields.add('fullName');
      }
      if (extractedData.personal_info.email) {
        newResumeData.personalInfo.email = extractedData.personal_info.email;
        newAutoFilledFields.add('email');
      }
      if (extractedData.personal_info.phone) {
        newResumeData.personalInfo.phone = extractedData.personal_info.phone;
        newAutoFilledFields.add('phone');
      }
      if (extractedData.personal_info.location) {
        newResumeData.personalInfo.location = extractedData.personal_info.location;
        newAutoFilledFields.add('location');
      }
      if (extractedData.personal_info.linkedin_url || extractedData.personal_info.github_url) {
        newResumeData.personalInfo.portfolio = extractedData.personal_info.linkedin_url || extractedData.personal_info.github_url;
        newAutoFilledFields.add('portfolio');
      }
    }

    // Fill summary if available
    if (extractedData.summary) {
      newResumeData.summary = extractedData.summary;
      newAutoFilledFields.add('summary');
    }

    // Fill education
    if (extractedData.education && Array.isArray(extractedData.education) && extractedData.education.length > 0) {
      newResumeData.education = extractedData.education.map((edu: any) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        graduationYear: edu.graduation_year || '',
        cgpa: edu.cgpa || ''
      }));
      newAutoFilledFields.add('education');
    }

    // Fill experience
    if (extractedData.experience && Array.isArray(extractedData.experience) && extractedData.experience.length > 0) {
      newResumeData.experience = extractedData.experience.map((exp: any) => ({
        title: exp.title || '',
        company: exp.company || '',
        duration: exp.duration || '',
        description: exp.description || ''
      }));
      newAutoFilledFields.add('experience');
    }

    // Fill skills
    if (extractedData.skills) {
      if (extractedData.skills.technical && Array.isArray(extractedData.skills.technical) && extractedData.skills.technical.length > 0) {
        newResumeData.skills.technical = extractedData.skills.technical.join(', ');
        newAutoFilledFields.add('technicalSkills');
      }
      if (extractedData.skills.soft && Array.isArray(extractedData.skills.soft) && extractedData.skills.soft.length > 0) {
        newResumeData.skills.collaboration = extractedData.skills.soft.join(', ');
        newAutoFilledFields.add('softSkills');
      }
    }

    // Fill projects
    if (extractedData.projects && Array.isArray(extractedData.projects) && extractedData.projects.length > 0) {
      newResumeData.projects = extractedData.projects.map((proj: any) => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || []
      }));
      newAutoFilledFields.add('projects');
    }

    // Fill achievements
    if (extractedData.achievements && Array.isArray(extractedData.achievements) && extractedData.achievements.length > 0) {
      newResumeData.achievements = extractedData.achievements.join('\n');
      newAutoFilledFields.add('achievements');
    }

    setResumeData(newResumeData);
    setAutoFilledFields(newAutoFilledFields);
    
    const filledCount = newAutoFilledFields.size;
    toast.success(`Resume data extracted! ${filledCount} sections auto-filled.`);
  };

  // Debug logging
  useEffect(() => {
    console.log('ResumeBuilder auth state:', { token: !!token, isAuthLoading, isAuthenticated });
  }, [token, isAuthLoading]);

  // Fetch resumes
  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ['resumes', isAuthenticated],
    queryFn: resumeAPI.getResumes,
    enabled: isAuthenticated, // Only fetch if user is authenticated
    onSuccess: (data) => {
      console.log('Resumes API response:', data);
      console.log('Type of resumes:', typeof data, Array.isArray(data));
      console.log('Resumes data structure:', JSON.stringify(data, null, 2));
    },
    onError: (error) => {
      console.error('Failed to fetch resumes:', error);
      toast.error('Failed to load resumes');
    }
  });

  // Upload resume mutation
  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => resumeAPI.uploadResume(file),
    onSuccess: (data) => {
      console.log('Upload mutation success data:', data);
      
      // Handle parsed data if available
      if (data?.resume?.extracted_data) {
        const extractedData = data.resume.extracted_data;
        console.log('Parsed resume data:', extractedData);
        
        // Fill form fields with extracted data
        fillFormWithParsedData(extractedData);
        
        // Show completion percentage
        if (data.resume.completion_percentage) {
          toast.success(`Resume ${data.resume.completion_percentage}% complete`);
        }
      } else {
        console.log('No extracted data found in response:', data);
      }
      
      // Refresh the resumes list
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume uploaded successfully!');
    },
    onError: (error: any) => {
      console.error('Upload mutation error:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to upload resume';
      toast.error(errorMessage);
    },
  });

  // Delete resume mutation
  const deleteResumeMutation = useMutation({
    mutationFn: (id: string) => resumeAPI.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = error.message || error.response?.data?.message || 'Failed to delete resume';
      toast.error(errorMessage);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!isAuthenticated) {
        toast.error('Please log in to upload resumes');
        return;
      }
      uploadResumeMutation.mutate(file);
    }
  };

  // AI Resume Builder mutation
  const generateResumeMutation = useMutation({
    mutationFn: (data: any) => resumeAPI.generateResume(data),
    onSuccess: (data) => {
      toast.success('AI Resume generated successfully!');
      if (data?.content) {
        // Fill form with AI generated content
        fillFormWithParsedData(data.content);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || error.response?.data?.message || 'Failed to generate resume';
      toast.error(errorMessage);
    },
  });

  const handleAIResumeBuilder = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to use AI Resume Builder');
      return;
    }
    
    // Use current form data to generate resume
    const currentData = {
      personalInfo: resumeData.personalInfo,
      summary: resumeData.summary,
      skills: resumeData.skills,
      achievements: resumeData.achievements
    };
    
    generateResumeMutation.mutate(currentData);
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const response = await fetch(resume.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-100 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated && !isAuthLoading) {
    console.log('Showing authentication required screen');
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-100">Authentication Required</h1>
          <p className="text-slate-400">Please log in to access the Resume Builder.</p>
          <Link to="/login">
            <Button className="bg-slate-100 text-slate-900 hover:bg-white">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
            {(uploadResumeMutation.isPending || generateResumeMutation.isPending) && (
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-300"></div>
                {uploadResumeMutation.isPending ? 'Parsing resume with AI...' : 'Generating AI resume...'}
              </div>
            )}
            {autoFilledFields.size > 0 && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Sparkles className="h-4 w-4" />
                {autoFilledFields.size} fields auto-filled from resume
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">Your Resumes</h3>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-100 mx-auto"></div>
                <p className="mt-2 text-xs text-slate-400">Loading resumes...</p>
              </div>
            ) : error ? (
              <p className="text-xs text-red-400">Error loading resumes. Please try again.</p>
            ) : !Array.isArray(resumes) || resumes?.length === 0 ? (
              <p className="text-xs text-slate-400">No resumes uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {resumes?.map((resume: Resume) => (
                  <div key={resume.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-100">{resume.fileName}</p>
                          <p className="text-xs text-slate-400">
                            {resume.aiGenerated ? 'AI Generated' : 'Uploaded'} • {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(resume)}
                          className="h-7 px-2 text-xs"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteResumeMutation.mutate(resume.id)}
                          disabled={deleteResumeMutation.isPending}
                          className="h-7 px-2 text-xs text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadResumeMutation.isPending}
              className="w-full justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <Upload className="h-4 w-4" />
              {uploadResumeMutation.isPending ? 'Uploading...' : 'Upload Resume'}
            </Button>
            <Button
              variant="outline"
              onClick={handleAIResumeBuilder}
              disabled={generateResumeMutation.isPending}
              className="w-full justify-center gap-2 rounded-xl border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              {generateResumeMutation.isPending ? 'Generating...' : 'AI Resume Builder'}
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
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        placeholder="Aditi Sharma"
                        className={`border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300 ${
                          autoFilledFields.has('fullName') ? 'ring-2 ring-green-500/50 bg-green-950/20' : ''
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-200">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        placeholder="aditi.sharma@nthuniv.edu"
                        className={`border-slate-800 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus-visible:ring-slate-300 ${
                          autoFilledFields.has('email') ? 'ring-2 ring-green-500/50 bg-green-950/20' : ''
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-200">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
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
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
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
                        value={resumeData.personalInfo.portfolio}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                        }))}
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
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
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
                          value={
                            category === "Technical" ? resumeData.skills.technical :
                            category === "Analytics" ? resumeData.skills.analytics :
                            resumeData.skills.collaboration
                          }
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              [category.toLowerCase()]: e.target.value
                            }
                          }))}
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
                    value={resumeData.achievements}
                    onChange={(e) => setResumeData(prev => ({ ...prev, achievements: e.target.value }))}
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

