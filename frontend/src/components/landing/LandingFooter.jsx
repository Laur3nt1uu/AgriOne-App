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
  Heart
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageProvider";
import logo from "../../assets/agrione.png";
import ContactModal from "../ContactModal";

const socialLinks = [
  { icon: Github, href: "https://github.com/agri-one", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/agri-one", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/agri_one", label: "Twitter" }
];

const contactInfo = [
  { icon: Mail, label: "hello@agri-one.com", href: "mailto:hello@agri-one.com" },
  { icon: Phone, label: "+40 123 456 789", href: "tel:+40123456789" },
  { icon: MapPin, label: "Bucharest, Romania", href: "https://maps.google.com/?q=Bucharest+Romania" }
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
        { label: t("footer.links.documentation"), href: "/docs", isRoute: true }
      ]
    },
    company: {
      title: t("footer.company"),
      links: [
        { label: t("footer.links.aboutUs"), href: "#about" },
        { label: t("footer.links.careers"), href: "#about" },
        { label: t("footer.links.pressKit"), href: "#about" },
        { label: t("footer.links.contact"), href: "contact" }
      ]
    },
    resources: {
      title: t("footer.resources"),
      links: [
        { label: t("footer.links.blog"), href: "/blog", isRoute: true },
        { label: t("footer.links.helpCenter"), href: "/help", isRoute: true },
        { label: t("footer.links.community"), href: "/community", isRoute: true },
        { label: t("footer.links.apiDocs"), href: "/api-docs", isRoute: true }
      ]
    },
    legal: {
      title: t("footer.legal"),
      links: [
        { label: t("footer.links.privacyPolicy"), href: "#footer" },
        { label: t("footer.links.termsOfService"), href: "#footer" },
        { label: t("footer.links.cookiePolicy"), href: "#footer" },
        { label: t("footer.links.gdpr"), href: "#footer" }
      ]
    }
  };

  const handleSmoothScroll = (href, isRoute = false) => {
    // Special case: contact opens modal
    if (href === "contact") {
      setContactOpen(true);
      return;
    }

    // Handle routes
    if (isRoute || (!href.startsWith("#") && href.startsWith("/"))) {
      navigate(href);
      return;
    }

    if (href.startsWith("#")) {
      // For #footer, just scroll to the footer itself
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
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Motion.div
          className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgb(var(--primary) / 0.4), transparent)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <Motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3 mb-6 group"
                >
                  <Motion.div
                    className="w-10 h-10 rounded-xl overflow-hidden"
                    whileHover={{ rotate: 5 }}
                  >
                    <img src={logo} alt="AgriOne" className="w-full h-full object-cover" />
                  </Motion.div>
                  <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    AgriOne
                  </span>
                </Motion.button>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                  {t("footer.description")}
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  {contactInfo.map((contact) => {
                    const Icon = contact.icon;
                    return (
                      <Motion.a
                        key={contact.label}
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm">{contact.label}</span>
                        {contact.href.startsWith("http") && (
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        )}
                      </Motion.a>
                    );
                  })}
                </div>
              </Motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([key, section], index) => (
              <Motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-foreground font-semibold mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
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

          {/* Social Links */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-border/50"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-sm">{t("footer.followUs")}</span>
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
                      className="w-10 h-10 rounded-xl bg-card/60 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300"
                      title={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </Motion.a>
                  );
                })}
              </div>

              <Motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary cursor-pointer"
                onClick={() => handleSmoothScroll("#features")}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{t("footer.stayUpdated")}</span>
              </Motion.div>
            </div>
          </Motion.div>
        </div>

        {/* Bottom Bar */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>&copy; {new Date().getFullYear()} AgriOne. {t("footer.copyright")}</span>
              <span className="hidden md:inline">&bull;</span>
              <span className="hidden md:inline flex items-center gap-1">
                {t("footer.madeWith")} <Heart className="w-3 h-3 fill-red-500 text-red-500" /> {t("footer.inRomania")}
              </span>
            </div>

            <Motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(34, 197, 94, 0.0)",
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 0 rgba(34, 197, 94, 0.0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium">{t("footer.allSystemsOperational")}</span>
            </Motion.div>
          </div>
        </Motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  );
}
