import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-black text-white">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-black to-white/5" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-glow/20 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-glow-purple/20 rounded-full blur-[150px] animate-float" style={{ animationDelay: "2s" }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--accent-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent-cyan)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative p-12 lg:p-16 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-glow/10 via-transparent to-accent-glow-purple/10" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-40 h-40">
              <div className="absolute top-0 left-0 w-px h-20 bg-gradient-to-b from-accent-cyan to-transparent" />
              <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-accent-cyan to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-40">
              <div className="absolute bottom-0 right-0 w-px h-20 bg-gradient-to-t from-accent-purple to-transparent" />
              <div className="absolute bottom-0 right-0 w-20 h-px bg-gradient-to-l from-accent-purple to-transparent" />
            </div>

            <div className="relative z-10 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                  Join the AI Revolution
                </span>
              </div>

              <h2 className="font-heading text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Ready to Experience</span>
                <br />
                <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-blue bg-clip-text text-transparent">
                  AI-Powered Placements?
                </span>
              </h2>
              
              <p className="text-xl mb-12 text-white/70 max-w-3xl mx-auto leading-relaxed">
                See how our intelligent platform transforms campus recruitment with predictive analytics, 
                automated workflows, and AI-driven insights
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Button 
                  size="lg" 
                  className="group relative bg-gradient-to-r from-accent-cyan to-accent-blue hover:shadow-2xl hover:shadow-accent-glow/50 text-primary-foreground font-bold px-12 py-7 text-lg rounded-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Request AI Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-accent-cyan/50 text-white hover:bg-white/10 hover:border-accent-cyan backdrop-blur-sm font-bold px-12 py-7 text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent-glow/30"
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  Schedule Consultation
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-center gap-8 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                  <span>Free AI Demo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                  <span>Setup in Minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
