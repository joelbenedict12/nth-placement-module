import { Building2, Users, GraduationCap, Sparkles } from "lucide-react";

export const Overview = () => {
  const roles = [
    {
      icon: Building2,
      title: "Universities",
      description: "AI-powered recruiter verification, automated drive management, real-time analytics, and predictive insights for placement success",
      color: "from-accent-cyan to-accent-blue",
      features: ["Smart Verification", "Auto-Scheduling", "Predictive Analytics"]
    },
    {
      icon: Users,
      title: "Recruiters", 
      description: "Intelligent candidate matching, AI resume screening, automated scheduling, and deep analytics to find perfect talent faster",
      color: "from-accent-purple to-accent-cyan",
      features: ["AI Matching", "Smart Screening", "Auto Communication"]
    },
    {
      icon: GraduationCap,
      title: "Students",
      description: "Personalized job recommendations, AI-powered resume optimization, interview prep with ML models, and career path predictions",
      color: "from-accent-blue to-accent-purple",
      features: ["Smart Recommendations", "Resume AI", "Interview Coach"]
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-accent-glow/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-glow-purple/15 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-card/40 backdrop-blur-xl border border-card-border-hover">
            <Sparkles className="w-4 h-4 text-accent-purple animate-pulse" />
            <span className="text-sm font-semibold text-accent-purple">Unified Platform</span>
          </div>
          
          <h2 className="font-heading text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">One Platform,</span>
            <br />
            <span className="bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
              Three Powerful Experiences
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Built with AI at its core to revolutionize every stakeholder's placement journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Card with glass effect */}
                <div className="relative h-full p-8 rounded-3xl bg-card/40 backdrop-blur-xl border border-card-border hover:border-card-border-hover transition-all duration-500 overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon with gradient border */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} p-0.5`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center group-hover:bg-card/50 transition-colors">
                        <Icon className="w-10 h-10 text-accent-cyan group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 blur-2xl bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-40 transition-opacity`} />
                  </div>

                  <h3 className="font-heading text-2xl font-bold mb-4 text-foreground group-hover:text-accent-cyan transition-colors">
                    {role.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-2">
                    {role.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card-glass border border-card-border text-accent-cyan"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                </div>

                {/* Floating glow behind card */}
                <div className={`absolute -inset-2 bg-gradient-to-br ${role.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 -z-10`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
