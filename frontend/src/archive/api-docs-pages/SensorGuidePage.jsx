import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Battery,
  Check,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Droplets,
  ExternalLink,
  HelpCircle,
  Info,
  Leaf,
  Settings,
  ShieldCheck,
  Signal,
  Sun,
  Thermometer,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const sensorTypes = [
  {
    id: "soil-moisture",
    icon: Droplets,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    name: { ro: "Senzor Umiditate Sol", en: "Soil Moisture Sensor" },
    description: {
      ro: "Măsoară conținutul de apă din sol, esențial pentru irigație optimă.",
      en: "Measures water content in soil, essential for optimal irrigation.",
    },
    specs: {
      range: "0-100%",
      accuracy: "±3%",
      depth: "5-30 cm",
      power: "3.3-5V DC",
    },
    price: { ro: "50-150 RON", en: "€10-30" },
    recommended: true,
    features: {
      ro: [
        "Măsurare capacitivă (durabil)",
        "Rezistent la coroziune",
        "Integrare ușoară cu ESP32/Arduino",
        "Consum redus de energie",
      ],
      en: [
        "Capacitive measurement (durable)",
        "Corrosion resistant",
        "Easy integration with ESP32/Arduino",
        "Low power consumption",
      ],
    },
    useCases: {
      ro: ["Irigație automată", "Monitorizare culturi", "Sere și solarii"],
      en: ["Automatic irrigation", "Crop monitoring", "Greenhouses"],
    },
  },
  {
    id: "temperature",
    icon: Thermometer,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    name: { ro: "Senzor Temperatură Sol", en: "Soil Temperature Sensor" },
    description: {
      ro: "Monitorizează temperatura solului pentru optimizarea semănatului și creșterii.",
      en: "Monitors soil temperature for optimal planting and growth.",
    },
    specs: {
      range: "-55°C - +125°C",
      accuracy: "±0.5°C",
      depth: "10-50 cm",
      power: "3-5.5V DC",
    },
    price: { ro: "30-80 RON", en: "€6-16" },
    recommended: true,
    features: {
      ro: [
        "Precizie ridicată",
        "Rezistent la apă (IP67)",
        "Cablu lung disponibil",
        "Protocol digital (1-Wire)",
      ],
      en: [
        "High precision",
        "Waterproof (IP67)",
        "Long cable available",
        "Digital protocol (1-Wire)",
      ],
    },
    useCases: {
      ro: ["Determinare moment optim semănat", "Protecție îngheț", "Monitorizare composte"],
      en: ["Optimal planting timing", "Frost protection", "Compost monitoring"],
    },
  },
  {
    id: "dht22",
    icon: Sun,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    name: { ro: "DHT22 (Temperatură + Umiditate Aer)", en: "DHT22 (Air Temp + Humidity)" },
    description: {
      ro: "Senzor dual pentru temperatură și umiditatea aerului din mediul agricol.",
      en: "Dual sensor for air temperature and humidity in agricultural environments.",
    },
    specs: {
      tempRange: "-40°C - +80°C",
      humRange: "0-100% RH",
      accuracy: "±0.5°C, ±2% RH",
      power: "3.3-6V DC",
    },
    price: { ro: "25-50 RON", en: "€5-10" },
    recommended: false,
    features: {
      ro: [
        "Doi parametri într-un singur senzor",
        "Ușor de integrat",
        "Interval extins de măsurare",
        "Cost redus",
      ],
      en: [
        "Two parameters in one sensor",
        "Easy to integrate",
        "Wide measurement range",
        "Low cost",
      ],
    },
    useCases: {
      ro: ["Sere și solarii", "Monitorizare mediu exterior", "Alerte căldură/îngheț"],
      en: ["Greenhouses", "Outdoor environment monitoring", "Heat/frost alerts"],
    },
  },
  {
    id: "light",
    icon: Sun,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    name: { ro: "Senzor Luminozitate", en: "Light Sensor" },
    description: {
      ro: "Măsoară intensitatea luminii pentru optimizarea fotosintezei.",
      en: "Measures light intensity for photosynthesis optimization.",
    },
    specs: {
      range: "0-65535 lux",
      accuracy: "±10%",
      response: "400-700nm",
      power: "2.4-3.6V DC",
    },
    price: { ro: "15-40 RON", en: "€3-8" },
    recommended: false,
    features: {
      ro: [
        "Răspuns spectral similar ochiului uman",
        "Sensibilitate ajustabilă",
        "Filtru IR integrat",
        "Consum foarte mic",
      ],
      en: [
        "Spectral response similar to human eye",
        "Adjustable sensitivity",
        "Integrated IR filter",
        "Very low power consumption",
      ],
    },
    useCases: {
      ro: ["Automatizare iluminat sere", "Monitorizare expunere solară", "Fotosinteza culturilor"],
      en: ["Greenhouse lighting automation", "Sun exposure monitoring", "Crop photosynthesis"],
    },
  },
  {
    id: "ph",
    icon: Leaf,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    name: { ro: "Senzor pH Sol", en: "Soil pH Sensor" },
    description: {
      ro: "Determină aciditatea sau alcalinitatea solului pentru fertilizare optimă.",
      en: "Determines soil acidity or alkalinity for optimal fertilization.",
    },
    specs: {
      range: "0-14 pH",
      accuracy: "±0.1 pH",
      temp: "0-60°C",
      power: "5V DC",
    },
    price: { ro: "80-250 RON", en: "€15-50" },
    recommended: false,
    features: {
      ro: [
        "Electrod durabil",
        "Compensare temperatură automată",
        "Multiple tipuri de sol",
        "Calibrare ușoară",
      ],
      en: [
        "Durable electrode",
        "Automatic temperature compensation",
        "Multiple soil types",
        "Easy calibration",
      ],
    },
    useCases: {
      ro: ["Fertilizare precisă", "Alegerea culturilor", "Corectare aciditate"],
      en: ["Precise fertilization", "Crop selection", "Acidity correction"],
    },
  },
];

const setupSteps = [
  {
    step: 1,
    icon: Cpu,
    title: { ro: "Achiziționează Componentele", en: "Get the Components" },
    description: {
      ro: "Ai nevoie de: senzori (umiditate + temperatură), microcontroler ESP32 sau Arduino, sursă de alimentare.",
      en: "You need: sensors (moisture + temperature), ESP32 or Arduino microcontroller, power supply.",
    },
  },
  {
    step: 2,
    icon: Wrench,
    title: { ro: "Asamblează Hardware", en: "Assemble Hardware" },
    description: {
      ro: "Conectează senzorii la microcontroler urmând schema de pinout. Verifică polaritatea alimentării.",
      en: "Connect sensors to microcontroller following the pinout diagram. Check power polarity.",
    },
  },
  {
    step: 3,
    icon: Settings,
    title: { ro: "Încarcă Firmware-ul", en: "Flash Firmware" },
    description: {
      ro: "Descarcă firmware-ul AgriOne și încarcă-l pe ESP32. Configurează WiFi-ul pentru conectare la rețea.",
      en: "Download AgriOne firmware and flash it to ESP32. Configure WiFi for network connection.",
    },
  },
  {
    step: 4,
    icon: Signal,
    title: { ro: "Configurează în AgriOne", en: "Configure in AgriOne" },
    description: {
      ro: "În dashboard, adaugă senzorul folosind codul unic afișat. Asociază-l cu terenul dorit.",
      en: "In dashboard, add the sensor using the unique code displayed. Associate it with desired land.",
    },
  },
  {
    step: 5,
    icon: CheckCircle2,
    title: { ro: "Calibrează și Testează", en: "Calibrate and Test" },
    description: {
      ro: "Calibrează senzorii pentru precizie maximă. Verifică că datele ajung corect în platformă.",
      en: "Calibrate sensors for maximum precision. Verify data arrives correctly in platform.",
    },
  },
];

const faqItems = [
  {
    question: { ro: "Ce microcontroler recomandați?", en: "What microcontroller do you recommend?" },
    answer: {
      ro: "Recomandăm ESP32 pentru proiecte noi - are WiFi integrat, consum redus și performanță bună. Arduino Uno merge pentru început, dar are nevoie de modul WiFi separat.",
      en: "We recommend ESP32 for new projects - it has built-in WiFi, low power consumption and good performance. Arduino Uno works for beginners, but needs a separate WiFi module.",
    },
  },
  {
    question: { ro: "Cât durează bateria?", en: "How long does the battery last?" },
    answer: {
      ro: "Depinde de frecvența de citire. Cu citiri la fiecare 15 minute și deep sleep, un ESP32 cu baterie de 3000mAh poate funcționa 3-6 luni.",
      en: "Depends on reading frequency. With readings every 15 minutes and deep sleep, an ESP32 with 3000mAh battery can run 3-6 months.",
    },
  },
  {
    question: {
      ro: "Cum protejez senzorii de intemperii?",
      en: "How do I protect sensors from weather?",
    },
    answer: {
      ro: "Folosește carcase IP65+ pentru electronice. Senzorii de sol sunt deja rezistenți, dar asigură-te că cablul de conexiune este etanș.",
      en: "Use IP65+ cases for electronics. Soil sensors are already resistant, but make sure connection cable is sealed.",
    },
  },
  {
    question: { ro: "Cât de departe poate fi senzorul de WiFi?", en: "How far can the sensor be from WiFi?" },
    answer: {
      ro: "ESP32 are rază de ~100m în câmp deschis. Pentru distanțe mai mari, poți folosi un repeater WiFi sau protocol LoRa pentru până la 10km.",
      en: "ESP32 has ~100m range in open field. For longer distances, use a WiFi repeater or LoRa protocol for up to 10km.",
    },
  },
];

function SensorCard({ sensor, language }) {
  const Icon = sensor.icon;
  const getText = (obj) => obj[language] || obj.en;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`card p-6 h-full flex flex-col border-2 ${sensor.borderColor} hover:shadow-lg transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl ${sensor.bgColor} flex items-center justify-center`}>
          <Icon size={28} className={sensor.color} />
        </div>
        {sensor.recommended && (
          <Badge variant="primary" className="text-xs">
            <Check size={12} className="mr-1" />
            {language === "ro" ? "Recomandat" : "Recommended"}
          </Badge>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2">{getText(sensor.name)}</h3>
      <p className="text-sm text-muted-foreground mb-4">{getText(sensor.description)}</p>

      {/* Specs */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mb-4">
        {Object.entries(sensor.specs).map(([key, value]) => (
          <div key={key} className="text-xs bg-secondary/30 rounded-lg p-2">
            <span className="text-muted-foreground capitalize">{key}: </span>
            <span className="font-semibold">{value}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mb-4 flex-1">
        <div className="text-sm font-semibold mb-2">
          {language === "ro" ? "Caracteristici" : "Features"}
        </div>
        <ul className="space-y-1">
          {getText(sensor.features).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Price & Use Cases */}
      <div className="pt-4 border-t border-border/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {language === "ro" ? "Preț orientativ" : "Approx. price"}
          </span>
          <span className="font-bold text-primary">{getText(sensor.price)}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {getText(sensor.useCases).map((useCase, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {useCase}
            </Badge>
          ))}
        </div>
      </div>
    </Motion.div>
  );
}

function FAQItem({ item, language, isOpen, onToggle }) {
  const getText = (obj) => obj[language] || obj.en;

  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="font-semibold group-hover:text-primary transition-colors">
          {getText(item.question)}
        </span>
        <Motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-muted-foreground" />
        </Motion.div>
      </button>
      <Motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="pb-4 text-muted-foreground">{getText(item.answer)}</p>
      </Motion.div>
    </div>
  );
}

export default function SensorGuidePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

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
                <Cpu size={14} className="mr-1" />
                {language === "ro" ? "Ghid Senzori" : "Sensor Guide"}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                {language === "ro" ? "Cum alegi " : "How to choose "}
                <span className="text-primary">
                  {language === "ro" ? "senzorii potriviți" : "the right sensors"}
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === "ro"
                  ? "Ghid complet pentru alegerea, instalarea și configurarea senzorilor IoT pentru agricultura ta. De la începători la avansați."
                  : "Complete guide for choosing, installing and configuring IoT sensors for your farm. From beginners to advanced."}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => document.getElementById("sensors")?.scrollIntoView({ behavior: "smooth" })} variant="primary">
                  {language === "ro" ? "Vezi tipuri de senzori" : "View sensor types"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button onClick={() => document.getElementById("setup")?.scrollIntoView({ behavior: "smooth" })} variant="ghost">
                  {language === "ro" ? "Ghid instalare" : "Installation guide"}
                </Button>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* What AgriOne Uses */}
        <section className="py-12 bg-card/30 border-y border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Wifi size={32} className="text-primary" />
                </div>
                <h3 className="font-bold mb-2">ESP32</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ro"
                    ? "Microcontroler recomandat pentru toate proiectele AgriOne"
                    : "Recommended microcontroller for all AgriOne projects"}
                </p>
              </Motion.div>
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Droplets size={32} className="text-blue-500" />
                </div>
                <h3 className="font-bold mb-2">
                  {language === "ro" ? "Umiditate sol" : "Soil Moisture"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ro"
                    ? "Senzori capacitivi pentru măsurători precise și durabile"
                    : "Capacitive sensors for precise and durable measurements"}
                </p>
              </Motion.div>
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Thermometer size={32} className="text-orange-500" />
                </div>
                <h3 className="font-bold mb-2">DS18B20</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ro"
                    ? "Senzor de temperatură sol waterproof cu precizie înaltă"
                    : "Waterproof soil temperature sensor with high precision"}
                </p>
              </Motion.div>
            </div>
          </div>
        </section>

        {/* Sensor Types */}
        <section id="sensors" className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="primary" className="mb-4">
                <Cpu size={14} className="mr-1" />
                {language === "ro" ? "Tipuri de Senzori" : "Sensor Types"}
              </Badge>
              <h2 className="text-3xl font-extrabold mb-4">
                {language === "ro" ? "Senzori compatibili cu " : "Sensors compatible with "}
                <span className="text-primary">AgriOne</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === "ro"
                  ? "Aceștia sunt senzorii pe care îi recomandăm pentru proiectele tale agricole. Toți sunt testați și integrați cu platforma."
                  : "These are the sensors we recommend for your agricultural projects. All are tested and integrated with the platform."}
              </p>
            </Motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sensorTypes.map((sensor, index) => (
                <Motion.div
                  key={sensor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SensorCard sensor={sensor} language={language} />
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Setup Steps */}
        <section id="setup" className="py-16 lg:py-24 bg-card/30 border-y border-border/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="primary" className="mb-4">
                <Wrench size={14} className="mr-1" />
                {language === "ro" ? "Ghid Instalare" : "Installation Guide"}
              </Badge>
              <h2 className="text-3xl font-extrabold mb-4">
                {language === "ro" ? "De la cutie la " : "From box to "}
                <span className="text-primary">{language === "ro" ? "date live" : "live data"}</span>
              </h2>
            </Motion.div>

            <div className="space-y-6">
              {setupSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1 card p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon size={20} className="text-primary" />
                        <h3 className="font-bold text-lg">{step.title[language]}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description[language]}</p>
                    </div>
                  </Motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge variant="primary" className="mb-4">
                <HelpCircle size={14} className="mr-1" />
                FAQ
              </Badge>
              <h2 className="text-3xl font-extrabold mb-4">
                {language === "ro" ? "Întrebări frecvente" : "Frequently asked questions"}
              </h2>
            </Motion.div>

            <div className="card p-6">
              {faqItems.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  language={language}
                  isOpen={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-card/30 border-t border-border/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="card p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
                <ShieldCheck size={48} className="text-primary mx-auto mb-6" />
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
                  {language === "ro" ? "Gata să începi?" : "Ready to get started?"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  {language === "ro"
                    ? "Creează un cont gratuit și adaugă primul tău senzor în câteva minute."
                    : "Create a free account and add your first sensor in minutes."}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => navigate("/auth/register")} variant="primary">
                    {language === "ro" ? "Creează cont gratuit" : "Create free account"}
                  </Button>
                  <Button onClick={() => navigate("/docs")} variant="ghost">
                    {language === "ro" ? "Vezi documentația" : "View documentation"}
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
