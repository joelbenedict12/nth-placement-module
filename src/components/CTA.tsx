import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-hero-gradient-from via-hero-gradient-via to-hero-gradient-to relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-glow/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-glow/15 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground">
            Ready to Transform Your
            <span className="text-accent"> Placement Process?</span>
          </h2>
          <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Join hundreds of universities and thousands of recruiters already using Nth Place 
            to create better placement outcomes.
          </p>

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
              <Calendar className="mr-2 w-5 h-5" />
              Book a Call
            </Button>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">
            No credit card required • Free demo available • Setup in minutes
          </p>
        </div>
      </div>
    </section>
  );
};
