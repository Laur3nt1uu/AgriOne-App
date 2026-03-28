import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Code2,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  HelpCircle,
  Layers,
  Play,
  Search,
  Settings,
  Wifi,
  Zap,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const docSections = [
  {
    id: "getting-started",
    icon: Play,
    title: { ro: "Primii Pași", en: "Getting Started" },
    description: { ro: "Creează cont și configurează primul teren", en: "Create account and set up your first land" },
    tutorialId: "getting-started",
    articles: [
      { title: { ro: "Crearea contului", en: "Creating your account" }, time: "2 min" },
      { title: { ro: "Adăugarea primului teren", en: "Adding your first land" }, time: "5 min" },
      { title: { ro: "Navigarea în dashboard", en: "Navigating the dashboard" }, time: "3 min" },
      { title: { ro: "Configurarea profilului", en: "Setting up your profile" }, time: "2 min" },
    ],
  },
  {
    id: "sensors",
    icon: Cpu,
    title: { ro: "Configurare Senzori", en: "Sensor Setup" },
    description: { ro: "Conectează și configurează senzorii IoT", en: "Connect and configure IoT sensors" },
    tutorialId: "iot-setup",
    articles: [
      { title: { ro: "Tipuri de senzori compatibili", en: "Compatible sensor types" }, time: "4 min" },
      { title: { ro: "Conectarea senzorului la WiFi", en: "Connecting sensor to WiFi" }, time: "6 min" },
      { title: { ro: "Asocierea senzorului cu terenul", en: "Pairing sensor with land" }, time: "3 min" },
      { title: { ro: "Calibrarea senzorilor", en: "Calibrating sensors" }, time: "5 min" },
    ],
  },
  {
    id: "alerts",
    icon: Zap,
    title: { ro: "Sistem de Alerte", en: "Alert System" },
    description: { ro: "Configurează notificări și reguli de alertă", en: "Set up notifications and alert rules" },
    articles: [
      { title: { ro: "Crearea regulilor de alertă", en: "Creating alert rules" }, time: "4 min" },
      { title: { ro: "Configurarea notificărilor email", en: "Email notification setup" }, time: "3 min" },
      { title: { ro: "Alerte SMS (plan Pro)", en: "SMS alerts (Pro plan)" }, time: "3 min" },
      { title: { ro: "Gestionarea alertelor active", en: "Managing active alerts" }, time: "2 min" },
    ],
  },
  {
    id: "economics",
    icon: FileText,
    title: { ro: "Evidență Financiară", en: "Financial Tracking" },
    description: { ro: "Gestionează veniturile și cheltuielile", en: "Manage income and expenses" },
    articles: [
      { title: { ro: "Adăugarea tranzacțiilor", en: "Adding transactions" }, time: "3 min" },
      { title: { ro: "Rapoarte financiare", en: "Financial reports" }, time: "4 min" },
      { title: { ro: "Export PDF", en: "PDF export" }, time: "2 min" },
      { title: { ro: "Prognoze bugetare", en: "Budget forecasting" }, time: "5 min" },
    ],
  },
  {
    id: "troubleshooting",
    icon: HelpCircle,
    title: { ro: "Depanare", en: "Troubleshooting" },
    description: { ro: "Rezolvă problemele comune", en: "Solve common issues" },
    articles: [
      { title: { ro: "Senzorul nu trimite date", en: "Sensor not sending data" }, time: "4 min" },
      { title: { ro: "Probleme de conectare", en: "Connection issues" }, time: "3 min" },
      { title: { ro: "Erori de autentificare", en: "Authentication errors" }, time: "2 min" },
      { title: { ro: "Contactarea suportului", en: "Contacting support" }, time: "1 min" },
    ],
  },
];

const quickLinks = [
  { icon: Download, label: { ro: "Descarcă firmware", en: "Download firmware" }, href: "#" },
  { icon: Layers, label: { ro: "Diagrame arhitectură", en: "Architecture diagrams" }, href: "#" },
];

export default function DocumentationPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");

  const getText = (obj) => obj[language] || obj.en;

  const handleArticleClick = (section, articleIndex) => {
    // If section has a corresponding tutorial, open it
    if (section.tutorialId) {
      const tutorialPath = section.tutorialId === 'getting-started'
        ? '/tutorials/getting-started-guide.html'
        : '/tutorials/iot-sensor-setup.html';

      window.open(tutorialPath, '_blank', 'noopener,noreferrer');
    } else {
      // For sections without tutorials, navigate to Help Center
      navigate('/help');
    }
  };

  const filteredSections = docSections.filter(section => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      getText(section.title).toLowerCase().includes(query) ||
      getText(section.description).toLowerCase().includes(query) ||
      section.articles.some(a => getText(a.title).toLowerCase().includes(query))
    );
  });

  return (
    <LandingLayout>
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                {language === "ro" ? "Înapoi la pagina principală" : "Back to home"}
              </button>

              <Badge variant="primary" className="mb-4">
                <BookOpen size={14} className="mr-1" />
                {language === "ro" ? "Documentație" : "Documentation"}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                {language === "ro" ? "Centrul de " : "Knowledge "}
                <span className="text-primary">{language === "ro" ? "Cunoștințe" : "Center"}</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === "ro"
                  ? "Ghiduri complete, tutoriale pas cu pas și documentație tehnică pentru a te ajuta să folosești AgriOne la maximum."
                  : "Complete guides, step-by-step tutorials and technical documentation to help you get the most out of AgriOne."}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "ro" ? "Caută în documentație..." : "Search documentation..."}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </Motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 border-y border-border/30 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Motion.a
                    key={index}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/60 border border-border/30 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                  >
                    <Icon size={16} />
                    {getText(link.label)}
                    <ExternalLink size={12} className="opacity-50" />
                  </Motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Documentation Layout */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[260px_1fr] gap-8">

              {/* Sidebar */}
              <div className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                  {language === "ro" ? "Secțiuni" : "Sections"}
                </div>
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-secondary/50 text-foreground"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                      <span className="font-medium text-sm">{getText(section.title)}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{section.articles.length}</span>
                    </button>
                  );
                })}

                {filteredSections.length === 0 && (
                  <p className="text-sm text-muted-foreground px-2 py-4">
                    {language === "ro" ? "Niciun rezultat." : "No results."}
                  </p>
                )}
              </div>

              {/* Content Panel */}
              {(() => {
                const section = docSections.find((s) => s.id === activeSection);
                if (!section) return null;
                const Icon = section.icon;
                return (
                  <Motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="card p-6 lg:p-8"
                  >
                    {/* Section header */}
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={28} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold mb-1">{getText(section.title)}</h2>
                        <p className="text-muted-foreground">{getText(section.description)}</p>
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="space-y-2 mb-8">
                      {section.articles.map((article, index) => (
                        <Motion.div
                          key={index}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleArticleClick(section, index)}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition-colors group cursor-pointer border border-transparent hover:border-border/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center text-xs font-bold text-primary">
                              {index + 1}
                            </div>
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {getText(article.title)}
                            </span>
                            {section.tutorialId && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {language === "ro" ? "Tutorial" : "Tutorial"}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {article.time}
                            </span>
                            {section.tutorialId ? (
                              <ExternalLink size={14} className="group-hover:text-primary transition-colors" />
                            ) : (
                              <ChevronRight size={14} className="group-hover:text-primary transition-colors" />
                            )}
                          </div>
                        </Motion.div>
                      ))}
                    </div>

                    {/* Section-specific CTA */}
                    {section.id === "troubleshooting" && (
                      <div className="pt-4 border-t border-border/20">
                        <Button onClick={() => navigate("/help")} variant="primary">
                          <HelpCircle size={16} className="mr-2" />
                          {language === "ro" ? "Mergi la Centrul de Ajutor" : "Go to Help Center"}
                        </Button>
                      </div>
                    )}
                  </Motion.div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="card p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
                <HelpCircle size={48} className="text-primary mx-auto mb-6" />
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
                  {language === "ro" ? "Nu găsești ce cauți?" : "Can't find what you're looking for?"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  {language === "ro"
                    ? "Echipa noastră de suport te poate ajuta. Contactează-ne și îți răspundem în cel mai scurt timp."
                    : "Our support team can help. Contact us and we'll get back to you as soon as possible."}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => navigate("/auth/register")} variant="primary">
                    {language === "ro" ? "Contactează suportul" : "Contact support"}
                  </Button>
                  <Button onClick={() => navigate("/")} variant="ghost">
                    {language === "ro" ? "Înapoi acasă" : "Back to home"}
                  </Button>
                </div>
              </div>
            </Motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingLayout>
  );
}
