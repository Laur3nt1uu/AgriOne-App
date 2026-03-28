import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  Shield,
  Wifi,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Settings,
  CreditCard,
  User,
  MapPin,
  Loader2,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import TutorialLibrary from "../../components/documentation/TutorialLibrary";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const faqCategories = [
  {
    id: "getting-started",
    icon: Zap,
    title: { ro: "Început Rapid", en: "Getting Started" },
    questions: [
      {
        q: { ro: "Cum îmi creez un cont?", en: "How do I create an account?" },
        a: {
          ro: "Apasă pe butonul 'Creează Cont' din pagina principală, completează formularul cu emailul și parola dorită, apoi confirmă emailul primit.",
          en: "Click the 'Create Account' button on the main page, fill in the form with your email and desired password, then confirm the email you receive.",
        },
      },
      {
        q: { ro: "Este gratuit să folosesc AgriOne?", en: "Is it free to use AgriOne?" },
        a: {
          ro: "Da! Planul Starter este complet gratuit și include monitorizare pentru 2 terenuri și 5 senzori. Pentru funcționalități avansate, poți trece pe planul Pro.",
          en: "Yes! The Starter plan is completely free and includes monitoring for 2 lands and 5 sensors. For advanced features, you can upgrade to the Pro plan.",
        },
      },
      {
        q: { ro: "Cum adaug primul meu teren?", en: "How do I add my first land?" },
        a: {
          ro: "Din Dashboard, apasă pe 'Terenuri' în meniul lateral, apoi pe butonul 'Adaugă Teren'. Completează numele, suprafața și locația pe hartă.",
          en: "From Dashboard, click on 'Lands' in the sidebar, then the 'Add Land' button. Fill in the name, area and location on the map.",
        },
      },
    ],
  },
  {
    id: "sensors",
    icon: Wifi,
    title: { ro: "Senzori & Conectare", en: "Sensors & Connection" },
    questions: [
      {
        q: { ro: "Ce senzori sunt compatibili?", en: "What sensors are compatible?" },
        a: {
          ro: "AgriOne funcționează cu senzori bazați pe ESP32 sau Arduino. Recomandăm senzori capacitivi pentru umiditate sol și DS18B20 pentru temperatură. Vezi ghidul complet în secțiunea Sensor Guide.",
          en: "AgriOne works with ESP32 or Arduino-based sensors. We recommend capacitive sensors for soil moisture and DS18B20 for temperature. See the complete guide in the Sensor Guide section.",
        },
      },
      {
        q: { ro: "Senzorul meu nu trimite date. Ce fac?", en: "My sensor is not sending data. What should I do?" },
        a: {
          ro: "Verifică: 1) Conexiunea WiFi este stabilă, 2) Codul senzorului este corect introdus în platformă, 3) Senzorul are alimentare suficientă. Dacă problema persistă, contactează suportul.",
          en: "Check: 1) WiFi connection is stable, 2) Sensor code is correctly entered in the platform, 3) Sensor has sufficient power. If the problem persists, contact support.",
        },
      },
      {
        q: { ro: "Cum calibrez senzorii?", en: "How do I calibrate sensors?" },
        a: {
          ro: "Din pagina senzorului, apasă pe 'Calibrare'. Plasează senzorul în sol uscat pentru valoarea minimă, apoi în sol umed pentru valoarea maximă. Salvează setările.",
          en: "From the sensor page, click 'Calibration'. Place the sensor in dry soil for minimum value, then in wet soil for maximum value. Save the settings.",
        },
      },
    ],
  },
  {
    id: "alerts",
    icon: AlertTriangle,
    title: { ro: "Alerte & Notificări", en: "Alerts & Notifications" },
    questions: [
      {
        q: { ro: "Cum setez alertele?", en: "How do I set up alerts?" },
        a: {
          ro: "Din pagina Alerte, apasă pe 'Reguli'. Selectează terenul și setează pragurile pentru temperatură și umiditate. Activează regula și vei primi notificări când valorile ies din limite.",
          en: "From the Alerts page, click 'Rules'. Select the land and set thresholds for temperature and humidity. Activate the rule and you'll receive notifications when values go out of bounds.",
        },
      },
      {
        q: { ro: "Pot primi alerte pe SMS?", en: "Can I receive SMS alerts?" },
        a: {
          ro: "Da, alertele SMS sunt disponibile în planul Pro. Din Profil, activează notificările SMS și adaugă numărul tău de telefon.",
          en: "Yes, SMS alerts are available in the Pro plan. From Profile, enable SMS notifications and add your phone number.",
        },
      },
    ],
  },
  {
    id: "billing",
    icon: CreditCard,
    title: { ro: "Plăți & Abonament", en: "Billing & Subscription" },
    questions: [
      {
        q: { ro: "Cum fac upgrade la Pro?", en: "How do I upgrade to Pro?" },
        a: {
          ro: "Din Profil sau pagina Plan, selectează planul Pro și completează datele de plată. Upgrade-ul este instant și poți începe să folosești funcțiile avansate imediat.",
          en: "From Profile or Plan page, select the Pro plan and complete payment details. Upgrade is instant and you can start using advanced features immediately.",
        },
      },
      {
        q: { ro: "Pot anula oricând?", en: "Can I cancel anytime?" },
        a: {
          ro: "Da, poți anula abonamentul Pro oricând. Vei avea acces la funcțiile Pro până la sfârșitul perioadei plătite, apoi vei reveni automat la planul Starter.",
          en: "Yes, you can cancel your Pro subscription anytime. You'll have access to Pro features until the end of the paid period, then automatically return to Starter plan.",
        },
      },
    ],
  },
  {
    id: "account",
    icon: User,
    title: { ro: "Cont & Securitate", en: "Account & Security" },
    questions: [
      {
        q: { ro: "Cum îmi schimb parola?", en: "How do I change my password?" },
        a: {
          ro: "Din Profil, găsește secțiunea 'Securitate' și apasă pe 'Schimbă Parola'. Introdu parola veche și cea nouă de două ori pentru confirmare.",
          en: "From Profile, find the 'Security' section and click 'Change Password'. Enter your old password and the new one twice for confirmation.",
        },
      },
      {
        q: { ro: "Datele mele sunt în siguranță?", en: "Is my data safe?" },
        a: {
          ro: "Absolut! Folosim criptare end-to-end, respectăm GDPR și nu partajăm datele tale cu terți. Datele sunt stocate securizat în centre de date din UE.",
          en: "Absolutely! We use end-to-end encryption, comply with GDPR and never share your data with third parties. Data is securely stored in EU data centers.",
        },
      },
    ],
  },
];

const supportChannels = [
  {
    icon: Mail,
    title: { ro: "Email", en: "Email" },
    description: { ro: "Răspundem în 24h", en: "Response within 24h" },
    action: { ro: "support@agri-one.com", en: "support@agri-one.com" },
    href: "mailto:support@agri-one.com",
  },
  {
    icon: MessageCircle,
    title: { ro: "Chat Live", en: "Live Chat" },
    description: { ro: "Luni-Vineri, 9-18", en: "Mon-Fri, 9AM-6PM" },
    action: { ro: "Deschide chat", en: "Open chat" },
    href: "#",
  },
  {
    icon: Phone,
    title: { ro: "Telefon", en: "Phone" },
    description: { ro: "Pentru urgențe", en: "For emergencies" },
    action: { ro: "+40 123 456 789", en: "+40 123 456 789" },
    href: "tel:+40123456789",
  },
];

function FAQItem({ question, language, isOpen, onToggle }) {
  const getText = (obj) => obj[language] || obj.en;

  return (
    <div className="border-b border-border/20 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="font-medium group-hover:text-primary transition-colors pr-4">
          {getText(question.q)}
        </span>
        <Motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={18} className="text-muted-foreground" />
        </Motion.div>
      </button>
      <Motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-muted-foreground text-sm leading-relaxed">
          {getText(question.a)}
        </p>
      </Motion.div>
    </div>
  );
}

export default function HelpCenterPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [openFaq, setOpenFaq] = useState(null);

  // Support form state
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getText = (obj) => obj[language] || obj.en;

  const activeQuestions = faqCategories.find((c) => c.id === activeCategory)?.questions || [];

  const filteredQuestions = searchQuery
    ? faqCategories.flatMap((cat) =>
        cat.questions.filter(
          (q) =>
            getText(q.q).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getText(q.a).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : activeQuestions;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const subjectOptions = language === "ro"
    ? ["Problemă cu senzor", "Cont și autentificare", "Plăți și abonament", "Bug / Eroare în aplicație", "Altele"]
    : ["Sensor issue", "Account & authentication", "Billing & subscription", "Bug / App error", "Other"];

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
                <HelpCircle size={14} className="mr-1" />
                {language === "ro" ? "Centru de Ajutor" : "Help Center"}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                {language === "ro" ? "Cum te putem " : "How can we "}
                <span className="text-primary">{language === "ro" ? "ajuta?" : "help?"}</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === "ro"
                  ? "Găsește răspunsuri rapide la întrebările tale sau contactează echipa de suport."
                  : "Find quick answers to your questions or contact our support team."}
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "ro" ? "Caută în întrebări frecvente..." : "Search FAQ..."}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </Motion.div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-8 border-y border-border/30 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-4">
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Motion.a
                    key={index}
                    href={channel.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/60 border border-border/30 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{getText(channel.title)}</div>
                      <div className="text-xs text-muted-foreground">{getText(channel.description)}</div>
                      <div className="text-sm text-primary font-medium mt-1">{getText(channel.action)}</div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </Motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tutorials Section */}
        <section className="py-16 lg:py-24 bg-card/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="primary" className="mb-4">
                <BookOpen size={14} className="mr-1" />
                {language === "ro" ? "Tutoriale" : "Tutorials"}
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                {language === "ro" ? "Ghiduri " : "Step-by-step "}
                <span className="text-primary">{language === "ro" ? "pas cu pas" : "guides"}</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {language === "ro"
                  ? "Învață să folosești AgriOne eficient cu ghidurile noastre detaliate, complete cu capturi de ecran și exemple practice."
                  : "Learn to use AgriOne efficiently with our detailed guides, complete with screenshots and practical examples."}
              </p>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TutorialLibrary language={language} />
            </Motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
              {/* Category Sidebar */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground mb-4">
                  {language === "ro" ? "Categorii" : "Categories"}
                </div>
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSearchQuery("");
                        setOpenFaq(null);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeCategory === category.id && !searchQuery
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-secondary/50 text-foreground"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{getText(category.title)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Questions */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {searchQuery
                      ? `${language === "ro" ? "Rezultate pentru" : "Results for"} "${searchQuery}"`
                      : getText(faqCategories.find((c) => c.id === activeCategory)?.title || { ro: "", en: "" })}
                  </h2>
                  <Badge variant="outline">{filteredQuestions.length} {language === "ro" ? "întrebări" : "questions"}</Badge>
                </div>

                {filteredQuestions.length > 0 ? (
                  <div>
                    {filteredQuestions.map((question, index) => (
                      <FAQItem
                        key={index}
                        question={question}
                        language={language}
                        isOpen={openFaq === index}
                        onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === "ro"
                        ? "Nu am găsit nicio întrebare. Încearcă altă căutare."
                        : "No questions found. Try another search."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24 bg-card/30 border-t border-border/30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Headphones size={40} className="text-primary mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
                {language === "ro" ? "Nu ai găsit răspunsul?" : "Didn't find your answer?"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "Trimite-ne un mesaj și echipa noastră îți răspunde în maxim 24 de ore."
                  : "Send us a message and our team will reply within 24 hours."}
              </p>
            </Motion.div>

            {submitted ? (
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-10 text-center"
              >
                <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {language === "ro" ? "Mesaj trimis!" : "Message sent!"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "ro"
                    ? "Am primit solicitarea ta. Îți vom răspunde în cel mai scurt timp la adresa de email furnizată."
                    : "We received your request. We'll reply as soon as possible to the email you provided."}
                </p>
                <Button variant="ghost" onClick={() => setSubmitted(false)}>
                  {language === "ro" ? "Trimite alt mesaj" : "Send another message"}
                </Button>
              </Motion.div>
            ) : (
              <Motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleFormSubmit}
                className="card p-6 lg:p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ro" ? "Numele tău" : "Your name"}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder={language === "ro" ? "Ion Popescu" : "John Smith"}
                      className="w-full px-4 py-3 rounded-xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === "ro" ? "Email" : "Email"}
                      <span className="text-red-400 ml-1">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="ion@exemplu.ro"
                      className="w-full px-4 py-3 rounded-xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ro" ? "Subiect" : "Subject"}
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-card/80 border border-border/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  >
                    <option value="">
                      {language === "ro" ? "Selectează un subiect..." : "Select a subject..."}
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "ro" ? "Mesaj" : "Message"}
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                    placeholder={
                      language === "ro"
                        ? "Descrie problema sau întrebarea ta cât mai detaliat posibil..."
                        : "Describe your problem or question in as much detail as possible..."
                    }
                    className="w-full px-4 py-3 rounded-xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      {language === "ro" ? "Se trimite..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      {language === "ro" ? "Trimite mesajul" : "Send message"}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {language === "ro"
                    ? "De obicei răspundem în 2–8 ore în zilele lucrătoare."
                    : "We usually respond within 2–8 hours on business days."}
                </p>
              </Motion.form>
            )}
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingLayout>
  );
}
