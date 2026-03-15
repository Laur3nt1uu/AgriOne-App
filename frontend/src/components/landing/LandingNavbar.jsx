import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
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
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { authStore } from "../../auth/auth.store";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Button } from "../../ui/button";
import logo from "../../assets/agrione.png";
import LandingMobileMenu from "./LandingMobileMenu";

function MegaMenuItem({ icon: Icon, title, desc, href, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-4 rounded-xl hover:bg-primary/5 transition-all duration-200 text-left w-full group min-h-[60px]"
    >
      <div
        className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          accent
            ? "bg-primary/10 text-primary group-hover:bg-primary/20"
            : "bg-secondary/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        }`}
      >
        <Icon className="w-[20px] h-[20px]" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {desc}
        </div>
      </div>
    </button>
  );
}

function MegaDropdown({ children, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
        >
          <Motion.div
            className="bg-card/90 backdrop-blur-3xl border border-border/20 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden"
            initial={{ boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
            animate={{ boxShadow: "0 32px 80px rgba(0,0,0,0.18)" }}
          >
            {/* Enhanced top accent bar with gradient */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/60 via-blue-500/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-blue-500/5 pointer-events-none opacity-60" />
            <div className="relative z-10">
              {children}
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const isAuthenticated = authStore.isAuthed();
  const { t, language, toggleLanguage } = useLanguage();

  const handleAuthCTA = () => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    } else {
      navigate("/auth/login", {
        state: { from: { pathname: "/app/dashboard" } },
      });
    }
  };

  const handleSmoothScroll = (href, isRoute = false) => {
    setOpenDropdown(null);
    if (isRoute || (!href.startsWith("#") && href.startsWith("/"))) {
      navigate(href);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDropdownEnter = useCallback((key) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(key);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => setOpenDropdown(null);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Mega-menu data structures
  const platformItems = [
    {
      icon: Activity,
      title: t("nav.mega.monitoring.title"),
      desc: t("nav.mega.monitoring.desc"),
      href: "#features",
      accent: true,
    },
    {
      icon: Bell,
      title: t("nav.mega.alerts.title"),
      desc: t("nav.mega.alerts.desc"),
      href: "#features",
    },
    {
      icon: Map,
      title: t("nav.mega.mapping.title"),
      desc: t("nav.mega.mapping.desc"),
      href: "#features",
    },
    {
      icon: Wallet,
      title: t("nav.mega.financial.title"),
      desc: t("nav.mega.financial.desc"),
      href: "#features",
    },
    {
      icon: FileText,
      title: t("nav.mega.reports.title"),
      desc: t("nav.mega.reports.desc"),
      href: "#features",
    },
    {
      icon: BarChart3,
      title: t("nav.mega.analytics.title"),
      desc: t("nav.mega.analytics.desc"),
      href: "#features",
    },
  ];

  const solutionItems = [
    {
      icon: Sprout,
      title: t("nav.mega.smallFarms.title"),
      desc: t("nav.mega.smallFarms.desc"),
      href: "#pricing",
      accent: true,
    },
    {
      icon: Building2,
      title: t("nav.mega.mediumFarms.title"),
      desc: t("nav.mega.mediumFarms.desc"),
      href: "#pricing",
    },
    {
      icon: Warehouse,
      title: t("nav.mega.largeFarms.title"),
      desc: t("nav.mega.largeFarms.desc"),
      href: "#pricing",
    },
    {
      icon: Wheat,
      title: t("nav.mega.crops.title"),
      desc: t("nav.mega.crops.desc"),
      href: "#features",
    },
  ];

  const resourceItems = [
    {
      icon: BookOpen,
      title: t("nav.mega.docs.title"),
      desc: t("nav.mega.docs.desc"),
      href: "/docs",
      isRoute: true,
    },
    {
      icon: PenLine,
      title: t("nav.mega.blog.title"),
      desc: t("nav.mega.blog.desc"),
      href: "/blog",
      isRoute: true,
    },
    {
      icon: HelpCircle,
      title: t("nav.mega.helpCenter.title"),
      desc: t("nav.mega.helpCenter.desc"),
      href: "/help",
      isRoute: true,
      accent: true,
    },
    {
      icon: Users,
      title: t("nav.mega.community.title"),
      desc: t("nav.mega.community.desc"),
      href: "/community",
      isRoute: true,
    },
  ];

  const megaMenuItems = [
    {
      key: "platform",
      label: t("nav.mega.platform"),
      items: platformItems,
    },
    {
      key: "solutions",
      label: t("nav.mega.solutions"),
      items: solutionItems,
    },
    {
      key: "resources",
      label: t("nav.mega.resources"),
      items: resourceItems,
    },
  ];

  // Simple nav items (no dropdown)
  const simpleNavItems = [
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.about"), href: "#about" },
  ];

  return (
    <>
      <Motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-card/60 backdrop-blur-3xl border-b border-border/30 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
      >
        {/* Enhanced gradient overlay with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-transparent via-transparent to-blue-500/8 opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-transparent pointer-events-none" />

        {/* Enhanced border effect */}
        <Motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60"
          animate={{
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Enhanced shimmer effect with multiple colors */}
        <Motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15), transparent)",
            backgroundSize: "300% 100%",
          }}
        />

        <div
          ref={navRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <Motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <Motion.div
                className="w-10 h-10 rounded-xl overflow-hidden relative ring-1 ring-primary/20"
                whileHover={{
                  rotate: [0, -2, 2, 0],
                  scale: 1.1
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgb(var(--primary) / 0.15)",
                    "0 0 40px rgb(var(--primary) / 0.35)",
                    "0 0 60px rgb(var(--primary) / 0.25)",
                    "0 0 20px rgb(var(--primary) / 0.15)",
                  ],
                }}
                transition={{
                  boxShadow: { duration: 4, repeat: Infinity },
                  rotate: { duration: 0.5 },
                  scale: { duration: 0.2 }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={logo}
                  alt="AgriOne"
                  className="w-full h-full object-cover relative z-10"
                />
              </Motion.div>
              <Motion.span
                className="text-xl font-bold bg-gradient-to-r from-foreground via-primary/90 to-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-blue-500 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                AgriOne
              </Motion.span>
            </Motion.button>

            {/* Desktop Navigation - Fixed breakpoint */}
            <nav className="hidden md:flex items-center gap-1">
              {megaMenuItems.map((menu, index) => (
                <div
                  key={menu.key}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(menu.key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      openDropdown === menu.key
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                    }`}
                  >
                    {menu.label}
                    <Motion.div
                      animate={{ rotate: openDropdown === menu.key ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Motion.div>
                  </Motion.button>

                  {/* Platform Mega Dropdown */}
                  {menu.key === "platform" && (
                    <MegaDropdown isOpen={openDropdown === "platform"}>
                      <div className="w-full max-w-[640px] sm:w-[640px] p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {t("nav.mega.platform")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            — {t("nav.mega.platformDesc")}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {platformItems.map((item) => (
                            <MegaMenuItem
                              key={item.title}
                              {...item}
                              onClick={() => handleSmoothScroll(item.href)}
                            />
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/10">
                          <button
                            onClick={() => handleSmoothScroll("#features")}
                            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
                          >
                            {t("features.learnMore")}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </MegaDropdown>
                  )}

                  {/* Solutions Mega Dropdown */}
                  {menu.key === "solutions" && (
                    <MegaDropdown isOpen={openDropdown === "solutions"}>
                      <div className="w-full max-w-[480px] sm:w-[480px] p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                            <Sprout className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {t("nav.mega.solutions")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            — {t("nav.mega.solutionsDesc")}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {solutionItems.map((item) => (
                            <MegaMenuItem
                              key={item.title}
                              {...item}
                              onClick={() => handleSmoothScroll(item.href)}
                            />
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-border/10">
                          <button
                            onClick={() => handleSmoothScroll("#pricing")}
                            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
                          >
                            {t("nav.pricing")}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </MegaDropdown>
                  )}

                  {/* Resources Mega Dropdown */}
                  {menu.key === "resources" && (
                    <MegaDropdown isOpen={openDropdown === "resources"}>
                      <div className="w-full max-w-[720px] sm:w-[720px] p-5">
                        <div className="flex gap-5">
                          {/* Left column — resource links */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                {t("nav.mega.resources")}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                — {t("nav.mega.resourcesDesc")}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              {resourceItems.map((item) => (
                                <MegaMenuItem
                                  key={item.title}
                                  {...item}
                                  onClick={() =>
                                    handleSmoothScroll(item.href, item.isRoute)
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          {/* Right column — featured article card */}
                          <div className="w-56 flex-shrink-0 pl-5 border-l border-border/10">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                              {t("nav.mega.featuredPost")}
                            </span>
                            <div className="mt-3 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 border border-primary/10">
                              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                                <Wheat className="w-4 h-4 text-primary" />
                              </div>
                              <h4 className="text-sm font-semibold text-foreground leading-snug mb-1.5">
                                {t("nav.mega.featuredPostTitle")}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                {t("nav.mega.featuredPostDesc")}
                              </p>
                              <button
                                onClick={() => handleSmoothScroll("/blog", true)}
                                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
                              >
                                {t("nav.mega.readMore")}
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </MegaDropdown>
                  )}
                </div>
              ))}

              {/* Simple nav items (no dropdown) */}
              {simpleNavItems.map((item, index) => (
                <Motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 * (megaMenuItems.length + index + 1),
                  }}
                  onClick={() => handleSmoothScroll(item.href)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-200"
                >
                  {item.label}
                </Motion.button>
              ))}
            </nav>

            {/* Desktop CTA + Language Toggle - Fixed breakpoint */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Enhanced Language Toggle */}
              <Motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="relative flex items-center h-9 rounded-xl bg-secondary/60 backdrop-blur-sm border border-border/40 p-1 text-xs font-semibold shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <span
                  className={`relative z-10 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    language === "ro"
                      ? "text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  RO
                </span>
                <span
                  className={`relative z-10 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    language === "en"
                      ? "text-primary-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  EN
                </span>
                <Motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-primary to-primary/90 shadow-md"
                  animate={{
                    left: language === "ro" ? "4px" : "calc(50%)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              </Motion.button>

              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={handleAuthCTA}
                  variant="primary"
                  className="font-semibold text-sm"
                >
                  {isAuthenticated
                    ? t("nav.goToDashboard")
                    : t("nav.getStarted")}
                </Button>
              </Motion.div>

              {isAuthenticated && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Motion.span
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-blue-500/20 border border-primary/30 flex items-center justify-center relative overflow-hidden"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10 animate-pulse" />
                    <span className="text-foreground font-bold text-sm relative z-10">
                      {(authStore.getUser()?.name || authStore.getUser()?.username || "U")[0].toUpperCase()}
                    </span>
                  </Motion.span>
                  <span className="text-sm font-medium text-foreground/90 max-w-[120px] truncate">
                    {authStore.getUser()?.name || authStore.getUser()?.username || "User"}
                  </span>
                </Motion.div>
              )}

              {!isAuthenticated && (
                <Motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => navigate("/auth/login")}
                    variant="ghost"
                    className="font-semibold text-sm"
                  >
                    {t("nav.signIn")}
                  </Button>
                </Motion.div>
              )}
            </div>

            {/* Mobile: Language Toggle + Menu Button - Fixed breakpoint */}
            <div className="flex md:hidden items-center gap-2">
              <Motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLanguage}
                className="px-2 py-1 rounded-lg bg-secondary/50 border border-border/50 text-xs font-bold text-foreground"
              >
                {language === "ro" ? "RO" : "EN"}
              </Motion.button>

              <Motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all relative group"
              >
                <Motion.div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </Motion.div>
              </Motion.button>
            </div>
          </div>
        </div>
      </Motion.header>

      {/* Mobile Menu */}
      <LandingMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onItemClick={handleSmoothScroll}
        onAuthCTA={handleAuthCTA}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
