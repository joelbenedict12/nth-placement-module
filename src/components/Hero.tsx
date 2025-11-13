import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white">
      <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-end px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10"
          >
            Log in
          </Link>
          <Link
            to="/login?mode=signup"
            className="rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-glow/30 transition-transform hover:scale-105"
          >
            Sign up
          </Link>
        </div>
      </div>
      <div className="container relative mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg shadow-accent-glow/20 animate-fade-in-up">
            <div className="relative">
              <Zap className="w-4 h-4 text-accent-cyan animate-pulse-glow" />
              <div className="absolute inset-0 blur-md bg-accent-cyan/50" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-text-gradient-from to-text-gradient-to bg-clip-text text-transparent">
              Powered by Advanced AI Models
            </span>
            <Sparkles className="w-4 h-4 text-accent-purple" />
          </div>

          {/* Main headline with gradient text */}
          <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-white">Next-Gen</span>
            <br />
            <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: "200% auto" }}>
              AI-Powered Placements
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Revolutionizing campus recruitment with intelligent automation, predictive analytics, 
            and AI-driven insights for Universities, Recruiters, and Students
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg" 
              className="group relative bg-gradient-to-r from-accent-cyan to-accent-blue hover:shadow-2xl hover:shadow-accent-glow/50 text-primary-foreground font-bold px-10 py-7 text-lg rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Experience AI Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="relative border-2 border-accent-cyan/60 text-white hover:bg-white/10 hover:border-accent-cyan backdrop-blur-sm font-bold px-10 py-7 text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-glow/30"
            >
              Book Consultation
            </Button>
          </div>

          {/* Enhanced Stats with glassmorphism */}
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "500+", label: "AI-Enabled Universities", gradient: "from-accent-cyan to-accent-blue" },
              { value: "2000+", label: "Active Recruiters", gradient: "from-accent-purple to-accent-cyan" },
              { value: "100K+", label: "AI-Matched Placements", gradient: "from-accent-blue to-accent-purple" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="relative group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15 transition-all duration-300 hover:scale-105 hover:border-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-glow/5 to-accent-glow-purple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
