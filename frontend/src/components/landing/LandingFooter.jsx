import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Heart,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import logo from "../../assets/agrione.png";
import ContactModal from "../ContactModal";

const socialLinks = [
  { icon: Github, href: "https://github.com/agri-one", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/agri-one", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/agri_one", label: "Twitter" },
];

const contactInfo = [
  { icon: Mail, label: "hello@agri-one.com", href: "mailto:hello@agri-one.com" },
  { icon: Phone, label: "+40 123 456 789", href: "tel:+40123456789" },
  { icon: MapPin, label: "Bucharest, Romania", href: "https://maps.google.com/?q=Bucharest+Romania" },
];

export default function LandingFooter() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [contactOpen, setContactOpen] = useState(false);

  const footerLinks = {
    platform: {
      title: t("footer.platform"),
      links: [
        { label: t("footer.links.features"), href: "#features" },
        { label: t("footer.links.howItWorks"), href: "#how-it-works" },
        { label: t("footer.links.pricing"), href: "#pricing" },
      ],
    },
    company: {
      title: t("footer.company"),
      links: [
        { label: t("footer.links.aboutUs"), href: "#about" },
        { label: t("footer.links.blog"), href: "/blog", isRoute: true },
        { label: t("footer.links.contact"), href: "contact" },
      ],
    },
    legal: {
      title: t("footer.legal"),
      links: [
        { label: t("footer.links.privacyPolicy"), href: "/privacy", isRoute: true },
        { label: t("footer.links.termsOfService"), href: "/terms", isRoute: true },
        { label: t("footer.links.gdpr"), href: "/gdpr", isRoute: true },
      ],
    },
  };

  const handleSmoothScroll = (href, isRoute = false) => {
    if (href === "contact") {
      setContactOpen(true);
      return;
    }

    if (isRoute || (!href.startsWith("#") && href.startsWith("/"))) {
      navigate(href);
      return;
    }

    if (href.startsWith("#")) {
      if (href === "#footer") {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        return;
      }
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <footer className="relative bg-card/40 border-t border-border/50 backdrop-blur-xl overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(var(--primary) / 0.4), transparent)",
          }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 mb-5 group"
                >
                  <Motion.div
                    className="w-9 h-9 rounded-xl overflow-hidden"
                    whileHover={{ rotate: 5 }}
                  >
                    <img src={logo} alt="AgriOne" className="w-full h-full object-cover" />
                  </Motion.div>
                  <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    AgriOne
                  </span>
                </Motion.button>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                  {t("footer.description")}
                </p>

                <div className="space-y-2.5">
                  {contactInfo.map((contact) => {
                    const Icon = contact.icon;
                    return (
                      <Motion.a
                        key={contact.label}
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <Icon className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{contact.label}</span>
                        {contact.href.startsWith("http") && (
                          <ExternalLink className="w-3 h-3 opacity-40" />
                        )}
                      </Motion.a>
                    );
                  })}
                </div>
              </Motion.div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([key, section], index) => (
              <Motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-foreground font-semibold text-sm uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Motion.button
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleSmoothScroll(link.href, link.isRoute)}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm block text-left"
                      >
                        {link.label}
                      </Motion.button>
                    </li>
                  ))}
                </ul>
              </Motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>
                &copy; {new Date().getFullYear()} AgriOne. {t("footer.copyright")}
              </span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline-flex items-center gap-1">
                {t("footer.madeWith")}{" "}
                <Heart className="w-3 h-3 fill-red-500 text-red-500 inline" />{" "}
                {t("footer.inRomania")}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-card/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300"
                    title={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}
