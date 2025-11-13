import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Nth Place?",
    answer: "Nth Place is an all-in-one Placement Management Platform that connects Universities, Recruiters, and Students. It streamlines the entire campus placement process from recruiter onboarding to final offer letters, with AI-powered insights and automation."
  },
  {
    question: "How does Nth Place help universities?",
    answer: "Universities can manage recruiter verification, create and track placement drives, notify students, generate comprehensive analytics, maintain compliance documentation, and handle multi-campus operations from a single dashboard."
  },
  {
    question: "What features do recruiters get?",
    answer: "Recruiters can post jobs, evaluate candidates, schedule interviews, communicate via integrated WhatsApp, track post-placement metrics, and access detailed analytics about their hiring pipeline — all in one platform."
  },
  {
    question: "How do students benefit from Nth Place?",
    answer: "Students get a personalized dashboard with active job listings, resume and portfolio builders, application tracking, AI-powered recommendations, interview preparation based on their resume, and direct communication with recruiters."
  },
  {
    question: "Is the platform secure and compliant?",
    answer: "Yes, Nth Place is built on secure cloud infrastructure with enterprise-grade security measures, audit logs, compliance documentation support, and data protection protocols to ensure all stakeholder information is safe."
  },
  {
    question: "Can Nth Place integrate with existing systems?",
    answer: "Absolutely. Nth Place offers seamless integrations with LinkedIn for portfolio sync, WhatsApp for communication, and various assessment tools. We also provide APIs for custom integrations as needed."
  },
  {
    question: "What kind of analytics does the platform provide?",
    answer: "The platform offers comprehensive analytics including placement statistics, department-wise reports, recruiter performance metrics, student progress tracking, and predictive insights powered by AI to help make data-driven decisions."
  },
  {
    question: "How do I get started with Nth Place?",
    answer: "Simply request a demo or book a call with our team. We'll walk you through the platform, understand your specific needs, and help you get set up with a customized solution for your institution or organization."
  }
];

export const FAQ = () => {
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-white/70">
              Everything you need to know about Nth Place
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white/10 border border-white/20 rounded-xl px-6 hover:border-accent/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-white hover:text-accent py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-white/70 mb-4">Still have questions?</p>
            <a 
              href="#contact" 
              className="text-accent font-semibold hover:underline inline-flex items-center gap-2"
            >
              Contact our team
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
