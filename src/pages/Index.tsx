import { Hero } from "@/components/Hero";
import { Overview } from "@/components/Overview";
import { Features } from "@/components/Features";
import { PlatformFeatures } from "@/components/PlatformFeatures";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Overview />
      <Features />
      <PlatformFeatures />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
