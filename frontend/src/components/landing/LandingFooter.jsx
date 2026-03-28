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

          {/* Payment Methods */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            viewport={{ once: true }}
            className="mt-8 pt-6 border-t border-border/30"
          >
            <div className="flex flex-col items-center gap-4">
              <span className="text-muted-foreground text-sm">{t("footer.securePayments") || "Plăți securizate prin"}</span>
              <div className="flex flex-wrap justify-center items-center gap-6">
                {/* Visa */}
                <div className="h-8 px-3 py-1 bg-card/60 rounded-lg border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors">
                  <svg viewBox="0 0 750 471" className="h-5 w-auto">
                    <path fill="#1A1F71" d="M278.2 334.2L311 138h52.2l-32.8 196.2h-52.2zm246.8-191.4c-10.3-4-26.5-8.4-46.7-8.4-51.5 0-87.8 27.4-88.1 66.6-.3 29 25.9 45.2 45.6 54.8 20.3 9.9 27.1 16.2 27 25-.1 13.5-16.2 19.7-31.2 19.7-20.8 0-31.9-3-49-10.5l-6.7-3.2-7.3 45.1c12.2 5.6 34.7 10.5 58 10.8 54.8 0 90.4-27 90.8-68.9.2-23-13.7-40.4-43.8-54.8-18.2-9.3-29.4-15.5-29.3-25 0-8.4 9.5-17.3 29.9-17.3 17.1-.3 29.5 3.6 39.1 7.7l4.7 2.3 7.1-43.9h-.1zm134.5-4.8h-40.3c-12.5 0-21.8 3.6-27.3 16.7L507 334.2h54.7s8.9-24.8 10.9-30.2h66.9c1.6 7 6.3 30.2 6.3 30.2h48.4L659.5 138zm-64.3 126.6c4.3-11.6 20.9-56.5 20.9-56.5-.3.5 4.3-11.8 6.9-19.4l3.5 17.5s10 48.5 12.1 58.4h-43.4zM241.7 138L190 267.3l-5.5-28.2c-9.6-32.5-39.4-67.7-72.8-85.4l46.7 180.5h55.1l82-196.2h-54.8z"/>
                    <path fill="#F9A533" d="M146.9 138H60.9l-.6 3.5c65.4 16.7 108.7 57.1 126.6 105.6l-18.3-92.9c-3.1-12.7-12.2-16-21.7-16.2z"/>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="h-8 px-3 py-1 bg-card/60 rounded-lg border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors">
                  <svg viewBox="0 0 131.39 86.9" className="h-5 w-auto">
                    <circle fill="#EB001B" cx="43.45" cy="43.45" r="43.45"/>
                    <circle fill="#F79E1B" cx="87.94" cy="43.45" r="43.45"/>
                    <path fill="#FF5F00" d="M65.7 16.2c-10.7 8.4-17.6 21.3-17.6 35.8s6.9 27.4 17.6 35.8c10.7-8.4 17.6-21.3 17.6-35.8S76.4 24.6 65.7 16.2z"/>
                  </svg>
                </div>

                {/* Stripe */}
                <div className="h-8 px-4 py-1 bg-card/60 rounded-lg border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors">
                  <svg viewBox="0 0 60 25" className="h-4 w-auto">
                    <path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.9 10.9 0 0 1-4.56 1c-4.01 0-6.83-2.5-6.83-7.14 0-4.07 2.5-7.19 6.26-7.19 3.76 0 5.94 3.12 5.94 7.14v1.27zm-6-5.73c-1.03 0-2.1.73-2.1 2.24h4.09c0-1.51-.97-2.24-1.99-2.24zM41.7 20.2V1.4l4.15-.88v7.1c.73-.45 1.68-.74 2.8-.74 2.98 0 4.92 2.28 4.92 6.41 0 4.52-2.1 7.14-5.38 7.14-1.31 0-2.5-.45-3.34-1.32l-.18 1.09H41.7zm4.15-8.53v5.13c.49.53 1.23.88 1.99.88 1.51 0 2.47-1.32 2.47-3.76 0-2.24-.89-3.47-2.4-3.47-.76 0-1.51.36-2.06 1.22zM30.52 5.88c1.95 0 3.32.82 4.05 1.64l-.18-1.36h4v14.04h-4l.18-1.4c-.73.86-2.14 1.68-4.09 1.68-3.2 0-5.49-2.55-5.49-7.2 0-4.78 2.43-7.4 5.53-7.4zm1.21 11.05c1.1 0 1.88-.49 2.44-1.21V10.8c-.56-.72-1.33-1.17-2.4-1.17-1.55 0-2.62 1.32-2.62 3.72 0 2.32 1.03 3.58 2.58 3.58zM20.66 2.13v3.65h2.55v3.47h-2.55v5.38c0 1.17.56 1.55 1.36 1.55.41 0 .85-.07 1.19-.19v3.61a7.7 7.7 0 0 1-2.47.41c-2.66 0-4.23-1.4-4.23-4.27V9.25h-1.95V5.78h1.95V2.58l4.15-.45zM7.98 12.09c0-1.36.82-2.1 2.24-2.1.45 0 .96.11 1.36.26V6.27A7.89 7.89 0 0 0 9.51 6c-3.8 0-5.68 2.25-5.68 5.87v.26H1.77v3.47h2.06v4.68h-.07l.07.07v3.85h4.15v-8.6h2.55V12.13h-2.55v-.04z"/>
                  </svg>
                </div>

                {/* Netopia */}
                <div className="h-8 px-3 py-1 bg-card/60 rounded-lg border border-border/50 flex items-center justify-center hover:border-primary/30 transition-colors">
                  <span className="text-xs font-bold text-muted-foreground tracking-wide">NETOPIA</span>
                </div>

                {/* SSL Secure Badge */}
                <div className="h-8 px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/30 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">SSL Secure</span>
                </div>
              </div>
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
