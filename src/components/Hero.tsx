import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-hero-gradient-from via-hero-gradient-via to-hero-gradient-to opacity-95" />
        <img 
          src={heroBackground} 
          alt="Nth Place Platform" 
          className="w-full h-full object-cover opacity-20"
        />
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-glow/20 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-glow/15 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent-soft/20 border border-accent/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground">Powered by Nth Space Solutions</span>
          </div>

          {/* Main headline */}
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-primary-foreground leading-tight">
            Your Campus Placements,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-glow to-accent">
              Now Simplified
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl mb-10 text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Nth Place connects Universities, Recruiters, and Students in one intelligent platform — 
            streamlining the end-to-end placement journey with AI-powered insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105"
            >
              Request Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Book a Call
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-1">500+</div>
              <div className="text-sm text-primary-foreground/70">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-1">2000+</div>
              <div className="text-sm text-primary-foreground/70">Recruiters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-1">100K+</div>
              <div className="text-sm text-primary-foreground/70">Students Placed</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
