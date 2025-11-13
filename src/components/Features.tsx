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
  Zap,
  Brain,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const universityFeatures = [
  { icon: Brain, text: "AI-Powered Recruiter Verification", tag: "AI" },
  { icon: Calendar, text: "Intelligent Drive Scheduling", tag: "Automated" },
  { icon: BarChart3, text: "Predictive Analytics Dashboard", tag: "ML" },
  { icon: FileText, text: "Smart Document Generation", tag: "AI" },
  { icon: Sparkles, text: "Real-Time Student Insights", tag: "Live" },
  { icon: Shield, text: "Automated Compliance Tracking", tag: "Auto" },
];

const recruiterFeatures = [
  { icon: Briefcase, text: "AI Job-Candidate Matching", tag: "AI" },
  { icon: Brain, text: "Neural Resume Screening", tag: "ML" },
  { icon: Calendar, text: "Smart Interview Scheduling", tag: "Auto" },
  { icon: MessageSquare, text: "AI Communication Assistant", tag: "AI" },
  { icon: TrendingUp, text: "Predictive Hiring Analytics", tag: "ML" },
  { icon: Zap, text: "Real-Time Candidate Scoring", tag: "Live" },
];

const studentFeatures = [
  { icon: Sparkles, text: "Personalized Job Recommendations", tag: "AI" },
  { icon: FileText, text: "AI Resume Optimization", tag: "AI" },
  { icon: Brain, text: "ML-Powered Interview Prep", tag: "ML" },
  { icon: Zap, text: "Intelligent Skill Gap Analysis", tag: "AI" },
  { icon: TrendingUp, text: "Career Path Predictions", tag: "ML" },
  { icon: Shield, text: "Auto Application Tracking", tag: "Auto" },
];

const FeatureList = ({ features }: { features: typeof universityFeatures }) => (
  <div className="grid md:grid-cols-2 gap-4">
    {features.map((feature, index) => {
      const Icon = feature.icon;
      return (
        <div 
          key={index} 
          className="group flex items-start gap-4 p-5 rounded-2xl bg-card/30 backdrop-blur-sm border border-card-border hover:border-card-border-hover transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple p-0.5">
              <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                <Icon className="w-6 h-6 text-accent-cyan group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="absolute inset-0 blur-lg bg-accent-glow/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-foreground font-semibold">{feature.text}</p>
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                {feature.tag}
              </span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export const Features = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-glow-purple/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-glow/15 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-card/40 backdrop-blur-xl border border-card-border-hover">
            <Zap className="w-4 h-4 text-accent-cyan animate-pulse" />
            <span className="text-sm font-semibold text-accent-cyan">AI-First Features</span>
          </div>
          
          <h2 className="font-heading text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue bg-clip-text text-transparent">
              Intelligent Features
            </span>
            <br />
            <span className="text-foreground">For Every Role</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Every feature powered by machine learning and artificial intelligence
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="universities" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto mb-16 h-auto p-1.5 bg-card/60 backdrop-blur-xl border border-card-border rounded-2xl">
              <TabsTrigger 
                value="universities" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-cyan data-[state=active]:to-accent-blue data-[state=active]:text-primary-foreground py-4 rounded-xl font-bold text-base transition-all duration-300"
              >
                Universities
              </TabsTrigger>
              <TabsTrigger 
                value="recruiters"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-purple data-[state=active]:to-accent-cyan data-[state=active]:text-primary-foreground py-4 rounded-xl font-bold text-base transition-all duration-300"
              >
                Recruiters
              </TabsTrigger>
              <TabsTrigger 
                value="students"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent-blue data-[state=active]:to-accent-purple data-[state=active]:text-primary-foreground py-4 rounded-xl font-bold text-base transition-all duration-300"
              >
                Students
              </TabsTrigger>
            </TabsList>

            <TabsContent value="universities" className="mt-0">
              <div className="p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-card-border-hover">
                <h3 className="font-heading text-3xl font-bold mb-8 bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                  AI-Enhanced University Tools
                </h3>
                <FeatureList features={universityFeatures} />
              </div>
            </TabsContent>

            <TabsContent value="recruiters" className="mt-0">
              <div className="p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-card-border-hover">
                <h3 className="font-heading text-3xl font-bold mb-8 bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
                  Intelligent Recruiter Platform
                </h3>
                <FeatureList features={recruiterFeatures} />
              </div>
            </TabsContent>

            <TabsContent value="students" className="mt-0">
              <div className="p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-card-border-hover">
                <h3 className="font-heading text-3xl font-bold mb-8 bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                  Smart Student Experience
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
