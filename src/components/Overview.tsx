import { Building2, Users, GraduationCap } from "lucide-react";

export const Overview = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Empowering Every Step of the
            <span className="text-accent"> Placement Journey</span>
          </h2>
          <p className="text-lg text-text-muted">
            Nth Place is a next-generation Placement Management System that simplifies how universities 
            manage recruitments, how recruiters connect with talent, and how students land opportunities 
            — all in one integrated, intelligent platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Universities */}
          <div className="group p-8 rounded-2xl bg-card border border-card-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <Building2 className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Universities</h3>
            <p className="text-text-muted leading-relaxed">
              Streamline recruiter verification, drive management, student tracking, and generate 
              comprehensive analytics — all from one unified dashboard.
            </p>
          </div>

          {/* Recruiters */}
          <div className="group p-8 rounded-2xl bg-card border border-card-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <Users className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Recruiters</h3>
            <p className="text-text-muted leading-relaxed">
              Post jobs, evaluate candidates, schedule interviews, and track placements with integrated 
              communication tools and detailed analytics.
            </p>
          </div>

          {/* Students */}
          <div className="group p-8 rounded-2xl bg-card border border-card-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <GraduationCap className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-3 text-foreground">Students</h3>
            <p className="text-text-muted leading-relaxed">
              Access job listings, build portfolios, track applications, get AI-powered recommendations, 
              and receive interview preparation tailored to your resume.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
