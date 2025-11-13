import { 
  CheckCircle2, 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  FileText,
  Briefcase,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const universityFeatures = [
  { icon: Users, text: "Recruiter Management & Verification" },
  { icon: Calendar, text: "Placement Drives Management" },
  { icon: BarChart3, text: "Analytics & Reports Dashboard" },
  { icon: FileText, text: "Pre-Fixed Templates for Emails & Docs" },
  { icon: MessageSquare, text: "Student Notifications & Tracking" },
  { icon: Shield, text: "Compliance & Documentation" },
];

const recruiterFeatures = [
  { icon: Briefcase, text: "Job Posting Portal" },
  { icon: CheckCircle2, text: "Application Evaluation & Shortlisting" },
  { icon: Calendar, text: "Interview Scheduling" },
  { icon: MessageSquare, text: "Communication Portal with WhatsApp" },
  { icon: TrendingUp, text: "Post-Placement Tracking" },
  { icon: BarChart3, text: "Reports & Analytics" },
];

const studentFeatures = [
  { icon: Briefcase, text: "Active Job Listings Dashboard" },
  { icon: FileText, text: "Resume Builder & Portfolio Creation" },
  { icon: TrendingUp, text: "Application Tracking" },
  { icon: Zap, text: "AI-Powered Recommendations" },
  { icon: Calendar, text: "Interview Preparation" },
  { icon: Shield, text: "Offer Letter & Acknowledgement Portal" },
];

const FeatureList = ({ features }: { features: typeof universityFeatures }) => (
  <div className="grid md:grid-cols-2 gap-6">
    {features.map((feature, index) => {
      const Icon = feature.icon;
      return (
        <div 
          key={index} 
          className="flex items-start gap-4 p-4 rounded-xl hover:bg-card-elevated transition-colors duration-300"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <p className="text-foreground font-medium pt-2">{feature.text}</p>
        </div>
      );
    })}
  </div>
);

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Built for Universities, Loved by Students,
            <span className="text-accent"> Trusted by Recruiters</span>
          </h2>
          <p className="text-lg text-text-muted">
            Comprehensive features designed for every stakeholder in the placement ecosystem
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="universities" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12 h-auto p-1 bg-card border border-card-border">
              <TabsTrigger 
                value="universities" 
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground py-3 rounded-lg font-semibold"
              >
                Universities
              </TabsTrigger>
              <TabsTrigger 
                value="recruiters"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground py-3 rounded-lg font-semibold"
              >
                Recruiters
              </TabsTrigger>
              <TabsTrigger 
                value="students"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground py-3 rounded-lg font-semibold"
              >
                Students
              </TabsTrigger>
            </TabsList>

            <TabsContent value="universities" className="mt-8">
              <div className="bg-card rounded-2xl p-8 border border-card-border shadow-lg">
                <h3 className="font-heading text-2xl font-bold mb-6 text-foreground">
                  University Placement Cell Features
                </h3>
                <FeatureList features={universityFeatures} />
              </div>
            </TabsContent>

            <TabsContent value="recruiters" className="mt-8">
              <div className="bg-card rounded-2xl p-8 border border-card-border shadow-lg">
                <h3 className="font-heading text-2xl font-bold mb-6 text-foreground">
                  Recruiter & Company Features
                </h3>
                <FeatureList features={recruiterFeatures} />
              </div>
            </TabsContent>

            <TabsContent value="students" className="mt-8">
              <div className="bg-card rounded-2xl p-8 border border-card-border shadow-lg">
                <h3 className="font-heading text-2xl font-bold mb-6 text-foreground">
                  Student Dashboard Features
                </h3>
                <FeatureList features={studentFeatures} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};
