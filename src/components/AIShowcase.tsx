import { Brain, Sparkles, Cpu, Network, Zap, TrendingUp } from "lucide-react";
import aiNetwork from "@/assets/ai-network.jpg";

const aiCapabilities = [
  {
    icon: Brain,
    title: "Intelligent Matching",
    description: "Advanced neural networks analyze candidate profiles and job requirements for perfect matches",
    gradient: "from-accent-cyan to-accent-blue"
  },
  {
    icon: Sparkles,
    title: "Predictive Analytics",
    description: "Machine learning models forecast placement success rates and optimize recruitment strategies",
    gradient: "from-accent-purple to-accent-cyan"
  },
  {
    icon: Cpu,
    title: "Natural Language Processing",
    description: "AI-powered resume parsing and JD analysis for instant candidate evaluation",
    gradient: "from-accent-blue to-accent-purple"
  },
  {
    icon: Network,
    title: "Deep Learning Insights",
    description: "Neural networks identify hidden patterns in placement data for strategic decision-making",
    gradient: "from-accent-cyan to-accent-purple"
  },
  {
    icon: Zap,
    title: "Real-Time Recommendations",
    description: "Instant AI suggestions for candidates, skills, and interview preparation",
    gradient: "from-accent-purple to-accent-blue"
  },
  {
    icon: TrendingUp,
    title: "Continuous Learning",
    description: "Self-improving AI models that get smarter with every placement cycle",
    gradient: "from-accent-blue to-accent-cyan"
  }
];

export const AIShowcase = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-black text-white">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img src={aiNetwork} alt="AI Network" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent-glow-purple/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent-glow/20 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            <Brain className="w-4 h-4 text-accent-cyan animate-pulse" />
            <span className="text-sm font-semibold text-accent-cyan">Powered by Advanced AI</span>
          </div>
          
          <h2 className="font-heading text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Intelligence That</span>
            <br />
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue bg-clip-text text-transparent">
              Transforms Placements
            </span>
          </h2>
          
          <p className="text-xl text-white/70 leading-relaxed">
            Our cutting-edge AI models process millions of data points to deliver unprecedented 
            accuracy in candidate matching, skill assessment, and placement prediction
          </p>
        </div>

        {/* AI Models Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-20">
          {aiCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon with glow */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${capability.gradient} p-0.5`}>
                    <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                      <Icon className="w-8 h-8 text-accent-cyan group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className={`absolute inset-0 blur-xl bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-30 transition-opacity`} />
                </div>

                <h3 className="font-heading text-xl font-bold mb-3 text-white group-hover:text-accent-cyan transition-colors">
                  {capability.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {capability.description}
                </p>

                {/* Animated corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`absolute top-0 right-0 w-px h-10 bg-gradient-to-b ${capability.gradient}`} />
                  <div className={`absolute top-0 right-0 w-10 h-px bg-gradient-to-l ${capability.gradient}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Stats Banner */}
        <div className="max-w-5xl mx-auto">
          <div className="relative p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(hsl(var(--accent-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-cyan)) 1px, transparent 1px)`,
                backgroundSize: '30px 30px',
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="font-heading text-2xl font-bold text-center mb-8 text-white">
                AI Performance Metrics
              </h3>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { value: "97%", label: "Matching Accuracy" },
                  { value: "85%", label: "Placement Success Rate" },
                  { value: "10M+", label: "Data Points Analyzed" },
                  { value: "<2s", label: "Average Response Time" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/70 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
