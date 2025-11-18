import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobAPI, Application } from "@/services/api";

const Applications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Fetch applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: jobAPI.getApplications,
  });

  // Filter applications by status
  const filteredApplications = applications?.filter((app: Application) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-300", icon: Clock },
      reviewing: { color: "bg-blue-500/20 text-blue-300", icon: AlertCircle },
      shortlisted: { color: "bg-green-500/20 text-green-300", icon: CheckCircle },
      rejected: { color: "bg-red-500/20 text-red-300", icon: XCircle },
      accepted: { color: "bg-emerald-500/20 text-emerald-300", icon: CheckCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading your applications...</p>
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
              <h1 className="text-3xl font-semibold text-slate-100">My Applications</h1>
              <p className="mt-2 text-sm text-slate-400">
                Track the status of your job applications and upcoming interviews
              </p>
            </div>
            <Button 
              onClick={() => navigate('/student/matches')}
              className="bg-gradient-to-r from-accent-cyan to-accent-purple"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex gap-2 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-slate-300">
            <TabsTrigger
              value="all"
              className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              All ({applications?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="reviewing"
              className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              In Review
            </TabsTrigger>
            <TabsTrigger
              value="shortlisted"
              className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              Shortlisted
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="rounded-md px-4 py-2 text-sm data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100"
            >
              Not Selected
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredApplications?.length === 0 ? (
              <Card className="border-slate-800 bg-slate-900/60">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    {activeTab === "all" ? "No applications yet" : `No ${activeTab} applications`}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {activeTab === "all" 
                      ? "Start applying to jobs to see your applications here"
                      : `You don't have any ${activeTab} applications at the moment`
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/student/matches')}
                    className="bg-gradient-to-r from-accent-cyan to-accent-purple"
                  >
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredApplications?.map((application: Application) => (
                  <Card key={application.id} className="border-slate-800 bg-slate-900/60 hover:bg-slate-900/80 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-slate-100">{application.job?.title || 'Position'}</CardTitle>
                          <CardDescription className="text-slate-400">{application.job?.company || 'Company'}</CardDescription>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Briefcase className="h-4 w-4" />
                        {application.job?.location || 'Location not specified'}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                      </div>

                      {application.status === 'shortlisted' && application.job?.interviewDate && (
                        <div className="rounded-lg bg-slate-800/50 p-3">
                          <p className="text-sm font-medium text-slate-100 mb-1">Interview Scheduled</p>
                          <p className="text-xs text-slate-400">
                            {new Date(application.job.interviewDate).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/student/jobs/${application.jobId}`)}
                          className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                        {application.status === 'shortlisted' && (
                          <Button 
                            onClick={() => navigate(`/student/interview/${application.id}`)}
                            className="flex-1 bg-gradient-to-r from-accent-cyan to-accent-purple"
                          >
                            Prepare Interview
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Applications;