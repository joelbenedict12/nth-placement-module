import { Mail, Phone, MapPin, Linkedin, Twitter, Globe, Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative pt-20 pb-10 overflow-hidden border-t border-card-border">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-glow/10 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-accent-glow-purple/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple p-0.5">
                <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-cyan" />
                </div>
              </div>
              <h3 className="font-heading text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                Nth Place
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Next-generation AI-powered Placement Management Platform by Nth Space Solutions Pvt. Ltd. 
              Revolutionizing campus recruitment with intelligent automation and predictive analytics.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Globe, href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href}
                    className="group w-11 h-11 rounded-xl bg-card/60 backdrop-blur-sm border border-card-border hover:border-card-border-hover flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent-cyan transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {["AI Features", "Pricing", "Case Studies", "Documentation", "API", "Support"].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-accent-cyan transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-foreground">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-card/60 border border-card-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-accent-cyan" />
                </div>
                <a href="mailto:info@nthplace.com" className="text-muted-foreground hover:text-accent-cyan transition-colors">
                  info@nthplace.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-card/60 border border-card-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-accent-cyan" />
                </div>
                <a href="tel:+911234567890" className="text-muted-foreground hover:text-accent-cyan transition-colors">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-card/60 border border-card-border flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-accent-cyan" />
                </div>
                <span className="text-muted-foreground">
                  Bangalore, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Nth Space Solutions Pvt. Ltd. Powered by AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            {["Privacy", "Terms", "Cookies", "Security"].map((item, index) => (
              <a 
                key={index}
                href="#" 
                className="text-muted-foreground hover:text-accent-cyan transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
