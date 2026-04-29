import { motion as Motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { ScrollReveal, Parallax } from "./ScrollAnimations";

export default function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const items = t("faq.items");

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 bg-card/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Parallax speed={0.1}>
          <Motion.div
            className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--primary) / 0.3), transparent)" }}
            animate={{ scale: [1, 1.3, 1], x: [0, 40, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </Parallax>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal variant="blur-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              {t("faq.badge")}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              {t("faq.title")}{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                {t("faq.titleHighlight")}
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="blur-up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("faq.subtitle")}
            </p>
          </ScrollReveal>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {Array.isArray(items) && items.map((item, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Motion.div
                className={`glass overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "ring-1 ring-primary/20" : ""
                }`}
                whileHover={{ boxShadow: "0 8px 24px rgb(var(--primary) / 0.08)" }}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <span className="text-foreground font-semibold pr-4 group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                  <Motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${openIndex === index ? "text-primary" : "text-muted-foreground"}`} />
                  </Motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <Motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="h-px bg-border/50 mb-4" />
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Motion.div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
