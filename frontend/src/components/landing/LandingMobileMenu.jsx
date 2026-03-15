import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Activity,
  Bell,
  Map,
  Wallet,
  FileText,
  BarChart3,
  Sprout,
  Building2,
  Warehouse,
  Wheat,
  BookOpen,
  PenLine,
  HelpCircle,
  Users,
  Code2,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";

function AccordionSection({ label, icon: Icon, children, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
          isOpen
            ? "text-primary bg-primary/5"
            : "text-foreground hover:bg-primary/5 hover:text-primary"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isOpen
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary/50 text-muted-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-sm">{label}</span>
        </div>
        <Motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-4 pr-2 pb-2 pt-1 space-y-0.5">{children}</div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenuItem({ icon: Icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-primary/5 transition-colors text-left group"
    >
      <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-secondary/40 group-hover:bg-primary/10 group-hover:text-primary text-muted-foreground transition-colors">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          {desc}
        </div>
      </div>
    </button>
  );
}

export default function LandingMobileMenu({
  isOpen,
  onClose,
  onItemClick,
  onAuthCTA,
  isAuthenticated,
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleItemClick = (href, isRoute = false) => {
    if (isRoute || (!href.startsWith("#") && href.startsWith("/"))) {
      navigate(href);
    } else {
      onItemClick(href);
    }
    onClose();
  };

  const handleAuthCTA = () => {
    onAuthCTA();
    onClose();
  };

  const handleSignIn = () => {
    navigate("/auth/login");
    onClose();
  };

  const platformItems = [
    { icon: Activity, title: t("nav.mega.monitoring.title"), desc: t("nav.mega.monitoring.desc"), href: "#features" },
    { icon: Bell, title: t("nav.mega.alerts.title"), desc: t("nav.mega.alerts.desc"), href: "#features" },
    { icon: Map, title: t("nav.mega.mapping.title"), desc: t("nav.mega.mapping.desc"), href: "#features" },
    { icon: Wallet, title: t("nav.mega.financial.title"), desc: t("nav.mega.financial.desc"), href: "#features" },
    { icon: FileText, title: t("nav.mega.reports.title"), desc: t("nav.mega.reports.desc"), href: "#features" },
    { icon: BarChart3, title: t("nav.mega.analytics.title"), desc: t("nav.mega.analytics.desc"), href: "#features" },
  ];

  const solutionItems = [
    { icon: Sprout, title: t("nav.mega.smallFarms.title"), desc: t("nav.mega.smallFarms.desc"), href: "#pricing" },
    { icon: Building2, title: t("nav.mega.mediumFarms.title"), desc: t("nav.mega.mediumFarms.desc"), href: "#pricing" },
    { icon: Warehouse, title: t("nav.mega.largeFarms.title"), desc: t("nav.mega.largeFarms.desc"), href: "#pricing" },
    { icon: Wheat, title: t("nav.mega.crops.title"), desc: t("nav.mega.crops.desc"), href: "#features" },
  ];

  const resourceItems = [
    { icon: BookOpen, title: t("nav.mega.docs.title"), desc: t("nav.mega.docs.desc"), href: "/docs", isRoute: true },
    { icon: PenLine, title: t("nav.mega.blog.title"), desc: t("nav.mega.blog.desc"), href: "/blog", isRoute: true },
    { icon: HelpCircle, title: t("nav.mega.helpCenter.title"), desc: t("nav.mega.helpCenter.desc"), href: "/help", isRoute: true },
    { icon: Users, title: t("nav.mega.community.title"), desc: t("nav.mega.community.desc"), href: "/community", isRoute: true },
    { icon: Code2, title: t("nav.mega.apiDocs.title"), desc: t("nav.mega.apiDocs.desc"), href: "/api-docs", isRoute: true },
    { icon: Cpu, title: t("nav.mega.sensorGuide.title"), desc: t("nav.mega.sensorGuide.desc"), href: "/sensor-guide", isRoute: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <Motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[72px] left-3 right-3 z-50 lg:hidden max-h-[calc(100vh-88px)] overflow-y-auto"
          >
            <div className="glass p-4 shadow-2xl relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-60 pointer-events-none" />

              <div className="relative z-10 space-y-1">
                {/* Platform Accordion */}
                <AccordionSection
                  label={t("nav.mega.platform")}
                  icon={Activity}
                  defaultOpen
                >
                  {platformItems.map((item) => (
                    <MobileMenuItem
                      key={item.title}
                      {...item}
                      onClick={() => handleItemClick(item.href)}
                    />
                  ))}
                </AccordionSection>

                {/* Solutions Accordion */}
                <AccordionSection
                  label={t("nav.mega.solutions")}
                  icon={Sprout}
                >
                  {solutionItems.map((item) => (
                    <MobileMenuItem
                      key={item.title}
                      {...item}
                      onClick={() => handleItemClick(item.href)}
                    />
                  ))}
                </AccordionSection>

                {/* Resources Accordion */}
                <AccordionSection
                  label={t("nav.mega.resources")}
                  icon={BookOpen}
                >
                  {resourceItems.map((item) => (
                    <MobileMenuItem
                      key={item.title}
                      {...item}
                      onClick={() => handleItemClick(item.href, item.isRoute)}
                    />
                  ))}
                </AccordionSection>

                {/* Simple nav links */}
                <button
                  onClick={() => handleItemClick("#pricing")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between"
                >
                  <span>{t("nav.pricing")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                <button
                  onClick={() => handleItemClick("#about")}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between"
                >
                  <span>{t("nav.about")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {/* Divider */}
                <div className="h-px bg-border/20 my-2" />

                {/* Auth CTAs */}
                <div className="space-y-2.5 pt-1">
                  <Button
                    onClick={handleAuthCTA}
                    variant="primary"
                    className="w-full font-semibold"
                  >
                    {isAuthenticated
                      ? t("nav.goToDashboard")
                      : t("nav.getStarted")}
                  </Button>

                  {!isAuthenticated && (
                    <Button
                      onClick={handleSignIn}
                      variant="outline"
                      className="w-full font-semibold"
                    >
                      {t("nav.signIn")}
                    </Button>
                  )}
                </div>

                {/* Tagline */}
                <div className="text-center text-xs text-muted-foreground pt-3 pb-1">
                  {t("hero.badge")}
                </div>
              </div>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
