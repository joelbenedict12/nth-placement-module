import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, Clock, TrendingUp, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { jobAPI, JobMatch } from "@/services/api";

const JobMatches = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Fetch job matches
  const { data: jobMatches, isLoading } = useQuery({
    queryKey: ['job-matches'],
    queryFn: jobAPI.getJobMatches,
  });

  // Filter jobs based on search and type
  const filteredJobs = jobMatches?.filter((job: JobMatch) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || job.jobType === selectedType;
    
    return matchesSearch && matchesType;
  });

  const handleApply = async (jobId: string) => {
    try {
      await jobAPI.applyJob(jobId);
      // Show success message or update UI
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100 mx-auto"></div>
          <p className="mt-4 text-slate-400">Finding your perfect job matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-100">Job Matches</h1>
              <p className="mt-2 text-sm text-slate-400">
                AI-powered job recommendations based on your profile and skills
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-700 bg-slate-900/60 pl-10 text-slate-100 placeholder:text-slate-400 focus-visible:ring-accent-cyan"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            >
              <option value="all">All Types</option>
              <option value="internship">Internship</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
            </select>
          </div>
        </div>

        {filteredJobs?.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-100 mb-2">No matches found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm ? "Try adjusting your search terms" : "Update your profile to get better job matches"}
            </p>
            <Button 
              onClick={() => navigate('/student')}
              className="bg-gradient-to-r from-accent-cyan to-accent-purple"
            >
              Update Profile
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs?.map((job: JobMatch) => (
              <Card key={job.id} className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-slate-100">{job.title}</CardTitle>
                      <CardDescription className="text-slate-400">{job.company}</CardDescription>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-accent-cyan to-accent-purple text-white"
                    >
                      {job.matchScore}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="h-4 w-4" />
                    {job.jobType.replace('_', ' ')} • {job.experienceLevel}
                  </div>

                  {job.salary && (
                    <div className="text-sm font-medium text-slate-300">
                      💰 {job.salary}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 4).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-slate-700 text-slate-300">
                          {skill}
                        </Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="outline" className="border-slate-700 text-slate-300">
                          +{job.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-400">Match Reasons:</p>
                    <div className="space-y-1">
                      {job.matchReasons.slice(0, 3).map((reason: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-xs text-slate-300">
                          <TrendingUp className="h-3 w-3 text-accent-cyan mt-0.5" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleApply(job.id)}
                      className="flex-1 bg-gradient-to-r from-accent-cyan to-accent-purple"
                    >
                      Apply Now
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/student/jobs/${job.id}`)}
                      className="border-slate-700 text-slate-200 hover:bg-slate-800"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatches;