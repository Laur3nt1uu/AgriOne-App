import { useState, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  MessageSquare,
  ThumbsUp,
  Trophy,
  User,
  Users,
  Wheat,
  Sprout,
  TrendingUp,
  Award,
  Target,
  Zap,
  UserPlus,
  Globe,
  Handshake,
  X,
  Send,
  Filter,
  ChevronDown,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const communityStats = [
  { value: "2,500+", label: { ro: "Fermieri Activi", en: "Active Farmers" }, icon: Users },
  { value: "150+", label: { ro: "Discuții Lunare", en: "Monthly Discussions" }, icon: MessageSquare },
  { value: "98%", label: { ro: "Satisfacție", en: "Satisfaction" }, icon: Heart },
  { value: "42", label: { ro: "Județe Acoperite", en: "Counties Covered" }, icon: MapPin },
];

const topContributors = [
  { name: "Ion Popescu", location: "Brăila", avatar: "IP", points: 2450, badge: { ro: "Expert Senzori", en: "Sensor Expert" }, color: "bg-yellow-500" },
  { name: "Maria Ionescu", location: "Cluj", avatar: "MI", points: 1890, badge: { ro: "Ajutor Activ", en: "Active Helper" }, color: "bg-blue-500" },
  { name: "Andrei Moldovan", location: "Timiș", avatar: "AM", points: 1650, badge: { ro: "Fermier Inovator", en: "Innovative Farmer" }, color: "bg-green-500" },
  { name: "Elena Dumitrescu", location: "Iași", avatar: "ED", points: 1420, badge: { ro: "Specialist Culturi", en: "Crop Specialist" }, color: "bg-purple-500" },
];

const forumTopics = [
  {
    id: 1,
    title: { ro: "Cum am crescut recolta cu 30% folosind senzori", en: "How I increased yield by 30% using sensors" },
    author: "Ion Popescu",
    location: "Brăila",
    replies: 24,
    likes: 89,
    category: "success",
    categoryLabel: { ro: "Povești de Succes", en: "Success Stories" },
    time: "2h",
    hot: true,
    body: {
      ro: "Acum 2 ani eram sceptic față de tehnologia IoT în agricultură. Costurile mi se păreau prea mari și nu eram convins că merită. Dar după primul sezon cu senzori AgriOne, am văzut o reducere de 35% la consumul de apă și o creștere de 30% a recoltei de porumb.\n\nSecretul? Datele în timp real mi-au permis să irig exact când solul o cerea, nu după un orar fix. Plus, alertele de temperatură m-au ajutat să evit daunele de îngheț de primăvară de două ori.\n\nInvestiția s-a amortizat în primul sezon. Acum am senzori pe toate cele 4 terenuri.",
      en: "Two years ago I was skeptical about IoT technology in agriculture. The costs seemed too high and I wasn't convinced it was worth it. But after the first season with AgriOne sensors, I saw a 35% reduction in water consumption and a 30% increase in corn yield.\n\nThe secret? Real-time data allowed me to irrigate exactly when the soil needed it, not on a fixed schedule. Plus, temperature alerts helped me avoid late spring frost damage twice.\n\nThe investment paid off in the first season. Now I have sensors on all 4 fields.",
    },
    comments: [
      { author: "Maria Ionescu", avatar: "MI", color: "bg-blue-500", time: "1h", text: { ro: "Exact aceeași experiență! Porumbul meu a crescut cu 25% în primul an.", en: "Exact same experience! My corn grew 25% in the first year." } },
      { author: "Gheorghe Marin", avatar: "GM", color: "bg-orange-500", time: "45min", text: { ro: "Ce model de senzori folosești? Mă gândesc să fac același lucru.", en: "What sensor model do you use? I'm thinking of doing the same." } },
      { author: "Ion Popescu", avatar: "IP", color: "bg-yellow-500", time: "30min", text: { ro: "Folosesc senzori capacitivi conectați la ESP32. Ghidul complet e în secțiunea Sensor Guide.", en: "I use capacitive sensors connected to ESP32. Full guide is in the Sensor Guide section." } },
    ],
  },
  {
    id: 2,
    title: { ro: "Cele mai bune culturi pentru irigație automată", en: "Best crops for automatic irrigation" },
    author: "Maria Ionescu",
    location: "Cluj",
    replies: 18,
    likes: 45,
    category: "tips",
    categoryLabel: { ro: "Sfaturi", en: "Tips" },
    time: "5h",
    hot: false,
    body: {
      ro: "După 3 ani de experiență cu irigația automată bazată pe senzori, pot spune că nu toate culturile beneficiază în egală măsură.\n\nTop culturi pentru irigație automată:\n1. Legume (roșii, ardei, castraveți) - economie de apă 50-60%\n2. Capsuni și fructe de pădure - calitate superioară\n3. Porumb - creștere recoltă 20-35%\n4. Soia - foarte sensibilă la stresul hidric\n\nCulturile mai puțin potrivite: cereale de toamnă (grâu, orz) - sunt mai reziliente și ROI-ul senzorilor e mai mic.",
      en: "After 3 years of experience with sensor-based automatic irrigation, I can say not all crops benefit equally.\n\nTop crops for automatic irrigation:\n1. Vegetables (tomatoes, peppers, cucumbers) - 50-60% water savings\n2. Strawberries and berries - superior quality\n3. Corn - 20-35% yield increase\n4. Soy - very sensitive to water stress\n\nLess suitable crops: autumn cereals (wheat, barley) - they are more resilient and sensor ROI is lower.",
    },
    comments: [
      { author: "Andrei Moldovan", avatar: "AM", color: "bg-green-500", time: "4h", text: { ro: "Confirmăm pentru căpșuni — diferența de calitate e vizibilă la prima recoltă.", en: "Confirmed for strawberries — the quality difference is visible at the first harvest." } },
      { author: "Elena Dumitrescu", avatar: "ED", color: "bg-purple-500", time: "3h", text: { ro: "La soia am văzut reduceri de 40% la consum de apă cu senzori. Merită investiția!", en: "For soy I saw 40% reductions in water consumption with sensors. Worth the investment!" } },
    ],
  },
  {
    id: 3,
    title: { ro: "Problemă senzor ESP32 - nu se conectează la WiFi", en: "ESP32 sensor issue - won't connect to WiFi" },
    author: "Andrei Moldovan",
    location: "Timiș",
    replies: 12,
    likes: 8,
    category: "support",
    categoryLabel: { ro: "Suport Tehnic", en: "Tech Support" },
    time: "1d",
    hot: false,
    body: {
      ro: "Bună ziua, am o problemă cu un senzor ESP32 nou pe care încerc să îl conectez la platforma AgriOne. Senzorul pornește, LED-ul clipește, dar nu apare în lista de senzori disponibili.\n\nCe am încercat:\n- Resetare completă (buton BOOT + EN)\n- Verificat credențialele WiFi\n- Rutat firmware-ul din nou\n\nRețeaua WiFi funcționează pentru alte dispozitive. Ce ar putea fi problema?",
      en: "Hello, I have a problem with a new ESP32 sensor I'm trying to connect to the AgriOne platform. The sensor starts, LED blinks, but it doesn't appear in the available sensor list.\n\nWhat I tried:\n- Full reset (BOOT + EN button)\n- Checked WiFi credentials\n- Re-flashed firmware\n\nThe WiFi network works for other devices. What could be the problem?",
    },
    comments: [
      { author: "Ion Popescu", avatar: "IP", color: "bg-yellow-500", time: "23h", text: { ro: "Verifică dacă rețeaua ta este 2.4GHz. ESP32 nu se conectează la 5GHz!", en: "Check if your network is 2.4GHz. ESP32 doesn't connect to 5GHz!" } },
      { author: "AgriOne Support", avatar: "AS", color: "bg-primary", time: "20h", text: { ro: "Corect! ESP32 suportă doar WiFi 2.4GHz. Asigurați-vă că routerul transmite pe 2.4GHz și nu doar pe 5GHz.", en: "Correct! ESP32 only supports 2.4GHz WiFi. Make sure your router broadcasts on 2.4GHz and not only on 5GHz." } },
      { author: "Andrei Moldovan", avatar: "AM", color: "bg-green-500", time: "18h", text: { ro: "Asta era! Am activat 2.4GHz pe router și funcționează perfect. Mulțumesc!", en: "That was it! I enabled 2.4GHz on the router and it works perfectly. Thank you!" } },
    ],
  },
  {
    id: 4,
    title: { ro: "Ghid: Pregătirea terenului pentru primăvară", en: "Guide: Preparing land for spring" },
    author: "Elena Dumitrescu",
    location: "Iași",
    replies: 31,
    likes: 67,
    category: "guides",
    categoryLabel: { ro: "Ghiduri", en: "Guides" },
    time: "2d",
    hot: true,
    body: {
      ro: "Primăvara se pregătește iarna. Iată ghidul meu complet pentru pregătirea terenului:\n\n**Noiembrie - Decembrie:**\n- Arătură de toamnă la 25-30cm adâncime\n- Analiză sol (pH, NPK, materie organică)\n- Aplicare amendamente calcaroase dacă pH < 6\n\n**Ianuarie - Februarie:**\n- Planificarea rotației culturilor\n- Comandarea semințelor și inputurilor\n- Calibrarea senzorilor AgriOne\n\n**Martie:**\n- Pregătirea patului germinativ\n- Fertilizare de bază fosforo-potasică\n- Verificarea sistemului de irigații\n\nCu senzorii AgriOne monitorizez temperatura solului din 1 martie și semăn exact când atinge 10°C.",
      en: "Spring is prepared in winter. Here is my complete guide for land preparation:\n\n**November - December:**\n- Autumn plowing at 25-30cm depth\n- Soil analysis (pH, NPK, organic matter)\n- Application of limestone amendments if pH < 6\n\n**January - February:**\n- Crop rotation planning\n- Ordering seeds and inputs\n- AgriOne sensor calibration\n\n**March:**\n- Germination bed preparation\n- Basic phosphorus-potassium fertilization\n- Irrigation system check\n\nWith AgriOne sensors I monitor soil temperature from March 1st and sow exactly when it reaches 10°C.",
    },
    comments: [
      { author: "Ion Popescu", avatar: "IP", color: "bg-yellow-500", time: "2d", text: { ro: "Ghid excelent! Analiza solului în toamnă e cheia — eu am corectat pH-ul și am câștigat 15% la recoltă.", en: "Excellent guide! Autumn soil analysis is key — I corrected pH and gained 15% in yield." } },
      { author: "Maria Ionescu", avatar: "MI", color: "bg-blue-500", time: "1d", text: { ro: "Adaug: verificați și drenajul câmpului după topirea zăpezii. Stagnarea apei distruge cultura.", en: "I add: also check field drainage after snow melts. Standing water destroys the crop." } },
    ],
  },
  {
    id: 5,
    title: { ro: "Experiența mea cu subvențiile APIA 2024", en: "My experience with APIA subsidies 2024" },
    author: "Gheorghe Marin",
    location: "Dolj",
    replies: 15,
    likes: 34,
    category: "apia",
    categoryLabel: { ro: "APIA", en: "APIA" },
    time: "3d",
    hot: false,
    body: {
      ro: "Am trecut prin procesul APIA 2024 și vreau să împart câteva sfaturi practice pe care le-am învățat pe pielea mea.\n\n**Ce a mers bine:**\n- Depunerea online prin portalul apia.org.ro — rapid și simplu\n- Funcția APIA din AgriOne m-a ajutat să calculez suprafețele exacte\n- Am primit plata de bază în noiembrie\n\n**Ce a fost complicat:**\n- Eco-schemele necesită documentație suplimentară — nu uitați să păstrați facturile pentru inputuri\n- Terenurile arendate necesită contracte actualizate\n\n**Sfat important:** Nu așteptați ultima zi! Sistemul APIA se supraîncarcă în mai. Depuneți în aprilie.",
      en: "I went through the APIA 2024 process and want to share some practical tips I learned the hard way.\n\n**What went well:**\n- Online submission through apia.org.ro portal — fast and simple\n- The APIA function in AgriOne helped me calculate exact areas\n- I received the base payment in November\n\n**What was complicated:**\n- Eco-schemes require additional documentation — don't forget to keep invoices for inputs\n- Leased land requires updated contracts\n\n**Important tip:** Don't wait until the last day! The APIA system overloads in May. Submit in April.",
    },
    comments: [
      { author: "Elena Dumitrescu", avatar: "ED", color: "bg-purple-500", time: "3d", text: { ro: "Confirmat pentru sfatul cu depunerea timpurie. Am depus pe 3 Mai și n-am avut nicio problemă.", en: "Confirmed for the early submission tip. I submitted on May 3rd and had no problems." } },
      { author: "Andrei Moldovan", avatar: "AM", color: "bg-green-500", time: "2d", text: { ro: "Funcția APIA din AgriOne chiar ajută mult — calculează automat plățile estimate pe baza terenurilor.", en: "The APIA function in AgriOne really helps a lot — automatically calculates estimated payments based on plots." } },
    ],
  },
];

const categories = [
  { id: "all", icon: MessageCircle, label: { ro: "Toate", en: "All" } },
  { id: "success", icon: Trophy, label: { ro: "Povești de Succes", en: "Success Stories" } },
  { id: "tips", icon: Zap, label: { ro: "Sfaturi", en: "Tips" } },
  { id: "guides", icon: Wheat, label: { ro: "Ghiduri", en: "Guides" } },
  { id: "support", icon: MessageSquare, label: { ro: "Suport Tehnic", en: "Tech Support" } },
  { id: "apia", icon: TrendingUp, label: { ro: "APIA", en: "APIA" } },
];

const upcomingEvents = [
  { title: { ro: "Webinar: IoT în Agricultură", en: "Webinar: IoT in Agriculture" }, date: "25 Mar 2024", time: "18:00", type: { ro: "Online", en: "Online" }, attendees: 156 },
  { title: { ro: "Întâlnire Fermieri Muntenia", en: "Muntenia Farmers Meetup" }, date: "2 Apr 2024", time: "10:00", type: { ro: "București", en: "Bucharest" }, attendees: 45 },
  { title: { ro: "Workshop Senzori DIY", en: "DIY Sensors Workshop" }, date: "15 Apr 2024", time: "14:00", type: { ro: "Online", en: "Online" }, attendees: 89 },
];

const romaniaRegions = [
  { name: { ro: "Muntenia", en: "Muntenia" }, counties: "Brăila, Buzău, Ialomița, Ilfov, Prahova, Giurgiu, Teleorman, Călărași, Dâmbovița", farmers: 680, mainCrops: { ro: "Grâu, Porumb, Floarea-soarelui", en: "Wheat, Corn, Sunflower" }, color: "from-yellow-500/20 to-yellow-600/5", border: "border-yellow-500/20", icon: "🌾" },
  { name: { ro: "Moldova", en: "Moldova" }, counties: "Iași, Bacău, Suceava, Neamț, Botoșani, Vaslui, Galați, Vrancea", farmers: 510, mainCrops: { ro: "Porumb, Cartofi, Sfeclă", en: "Corn, Potatoes, Sugar beet" }, color: "from-green-500/20 to-green-600/5", border: "border-green-500/20", icon: "🥔" },
  { name: { ro: "Transilvania", en: "Transylvania" }, counties: "Cluj, Brașov, Sibiu, Mureș, Alba, Harghita, Covasna, Bistrița-Năsăud", farmers: 430, mainCrops: { ro: "Grâu, Cartof, Fructe", en: "Wheat, Potatoes, Fruits" }, color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", icon: "🍎" },
  { name: { ro: "Oltenia", en: "Oltenia" }, counties: "Dolj, Gorj, Mehedinți, Olt, Vâlcea", farmers: 310, mainCrops: { ro: "Porumb, Legume, Tutun", en: "Corn, Vegetables, Tobacco" }, color: "from-orange-500/20 to-orange-600/5", border: "border-orange-500/20", icon: "🌽" },
  { name: { ro: "Banat & Crișana", en: "Banat & Crișana" }, counties: "Timiș, Arad, Caraș-Severin, Bihor, Satu Mare", farmers: 295, mainCrops: { ro: "Grâu, Soia, Rapiță", en: "Wheat, Soy, Rapeseed" }, color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20", icon: "🌿" },
  { name: { ro: "Dobrogea", en: "Dobrogea" }, counties: "Constanța, Tulcea", farmers: 185, mainCrops: { ro: "Grâu, Orz, Floarea-soarelui", en: "Wheat, Barley, Sunflower" }, color: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/20", icon: "🌻" },
];

const joinSteps = [
  { icon: UserPlus, title: { ro: "Creează cont gratuit", en: "Create a free account" }, desc: { ro: "Înregistrare rapidă fără card bancar. Planul Starter este permanent gratuit.", en: "Quick registration without a credit card. Starter plan is free forever." } },
  { icon: Globe, title: { ro: "Selectează județul tău", en: "Select your county" }, desc: { ro: "Te conectăm automat cu fermieri din zona ta pentru recomandări locale relevante.", en: "We automatically connect you with farmers in your area for relevant local recommendations." } },
  { icon: Handshake, title: { ro: "Conectează-te și crește", en: "Connect and grow" }, desc: { ro: "Discută, întreabă și împărtășește experiența ta. Comunitatea AgriOne te susține.", en: "Discuss, ask and share your experience. The AgriOne community supports you." } },
];

export default function CommunityPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const forumRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [likedTopics, setLikedTopics] = useState(new Set());

  const getText = (obj) => obj[language] || obj.en;

  const filteredTopics = activeCategory === "all"
    ? forumTopics
    : forumTopics.filter((t) => t.category === activeCategory);

  const scrollToForum = () => {
    forumRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleLike = (topicId, e) => {
    e.stopPropagation();
    setLikedTopics((prev) => {
      const next = new Set(prev);
      next.has(topicId) ? next.delete(topicId) : next.add(topicId);
      return next;
    });
  };

  return (
    <LandingLayout>
      <LandingNavbar />

      {/* Topic Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTopic(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-card border border-border/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between p-6 border-b border-border/20">
                <div className="flex-1 pr-4">
                  <Badge variant="default" className="text-xs mb-2">
                    {getText(selectedTopic.categoryLabel)}
                  </Badge>
                  <h2 className="font-extrabold text-lg leading-snug">
                    {getText(selectedTopic.title)}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={12} />{selectedTopic.author}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} />{selectedTopic.location}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{selectedTopic.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Post body */}
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
                  {getText(selectedTopic.body)}
                </p>

                {/* Like row */}
                <div className="flex items-center gap-4 py-3 border-y border-border/20">
                  <button
                    onClick={(e) => toggleLike(selectedTopic.id, e)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      likedTopics.has(selectedTopic.id) ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ThumbsUp size={16} />
                    {selectedTopic.likes + (likedTopics.has(selectedTopic.id) ? 1 : 0)} {language === "ro" ? "aprecieri" : "likes"}
                  </button>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare size={16} />
                    {selectedTopic.comments.length} {language === "ro" ? "răspunsuri" : "replies"}
                  </span>
                </div>

                {/* Comments */}
                <div>
                  <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                    {language === "ro" ? "Răspunsuri" : "Replies"}
                  </h3>
                  <div className="space-y-4">
                    {selectedTopic.comments.map((comment, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full ${comment.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {comment.avatar}
                        </div>
                        <div className="flex-1 bg-secondary/30 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm text-foreground/90">{getText(comment.text)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reply box */}
              <div className="p-4 border-t border-border/20 bg-card/50">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={language === "ro" ? "Înregistrează-te pentru a răspunde..." : "Register to reply..."}
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-card/80 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    onFocus={() => navigate("/auth/register")}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/auth/register")}
                  >
                    <Send size={14} className="mr-1 sm:mr-1" />
                    <span className="hidden sm:inline">{language === "ro" ? "Răspunde" : "Reply"}</span>
                    <span className="sm:hidden">{language === "ro" ? "Răsp" : "Reply"}</span>
                  </Button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

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

              <Badge variant="success" className="mb-4">
                <Users size={14} className="mr-1" />
                {language === "ro" ? "Comunitate" : "Community"}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                {language === "ro" ? "Alătură-te comunității " : "Join the community of "}
                <span className="text-primary">AgriOne</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === "ro"
                  ? "Conectează-te cu fermieri din toată România, împărtășește experiențe și învață de la cei mai buni."
                  : "Connect with farmers from all over Romania, share experiences and learn from the best."}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate("/auth/register")} variant="primary">
                  {language === "ro" ? "Alătură-te gratuit" : "Join for free"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button onClick={scrollToForum} variant="ghost">
                  {language === "ro" ? "Explorează discuțiile" : "Explore discussions"}
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-y border-border/30 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {communityStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4"
                  >
                    <Icon size={24} className="text-primary mx-auto mb-2" />
                    <div className="text-2xl lg:text-3xl font-extrabold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{getText(stat.label)}</div>
                  </Motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Romania Regions */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="success" className="mb-4">
                <MapPin size={14} className="mr-1" />
                {language === "ro" ? "Fermieri din toată România" : "Farmers across Romania"}
              </Badge>
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-3">
                {language === "ro" ? "Alătură-te comunității din " : "Join the community in "}
                <span className="text-primary">{language === "ro" ? "zona ta" : "your region"}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {language === "ro"
                  ? "AgriOne este folosit de fermieri din toate regiunile țării. Găsește oameni care cultivă aceleași culturi ca tine."
                  : "AgriOne is used by farmers from all regions of the country. Find people growing the same crops as you."}
              </p>
            </Motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {romaniaRegions.map((region, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ y: -4 }}
                  className={`card p-5 bg-gradient-to-br ${region.color} ${region.border} hover:border-primary/30 transition-all cursor-pointer group`}
                  onClick={() => navigate("/auth/register")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-2xl mr-2">{region.icon}</span>
                      <span className="text-lg font-extrabold group-hover:text-primary transition-colors">
                        {getText(region.name)}
                      </span>
                    </div>
                    <Badge variant="default" className="text-xs whitespace-nowrap">
                      <Users size={11} className="mr-1" />
                      {region.farmers}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{region.counties}</p>
                  <div className="flex items-center gap-1 text-xs text-primary font-medium">
                    <Wheat size={12} />
                    {getText(region.mainCrops)}
                  </div>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How to join */}
        <section className="py-12 lg:py-16 bg-card/30 border-y border-border/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold mb-2">
                {language === "ro" ? "Cum te alături în " : "How to join in "}
                <span className="text-primary">3 {language === "ro" ? "pași" : "steps"}</span>
              </h2>
              <p className="text-muted-foreground">
                {language === "ro" ? "Simplu, gratuit și fără birocrație." : "Simple, free and without hassle."}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {joinSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                      <Icon size={26} className="text-primary" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2">{getText(step.title)}</h3>
                    <p className="text-sm text-muted-foreground">{getText(step.desc)}</p>
                  </Motion.div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Button onClick={() => navigate("/auth/register")} variant="primary">
                <UserPlus size={16} className="mr-2" />
                {language === "ro" ? "Alătură-te comunității — Gratuit" : "Join the community — Free"}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="py-16 lg:py-24" ref={forumRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_320px] gap-8">

              {/* Forum Topics */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold">
                    {language === "ro" ? "Discuții Recente" : "Recent Discussions"}
                  </h2>
                  <Button onClick={() => navigate("/auth/register")} variant="ghost" size="sm">
                    {language === "ro" ? "+ Postează" : "+ Post"}
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                  <Filter size={14} className="text-muted-foreground flex-shrink-0" />
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                          activeCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                        }`}
                      >
                        <Icon size={12} />
                        {getText(cat.label)}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {filteredTopics.map((topic, index) => (
                    <Motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      whileHover={{ y: -2 }}
                      className="card p-4 hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-sm text-primary">
                            {topic.author.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="default" className="text-xs">
                              {getText(topic.categoryLabel)}
                            </Badge>
                            {topic.hot && (
                              <Badge variant="danger" className="text-xs">🔥 Hot</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {getText(topic.title)}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1"><User size={12} />{topic.author}</span>
                            <span className="flex items-center gap-1"><MapPin size={12} />{topic.location}</span>
                            <span className="flex items-center gap-1"><MessageSquare size={12} />{topic.replies}</span>
                            <button
                              onClick={(e) => toggleLike(topic.id, e)}
                              className={`flex items-center gap-1 transition-colors ${likedTopics.has(topic.id) ? "text-primary" : "hover:text-primary"}`}
                            >
                              <ThumbsUp size={12} />
                              {topic.likes + (likedTopics.has(topic.id) ? 1 : 0)}
                            </button>
                            <span className="flex items-center gap-1"><Clock size={12} />{topic.time}</span>
                          </div>
                        </div>
                        <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity whitespace-nowrap">
                          {language === "ro" ? "Citește →" : "Read →"}
                        </span>
                      </div>
                    </Motion.div>
                  ))}

                  {filteredTopics.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
                      <p>{language === "ro" ? "Nicio discuție în această categorie." : "No discussions in this category."}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <Button onClick={() => navigate("/auth/register")} variant="ghost" size="sm">
                    {language === "ro" ? "Înregistrează-te pentru a vedea toate discuțiile" : "Register to see all discussions"}
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Top Contributors */}
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={20} className="text-yellow-500" />
                    <h3 className="font-bold">{language === "ro" ? "Top Contribuitori" : "Top Contributors"}</h3>
                  </div>
                  <div className="space-y-3">
                    {topContributors.map((contributor, index) => (
                      <Motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full ${contributor.color} flex items-center justify-center text-white font-bold text-sm`}>
                            {contributor.avatar}
                          </div>
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{contributor.name}</div>
                          <div className="text-xs text-muted-foreground">{contributor.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">{contributor.points}</div>
                          <div className="text-xs text-muted-foreground">{language === "ro" ? "puncte" : "points"}</div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={20} className="text-primary" />
                    <h3 className="font-bold">{language === "ro" ? "Evenimente" : "Events"}</h3>
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <Motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate("/auth/register")}
                        className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-sm">{getText(event.title)}</div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar size={12} />{event.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{event.time}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="default" className="text-xs">
                            <MapPin size={10} className="mr-1" />
                            {getText(event.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Users size={12} className="inline mr-1" />{event.attendees}
                          </span>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                  <Button onClick={() => navigate("/auth/register")} variant="ghost" size="sm" className="w-full mt-3">
                    {language === "ro" ? "Înscrie-te la un eveniment" : "Register for an event"}
                  </Button>
                </div>

                {/* Join CTA */}
                <div className="card p-5 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
                  <Award size={32} className="text-primary mb-3" />
                  <h3 className="font-bold mb-2">{language === "ro" ? "Contribuie și câștigă!" : "Contribute and win!"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "ro"
                      ? "Ajută alți fermieri și acumulează puncte pentru premii exclusive."
                      : "Help other farmers and accumulate points for exclusive prizes."}
                  </p>
                  <Button onClick={() => navigate("/auth/register")} variant="primary" size="sm" className="w-full">
                    {language === "ro" ? "Începe acum" : "Start now"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingLayout>
  );
}
