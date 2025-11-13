import { 
  Database, 
  Bell, 
  Brain, 
  Link, 
  Shield, 
  BookOpen 
} from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Comprehensive CRUD Operations",
    description: "Full control over entities including universities, recruiters, students, and job listings with intuitive management interfaces."
  },
  {
    icon: Bell,
    title: "Notification & Communication Hub",
    description: "Real-time notifications via WhatsApp integration, email templates, and in-app messaging to keep all stakeholders connected."
  },
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced analytics, recommendation engine, and AI-driven insights for portfolio enhancement and placement predictions."
  },
  {
    icon: Link,
    title: "Seamless Integrations",
    description: "LinkedIn sync for portfolios, WhatsApp for instant communication, and third-party assessment tools for skill evaluation."
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Cloud-based infrastructure with enterprise-grade security, audit logs, compliance documentation, and data protection."
  },
  {
    icon: BookOpen,
    title: "Knowledge Resources",
    description: "Built-in blog, newsletter, and article section for placement insights, career guidance, and industry trends."
  }
];

export const PlatformFeatures = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Powerful Platform Capabilities
          </h2>
          <p className="text-lg text-text-muted">
            Built on modern, scalable architecture with features that grow with your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-card border border-card-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:from-accent/30 group-hover:to-accent/20 transition-colors">
                  <Icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
