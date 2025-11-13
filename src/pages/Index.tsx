import { Hero } from "@/components/Hero";
import { Overview } from "@/components/Overview";
import { AIShowcase } from "@/components/AIShowcase";
import { Features } from "@/components/Features";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AIShowcase />
      <Overview />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
