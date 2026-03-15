import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Database,
  FileJson,
  Key,
  Lock,
  Play,
  RefreshCw,
  Server,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const apiEndpoints = [
  {
    category: "Authentication",
    icon: Lock,
    endpoints: [
      { method: "POST", path: "/api/auth/login", description: { ro: "Autentificare utilizator", en: "User login" } },
      { method: "POST", path: "/api/auth/register", description: { ro: "Înregistrare utilizator nou", en: "Register new user" } },
      { method: "GET", path: "/api/auth/me", description: { ro: "Obține profilul curent", en: "Get current profile" } },
      { method: "PUT", path: "/api/auth/password", description: { ro: "Schimbă parola", en: "Change password" } },
    ],
  },
  {
    category: "Lands",
    icon: Database,
    endpoints: [
      { method: "GET", path: "/api/lands", description: { ro: "Listează toate terenurile", en: "List all lands" } },
      { method: "POST", path: "/api/lands", description: { ro: "Creează teren nou", en: "Create new land" } },
      { method: "GET", path: "/api/lands/:id", description: { ro: "Obține detalii teren", en: "Get land details" } },
      { method: "PUT", path: "/api/lands/:id", description: { ro: "Actualizează teren", en: "Update land" } },
      { method: "DELETE", path: "/api/lands/:id", description: { ro: "Șterge teren", en: "Delete land" } },
    ],
  },
  {
    category: "Sensors",
    icon: Zap,
    endpoints: [
      { method: "GET", path: "/api/sensors", description: { ro: "Listează senzorii", en: "List sensors" } },
      { method: "POST", path: "/api/sensors/pair", description: { ro: "Asociază senzor cu teren", en: "Pair sensor with land" } },
      { method: "POST", path: "/api/sensors/unpair", description: { ro: "Dezasociază senzor", en: "Unpair sensor" } },
      { method: "PUT", path: "/api/sensors/:code/calibration", description: { ro: "Calibrează senzor", en: "Calibrate sensor" } },
    ],
  },
  {
    category: "Readings",
    icon: RefreshCw,
    endpoints: [
      { method: "GET", path: "/api/readings/land/:id", description: { ro: "Citiri pentru teren", en: "Readings for land" } },
      { method: "POST", path: "/api/iot/data", description: { ro: "Trimite date senzor (IoT)", en: "Send sensor data (IoT)" } },
    ],
  },
  {
    category: "Alerts",
    icon: Shield,
    endpoints: [
      { method: "GET", path: "/api/alerts", description: { ro: "Listează alertele", en: "List alerts" } },
      { method: "DELETE", path: "/api/alerts/:id", description: { ro: "Șterge alertă", en: "Delete alert" } },
      { method: "GET", path: "/api/alerts/rules", description: { ro: "Obține regulile de alertă", en: "Get alert rules" } },
      { method: "POST", path: "/api/alerts/rules", description: { ro: "Creează/actualizează regulă", en: "Create/update rule" } },
    ],
  },
  {
    category: "Economics",
    icon: FileJson,
    endpoints: [
      { method: "GET", path: "/api/economics/transactions", description: { ro: "Listează tranzacții", en: "List transactions" } },
      { method: "POST", path: "/api/economics/transactions", description: { ro: "Adaugă tranzacție", en: "Add transaction" } },
      { method: "GET", path: "/api/economics/summary", description: { ro: "Sumar financiar", en: "Financial summary" } },
    ],
  },
];

const codeExamples = [
  {
    title: { ro: "Autentificare", en: "Authentication" },
    language: "javascript",
    code: `// Login și obținere token
const response = await fetch('https://api.agri-one.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'fermier@example.com',
    password: 'parola_sigura'
  })
});

const { accessToken } = await response.json();
// Folosește accessToken pentru request-uri autentificate`,
  },
  {
    title: { ro: "Citire Date Senzori", en: "Read Sensor Data" },
    language: "javascript",
    code: `// Obține citirile ultimelor 24h pentru un teren
const landId = '123';
const response = await fetch(
  \`https://api.agri-one.com/api/readings/land/\${landId}?range=24h\`,
  {
    headers: {
      'Authorization': \`Bearer \${accessToken}\`
    }
  }
);

const readings = await response.json();
console.log(readings);
// [{ ts: "2024-03-15T10:00:00Z", temperature: 22.5, humidity: 65 }, ...]`,
  },
  {
    title: { ro: "Trimitere Date IoT", en: "Send IoT Data" },
    language: "javascript",
    code: `// Trimite date de la senzor (endpoint pentru dispozitive IoT)
const response = await fetch('https://api.agri-one.com/api/iot/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Sensor-Code': 'SENSOR_ABC123'
  },
  body: JSON.stringify({
    temperatureC: 23.5,
    humidityPct: 62,
    ts: new Date().toISOString()
  })
});`,
  },
  {
    title: { ro: "Creare Regulă Alertă", en: "Create Alert Rule" },
    language: "javascript",
    code: `// Setează praguri pentru alertă pe teren
const response = await fetch('https://api.agri-one.com/api/alerts/rules', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${accessToken}\`
  },
  body: JSON.stringify({
    landId: '123',
    enabled: true,
    tempMin: 5,    // Alertă dacă < 5°C
    tempMax: 35,   // Alertă dacă > 35°C
    humMin: 20,    // Alertă dacă < 20%
    humMax: 80     // Alertă dacă > 80%
  })
});`,
  },
];

function CodeBlock({ code, language = "javascript" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl bg-[#1e1e2e] border border-border/20 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-border/10">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Copiat!" : "Copiază"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-[#cdd6f4]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("Authentication");

  const getText = (obj) => obj[language] || obj.en;

  const methodColors = {
    GET: "bg-green-500/10 text-green-500 border-green-500/20",
    POST: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const activeEndpoints = apiEndpoints.find((c) => c.category === activeCategory)?.endpoints || [];

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
                <Code2 size={14} className="mr-1" />
                API Documentation
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                {language === "ro" ? "Documentație " : "API "}
                <span className="text-primary">API</span>
                {language === "ro" ? "" : " Documentation"}
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === "ro"
                  ? "Integrează AgriOne în aplicațiile tale. RESTful API cu autentificare JWT și documentație completă."
                  : "Integrate AgriOne into your applications. RESTful API with JWT authentication and complete documentation."}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Server size={14} className="mr-2" />
                  REST API
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Key size={14} className="mr-2" />
                  JWT Auth
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <FileJson size={14} className="mr-2" />
                  JSON
                </Badge>
              </div>
            </Motion.div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-12 bg-card/30 border-y border-border/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold mb-2">
                {language === "ro" ? "Start Rapid" : "Quick Start"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "Începe să folosești API-ul în câteva minute"
                  : "Start using the API in minutes"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary font-bold">
                  1
                </div>
                <h3 className="font-bold mb-2">
                  {language === "ro" ? "Creează cont" : "Create account"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ro"
                    ? "Înregistrează-te și obține acces la API"
                    : "Register and get API access"}
                </p>
              </Motion.div>
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary font-bold">
                  2
                </div>
                <h3 className="font-bold mb-2">
                  {language === "ro" ? "Obține token" : "Get token"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ro"
                    ? "Autentifică-te și primește JWT token"
                    : "Authenticate and receive JWT token"}
                </p>
              </Motion.div>
              <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary font-bold">
                  3
                </div>
                <h3 className="font-bold mb-2">
                  {language === "ro" ? "Fă request-uri" : "Make requests"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "ro"
                    ? "Folosește token-ul pentru a accesa datele"
                    : "Use the token to access data"}
                </p>
              </Motion.div>
            </div>

            <div className="mt-8">
              <CodeBlock
                language="bash"
                code={`# Base URL
https://api.agri-one.com

# Autentificare
curl -X POST https://api.agri-one.com/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"your_password"}'

# Răspuns
{"accessToken":"eyJhbGciOiJIUzI1NiIs...","user":{...}}`}
              />
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-extrabold mb-2">
                {language === "ro" ? "Endpoint-uri Disponibile" : "Available Endpoints"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "Toate endpoint-urile API organizate pe categorii"
                  : "All API endpoints organized by category"}
              </p>
            </div>

            <div className="grid lg:grid-cols-[240px_1fr] gap-8">
              {/* Categories */}
              <div className="space-y-2">
                {apiEndpoints.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.category}
                      onClick={() => setActiveCategory(category.category)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeCategory === category.category
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{category.category}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {category.endpoints.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Endpoints List */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-6">{activeCategory}</h3>
                <div className="space-y-3">
                  {activeEndpoints.map((endpoint, index) => (
                    <Motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                    >
                      <Badge className={`${methodColors[endpoint.method]} font-mono text-xs px-2 py-1`}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono flex-1 min-w-0 truncate">{endpoint.path}</code>
                      <span className="text-sm text-muted-foreground hidden sm:block">
                        {getText(endpoint.description)}
                      </span>
                    </Motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-16 lg:py-24 bg-card/30 border-y border-border/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-extrabold mb-2">
                {language === "ro" ? "Exemple de Cod" : "Code Examples"}
              </h2>
              <p className="text-muted-foreground">
                {language === "ro"
                  ? "Exemple practice pentru integrare rapidă"
                  : "Practical examples for quick integration"}
              </p>
            </div>

            <div className="space-y-8">
              {codeExamples.map((example, index) => (
                <Motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Terminal size={18} className="text-primary" />
                    {getText(example.title)}
                  </h3>
                  <CodeBlock code={example.code} language={example.language} />
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="card p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
                <Play size={48} className="text-primary mx-auto mb-6" />
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
                  {language === "ro" ? "Gata să integrezi?" : "Ready to integrate?"}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  {language === "ro"
                    ? "Creează un cont și începe să folosești API-ul AgriOne în aplicația ta."
                    : "Create an account and start using the AgriOne API in your application."}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => navigate("/auth/register")} variant="primary">
                    {language === "ro" ? "Creează cont dezvoltator" : "Create developer account"}
                  </Button>
                  <Button onClick={() => navigate("/docs")} variant="ghost">
                    <BookOpen size={16} className="mr-2" />
                    {language === "ro" ? "Documentație completă" : "Full documentation"}
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
