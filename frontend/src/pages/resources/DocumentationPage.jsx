import { useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  FileText,
  HelpCircle,
  Layers,
  Map,
  Play,
  Search,
  Server,
  Shield,
  Wallet,
  Wifi,
  Zap,
  ArrowLeft,
  ArrowRight,
  Terminal,
  Database,
  Globe,
  Smartphone,
  BarChart3,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

/* ─── Documentation content ───────────────────────── */

const docs = {
  "getting-started": {
    icon: Play,
    title: { ro: "Primii Pași", en: "Getting Started" },
    desc: {
      ro: "Totul de la crearea contului până la primul grafic pe dashboard.",
      en: "Everything from creating your account to the first chart on the dashboard.",
    },
    articles: [
      {
        title: { ro: "Creează-ți contul", en: "Create your account" },
        time: "2 min",
        body: {
          ro: "Apasă **Creează Cont** pe pagina principală. Completează email-ul, un nume de utilizator și o parolă (minim 8 caractere). Poți folosi și butonul **Google** pentru a te conecta instant cu contul Google. După înregistrare ești direcționat automat în dashboard.",
          en: "Click **Create Account** on the home page. Enter your email, a username, and a password (at least 8 characters). You can also use the **Google** button to sign in instantly with your Google account. After registration, you're automatically redirected to the dashboard.",
        },
      },
      {
        title: { ro: "Adaugă primul teren", en: "Add your first land" },
        time: "3 min",
        body: {
          ro: "Din meniul lateral alege **Terenuri → Adaugă Teren**. Completează: numele terenului, tipul de cultură, suprafața (hectare) și trasează conturul pe hartă. Harta calculează automat centroidul GPS. Apasă **Salvează** și terenul apare instant pe lista ta.",
          en: "From the sidebar choose **Lands → Add Land**. Fill in: land name, crop type, area (hectares) and draw the boundary on the map. The map automatically calculates the GPS centroid. Hit **Save** and the land appears instantly on your list.",
        },
      },
      {
        title: { ro: "Navigarea în dashboard", en: "Navigating the dashboard" },
        time: "2 min",
        body: {
          ro: "Dashboard-ul afișează un sumar global: meteo curentă, alerte active, ultimele citiri ale senzorilor și un grafic cu tendințe. Meniul din stânga te duce rapid la Terenuri, Senzori, Alerte, Economie, Rapoarte APIA și Analize. Profilele se gestionează din butonul din dreapta sus.",
          en: "The dashboard shows a global summary: current weather, active alerts, latest sensor readings and a trend chart. The left menu takes you to Lands, Sensors, Alerts, Economics, APIA Reports and Analytics. Profile settings are in the top-right corner.",
        },
      },
      {
        title: { ro: "Setează profilul", en: "Set up your profile" },
        time: "2 min",
        body: {
          ro: "Din **Profil** poți: schimba parola, seta locația globală pentru prognoze meteo, alege limba (RO/EN) și vedea planul activ. Locația globală se folosește pentru meteo pe dashboard dacă nu ai terenuri adăugate încă.",
          en: "From **Profile** you can: change your password, set a global location for weather forecasts, choose language (RO/EN) and see your active plan. The global location is used for dashboard weather if you haven't added any lands yet.",
        },
      },
    ],
  },
  sensors: {
    icon: Cpu,
    title: { ro: "Senzori IoT", en: "IoT Sensors" },
    desc: {
      ro: "Conectează senzori Arduino/ESP32 și vizualizează datele live.",
      en: "Connect Arduino/ESP32 sensors and view live data.",
    },
    articles: [
      {
        title: { ro: "Senzori compatibili", en: "Compatible sensors" },
        time: "3 min",
        body: {
          ro: "AgriOne funcționează cu orice senzor care trimite temperatură (°C) și umiditate (%) prin protocolul HTTP POST. Recomandat: **DHT22** sau **BME280** conectat la un **Arduino Uno + ESP8266** sau un **ESP32** standalone. Senzorii capacitivi de sol sunt opționali și suportați.",
          en: "AgriOne works with any sensor that sends temperature (°C) and humidity (%) via HTTP POST. Recommended: **DHT22** or **BME280** connected to an **Arduino Uno + ESP8266** or a standalone **ESP32**. Capacitive soil sensors are optional and supported.",
        },
      },
      {
        title: { ro: "Conectare și asociere", en: "Connection and pairing" },
        time: "5 min",
        body: {
          ro: "1. Încarcă firmware-ul AgriOne pe placa Arduino/ESP32 (vezi folderul `arduino/` din repository).\n2. Placa trimite citiri HTTP către backend la interval setat (ex. 5 minute).\n3. În AgriOne, mergi la **Senzori → Asociază Senzor**. Introdu codul unic al senzorului (se afișează pe serial monitor) și selectează terenul.\n4. Datele apar automat pe dashboard-ul terenului respectiv.",
          en: "1. Upload the AgriOne firmware to the Arduino/ESP32 board (see the `arduino/` folder in the repository).\n2. The board sends HTTP readings to the backend at a set interval (e.g. 5 minutes).\n3. In AgriOne, go to **Sensors → Pair Sensor**. Enter the sensor's unique code (shown on the serial monitor) and select the land.\n4. Data appears automatically on that land's dashboard.",
        },
      },
      {
        title: { ro: "Calibrare", en: "Calibration" },
        time: "3 min",
        body: {
          ro: "Fiecare senzor poate fi calibrat cu un offset de temperatură și umiditate. Din pagina senzorului, apasă **Calibrare** și setează: `offset temperatură (°C)` și `offset umiditate (%)`. De exemplu, dacă senzorul citește cu 1.5°C în plus, setezi offset-ul la **-1.5**. Citirile viitoare se corectează automat.",
          en: "Each sensor can be calibrated with a temperature and humidity offset. From the sensor page, click **Calibration** and set: `temperature offset (°C)` and `humidity offset (%)`. For example, if the sensor reads 1.5°C high, set the offset to **-1.5**. Future readings are automatically corrected.",
        },
      },
    ],
  },
  alerts: {
    icon: Zap,
    title: { ro: "Sistem de Alerte", en: "Alert System" },
    desc: {
      ro: "Configurează praguri și primești notificări automate.",
      en: "Set thresholds and receive automatic notifications.",
    },
    articles: [
      {
        title: { ro: "Crează reguli de alertă", en: "Create alert rules" },
        time: "3 min",
        body: {
          ro: "Din **Alerte → Reguli**, apasă **Adaugă Regulă**. Selectează terenul și setează pragurile: temperatură min/max și umiditate min/max. Când o citire depășește oricare prag, se generează automat o alertă cu severitate (warning/critical) pe baza diferenței față de prag.",
          en: "From **Alerts → Rules**, click **Add Rule**. Select the land and set thresholds: temperature min/max and humidity min/max. When a reading exceeds any threshold, an alert is automatically generated with severity (warning/critical) based on the difference from the threshold.",
        },
      },
      {
        title: { ro: "Notificări email", en: "Email notifications" },
        time: "2 min",
        body: {
          ro: "Alertele se afișează pe dashboard și în lista de alerte. Pe planul **Pro**, poți primi alerte direct pe email. Setările de notificare sunt în **Profil → Preferințe**. Alertele de severitate \"critical\" se trimit întotdeauna.",
          en: "Alerts are displayed on the dashboard and in the alert list. On the **Pro** plan, you can receive alerts directly by email. Notification settings are in **Profile → Preferences**. \"Critical\" severity alerts are always sent.",
        },
      },
      {
        title: { ro: "Gestionare alerte active", en: "Managing active alerts" },
        time: "2 min",
        body: {
          ro: "Lista de alerte se poate filtra pe severitate, teren sau perioadă. Poți șterge alertele vechi individual. Alertele active ajută și la rapoartele PDF — ele indică perioadele problematice.",
          en: "The alerts list can be filtered by severity, land or time period. You can delete old alerts individually. Active alerts also help with PDF reports — they indicate problematic periods.",
        },
      },
    ],
  },
  economics: {
    icon: Wallet,
    title: { ro: "Evidență Financiară", en: "Financial Tracking" },
    desc: {
      ro: "Urmărește venituri, cheltuieli și profitabilitatea.",
      en: "Track income, expenses and profitability.",
    },
    articles: [
      {
        title: { ro: "Adaugă tranzacții", en: "Add transactions" },
        time: "2 min",
        body: {
          ro: "Din **Economie → Adaugă Tranzacție** selectezi: tipul (venit / cheltuială), categoria (semințe, combustibil, pesticide, vânzare recoltă etc.), suma, terenul asociat și data. Tranzacțiile fără teren sunt contabilizate ca operațiuni generale ale fermei.",
          en: "From **Economics → Add Transaction** select: type (income / expense), category (seeds, fuel, pesticides, crop sale, etc.), amount, associated land and date. Transactions without a land are recorded as general farm operations.",
        },
      },
      {
        title: { ro: "Rapoarte și export PDF", en: "Reports and PDF export" },
        time: "3 min",
        body: {
          ro: "Pagina de economie afișează: total venituri, total cheltuieli, profit net, grafice pe categorii și tendințe lunare. Cu planul Pro poți exporta un raport PDF complet cu toate datele financiare filtrate pe perioadă. Ideal pentru evidența contabilă.",
          en: "The economics page shows: total income, total expenses, net profit, charts by category and monthly trends. With the Pro plan you can export a full PDF report with all financial data filtered by period. Great for bookkeeping.",
        },
      },
    ],
  },
  maps: {
    icon: Map,
    title: { ro: "Hărți și Terenuri", en: "Maps & Lands" },
    desc: {
      ro: "Vizualizează și gestionează terenurile pe harta interactivă.",
      en: "View and manage your lands on the interactive map.",
    },
    articles: [
      {
        title: { ro: "Harta interactivă", en: "Interactive map" },
        time: "3 min",
        body: {
          ro: "Fiecare teren este afișat pe o hartă interactivă (Leaflet + OpenStreetMap). Poți vedea conturul dreptughiular al fiecărui teren, centroidul GPS, și informațiile rapide (cultură, suprafață, ultima citire senzor). Harta se centrează automat pe terenurile tale.",
          en: "Each land is displayed on an interactive map (Leaflet + OpenStreetMap). You can see the rectangular boundary of each land, the GPS centroid, and quick info (crop, area, last sensor reading). The map auto-centers on your lands.",
        },
      },
      {
        title: { ro: "Editare și ștergere", en: "Edit and delete" },
        time: "2 min",
        body: {
          ro: "Din pagina de detalii a unui teren poți: edita numele, cultura și geometria, vedea toate citirile senzorilor asociați, vedea alertele și tranzacțiile legate de teren. Ștergerea unui teren dezasociază automat senzorii (nu îi pierd, se pot reasigna).",
          en: "From a land's detail page you can: edit name, crop and geometry, see all readings from associated sensors, and see alerts and transactions linked to the land. Deleting a land automatically unlinks sensors (they're not lost, they can be reassigned).",
        },
      },
    ],
  },
  weather: {
    icon: Globe,
    title: { ro: "Prognoză Meteo", en: "Weather Forecast" },
    desc: {
      ro: "Date meteo live și prognoze pentru terenurile tale.",
      en: "Live weather data and forecasts for your lands.",
    },
    articles: [
      {
        title: { ro: "Cum funcționează", en: "How it works" },
        time: "2 min",
        body: {
          ro: "AgriOne folosește **OpenWeather API** pentru a afișa meteo live (temperatură, umiditate, vânt, precipitații) pe baza coordonatelor GPS ale terenurilor tale. Pe dashboard vezi meteo-ul curent pentru locația globală setată în profil sau pentru primul teren adăugat.",
          en: "AgriOne uses the **OpenWeather API** to display live weather (temperature, humidity, wind, precipitation) based on the GPS coordinates of your lands. On the dashboard you see current weather for the global location set in your profile or for the first land added.",
        },
      },
      {
        title: { ro: "Recomandări bazate pe meteo", en: "Weather-based recommendations" },
        time: "3 min",
        body: {
          ro: "Pe baza meteo-ului și a tipului de cultură, AgriOne generează **recomandări zilnice**: riscuri de îngheț, momente potrivite pentru irigat sau tratamente, condițiile din următoarele zile. Reccomandările se afișează pe pagina terenului și pe dashboard.",
          en: "Based on weather and crop type, AgriOne generates **daily recommendations**: frost risks, suitable times for irrigation or treatments, conditions for the coming days. Recommendations are shown on the land page and the dashboard.",
        },
      },
    ],
  },
  apia: {
    icon: FileText,
    title: { ro: "Rapoarte APIA", en: "APIA Reports" },
    desc: {
      ro: "Gestionează parcele, calculează subvenții și exportă documente.",
      en: "Manage parcels, calculate subsidies and export documents.",
    },
    articles: [
      {
        title: { ro: "Registrul de parcele", en: "Parcel registry" },
        time: "3 min",
        body: {
          ro: "Din **APIA → Parcele** poți adăuga date cadastrale pentru fiecare teren: număr cadastral, suprafața declarată, cultura, anul de declarare. Aceste date sunt separate de terenuri și pot fi importate/exportate pentru dosarele APIA.",
          en: "From **APIA → Parcels** you can add cadastral data for each land: cadastral number, declared area, crop, declaration year. These data are separate from lands and can be imported/exported for APIA files.",
        },
      },
      {
        title: { ro: "Calculator subvenții", en: "Subsidy calculator" },
        time: "2 min",
        body: {
          ro: "Calculatorul APIA estimează subvențiile pe baza suprafețelor, culturii și ratelor active. Selectezi terenul, și aplicația calculează automat subvenția estimată pe baza ratelor curente pe hectar.",
          en: "The APIA calculator estimates subsidies based on areas, crop and active rates. Select the land, and the app automatically calculates the estimated subsidy based on current per-hectare rates.",
        },
      },
    ],
  },
  architecture: {
    icon: Layers,
    title: { ro: "Arhitectură Tehnică", en: "Technical Architecture" },
    desc: {
      ro: "Stack-ul tehnic, structura bazei de date și API-ul.",
      en: "Tech stack, database structure and the API.",
    },
    articles: [
      {
        title: { ro: "Stack tehnic", en: "Tech stack" },
        time: "3 min",
        body: {
          ro: "**Frontend:** React 18 + Vite, TailwindCSS, Framer Motion, React Router, Zustand, Leaflet, Recharts, React Markdown.\n\n**Backend:** Node.js + Express, Sequelize ORM, PostgreSQL, JWT (access + refresh tokens), OpenAI GPT-4 API, OpenWeather API.\n\n**IoT:** Arduino Uno + ESP8266/ESP32, senzori DHT22/BME280, comunicare HTTP POST.\n\n**Deployment:** Docker Compose, Nginx reverse proxy, Let's Encrypt SSL.",
          en: "**Frontend:** React 18 + Vite, TailwindCSS, Framer Motion, React Router, Zustand, Leaflet, Recharts, React Markdown.\n\n**Backend:** Node.js + Express, Sequelize ORM, PostgreSQL, JWT (access + refresh tokens), OpenAI GPT-4 API, OpenWeather API.\n\n**IoT:** Arduino Uno + ESP8266/ESP32, DHT22/BME280 sensors, HTTP POST communication.\n\n**Deployment:** Docker Compose, Nginx reverse proxy, Let's Encrypt SSL.",
        },
      },
      {
        title: { ro: "Structura bazei de date", en: "Database structure" },
        time: "4 min",
        body: {
          ro: "PostgreSQL cu 9 tabele principale:\n- **users** — conturi (email, parolă hash, rol, locație globală)\n- **lands** — terenuri (nume, cultură, suprafață, geometrie GeoJSON)\n- **sensors** — senzori IoT (cod unic, calibrare, last_reading)\n- **readings** — citiri (temperatură, umiditate, timestamp)\n- **alert_rules** — reguli alerte (praguri min/max pe teren)\n- **alerts** — alerte generate automat\n- **transactions** — tranzacții financiare\n- **refresh_tokens** — sesiuni de autentificare\n- **password_reset_tokens** — resetare parolă\n\nToate tabelele folosesc UUID ca primary key. Migrările Sequelize sunt în `backend/src/db/migrations/`.",
          en: "PostgreSQL with 9 main tables:\n- **users** — accounts (email, password hash, role, global location)\n- **lands** — lands (name, crop, area, GeoJSON geometry)\n- **sensors** — IoT sensors (unique code, calibration, last_reading)\n- **readings** — readings (temperature, humidity, timestamp)\n- **alert_rules** — alert rules (min/max thresholds per land)\n- **alerts** — automatically generated alerts\n- **transactions** — financial transactions\n- **refresh_tokens** — authentication sessions\n- **password_reset_tokens** — password reset\n\nAll tables use UUID as primary key. Sequelize migrations are in `backend/src/db/migrations/`.",
        },
      },
      {
        title: { ro: "API REST", en: "REST API" },
        time: "5 min",
        body: {
          ro: "Backend-ul expune un API REST pe `/api/` cu module:\n- `/api/auth` — login, register, Google OAuth, refresh, logout\n- `/api/lands` — CRUD terenuri\n- `/api/sensors` — asociere, calibrare senzori\n- `/api/readings` — citiri pe teren cu filtre de perioadă\n- `/api/alerts` — alerte + reguli de alerte\n- `/api/economics` — tranzacții + sumar financiar\n- `/api/weather` — date meteo + reverse geocoding\n- `/api/recommendations` — recomandări zilnice pe bază de date\n- `/api/ai` — chat GPT-4, analiză imagini, istoric conversații\n- `/api/apia` — parcele, calendar, calculator subvenții\n- `/api/exports` — PDF și CSV pe teren/economie\n- `/api/admin` — management utilizatori (doar ADMIN)\n\nAutentificarea folosește JWT Bearer tokens. Refresh se face automat din frontend.",
          en: "The backend exposes a REST API at `/api/` with modules:\n- `/api/auth` — login, register, Google OAuth, refresh, logout\n- `/api/lands` — land CRUD\n- `/api/sensors` — sensor pairing, calibration\n- `/api/readings` — readings per land with period filters\n- `/api/alerts` — alerts + alert rules\n- `/api/economics` — transactions + financial summary\n- `/api/weather` — weather data + reverse geocoding\n- `/api/recommendations` — daily recommendations based on data\n- `/api/ai` — GPT-4 chat, image analysis, conversation history\n- `/api/apia` — parcels, calendar, subsidy calculator\n- `/api/exports` — PDF and CSV per land/economics\n- `/api/admin` — user management (ADMIN only)\n\nAuthentication uses JWT Bearer tokens. Refresh is handled automatically by the frontend.",
        },
      },
    ],
  },
  setup: {
    icon: Terminal,
    title: { ro: "Instalare Locală", en: "Local Setup" },
    desc: {
      ro: "Pornește aplicația pe calculator în câteva minute.",
      en: "Run the app on your machine in a few minutes.",
    },
    articles: [
      {
        title: { ro: "Cerințe", en: "Requirements" },
        time: "1 min",
        body: {
          ro: "- **Node.js** ≥ 18\n- **PostgreSQL** ≥ 14 (sau Docker)\n- **npm** sau **yarn**\n- O cheie **OpenWeather API** (gratuită)\n- O cheie **OpenAI API** (opțional, pentru AI chat)\n- **Google Client ID** (opțional, pentru Google OAuth)",
          en: "- **Node.js** ≥ 18\n- **PostgreSQL** ≥ 14 (or Docker)\n- **npm** or **yarn**\n- An **OpenWeather API** key (free)\n- An **OpenAI API** key (optional, for AI chat)\n- **Google Client ID** (optional, for Google OAuth)",
        },
      },
      {
        title: { ro: "Backend", en: "Backend" },
        time: "4 min",
        body: {
          ro: "```\ncd backend\nnpm install\ncp .env.example .env   # completează variabilele\nnpm run db:migrate     # creează tabelele\nnpm run dev            # pornește pe :4000\n```\n\nVariabile `.env` importante: `DATABASE_URL`, `JWT_SECRET`, `OPENWEATHER_KEY`, `OPENAI_API_KEY`, `GOOGLE_CLIENT_ID`.",
          en: "```\ncd backend\nnpm install\ncp .env.example .env   # fill in variables\nnpm run db:migrate     # create tables\nnpm run dev            # starts on :4000\n```\n\nImportant `.env` variables: `DATABASE_URL`, `JWT_SECRET`, `OPENWEATHER_KEY`, `OPENAI_API_KEY`, `GOOGLE_CLIENT_ID`.",
        },
      },
      {
        title: { ro: "Frontend", en: "Frontend" },
        time: "3 min",
        body: {
          ro: "```\ncd frontend\nnpm install\ncp .env.example .env   # setează VITE_API_URL=http://localhost:4000\nnpm run dev            # pornește pe :5173\n```\n\nDeschide `http://localhost:5173` în browser. Frontend-ul se conectează automat la backend.",
          en: "```\ncd frontend\nnpm install\ncp .env.example .env   # set VITE_API_URL=http://localhost:4000\nnpm run dev            # starts on :5173\n```\n\nOpen `http://localhost:5173` in the browser. The frontend connects to the backend automatically.",
        },
      },
      {
        title: { ro: "Docker (alternativă)", en: "Docker (alternative)" },
        time: "2 min",
        body: {
          ro: "Poți folosi Docker Compose pentru totul:\n```\ncd backend\ndocker compose up -d\n```\nAceasta pornește PostgreSQL + backend-ul. Frontend-ul rulează separat cu `npm run dev` în folderul `frontend/`.",
          en: "You can use Docker Compose for everything:\n```\ncd backend\ndocker compose up -d\n```\nThis starts PostgreSQL + the backend. The frontend runs separately with `npm run dev` in the `frontend/` folder.",
        },
      },
    ],
  },
  troubleshooting: {
    icon: HelpCircle,
    title: { ro: "Depanare", en: "Troubleshooting" },
    desc: {
      ro: "Rezolvă rapid cele mai frecvente probleme.",
      en: "Quickly solve the most common issues.",
    },
    articles: [
      {
        title: { ro: "Senzorul nu trimite date", en: "Sensor not sending data" },
        time: "3 min",
        body: {
          ro: "**Verifică:**\n1. WiFi-ul plăcii — LED-ul de conectare ar trebui să fie aprins\n2. `sensor_code` din firmware se potrivește cu cel din AgriOne\n3. URL-ul backend-ului din firmware este corect\n4. Alimentarea — folosește o sursă stabilă de 5V\n5. Serial monitor — verifică mesajele de eroare HTTP\n\nDacă placa e conectată dar AgriOne nu afișează date, verifică și calibrarea (offset-urile extreme pot ascunde citirile).",
          en: "**Check:**\n1. Board WiFi — the connection LED should be on\n2. `sensor_code` in firmware matches the one in AgriOne\n3. Backend URL in firmware is correct\n4. Power supply — use a stable 5V source\n5. Serial monitor — check HTTP error messages\n\nIf the board is connected but AgriOne shows no data, also check calibration (extreme offsets can hide readings).",
        },
      },
      {
        title: { ro: "Eroare la autentificare", en: "Authentication error" },
        time: "2 min",
        body: {
          ro: "- **\"Sesiunea a expirat\"** — se rezolvă automat prin refresh token. Dacă persistă, deconectează-te și reconectează-te.\n- **\"Email sau parolă greșită\"** — verifică datele. Poți folosi **Am uitat parola** pentru reset.\n- **Google login nu funcționează** — verifică dacă popup-urile sunt permise în browser. Dezactivează extensiile de adblock temporar.",
          en: "- **\"Session expired\"** — resolved automatically via refresh token. If it persists, log out and log back in.\n- **\"Wrong email or password\"** — check your credentials. You can use **Forgot password** to reset.\n- **Google login not working** — check if popups are allowed in the browser. Temporarily disable adblock extensions.",
        },
      },
      {
        title: { ro: "Dashboard-ul nu afișează date", en: "Dashboard shows no data" },
        time: "2 min",
        body: {
          ro: "Asigură-te că: 1) Ai cel puțin un teren adăugat, 2) Un senzor este asociat la teren, 3) Senzorul a trimis cel puțin o citire. Datele meteo necesită o locație setată (din profil sau din coordonatele terenului). Dacă graficele sunt goale, schimbă filtrul de perioadă.",
          en: "Make sure that: 1) You have at least one land added, 2) A sensor is linked to the land, 3) The sensor has sent at least one reading. Weather data requires a location set (from profile or land coordinates). If charts are empty, change the period filter.",
        },
      },
    ],
  },
};

const sectionOrder = [
  "getting-started",
  "sensors",
  "alerts",
  "economics",
  "maps",
  "weather",
  "apia",
  "architecture",
  "setup",
  "troubleshooting",
];

/* ─── Expandable article component ──────────────── */

function Article({ article, index, language }) {
  const [open, setOpen] = useState(false);
  const getText = (o) => o[language] || o.en;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-border/20 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            {index + 1}
          </span>
          <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">
            {getText(article.title)}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {article.time}
          </span>
          <Motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-muted-foreground" />
          </Motion.div>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 border-t border-border/10">
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {getText(article.body)
                  .split("\n")
                  .map((line, i) => {
                    if (line.startsWith("```")) return null;
                    if (line.match(/^\s*$/)) return <br key={i} />;
                    // Bold
                    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
                      p.startsWith("**") && p.endsWith("**") ? (
                        <strong key={j} className="text-foreground font-semibold">
                          {p.slice(2, -2)}
                        </strong>
                      ) : (
                        <span key={j}>{p}</span>
                      )
                    );
                    // Code blocks
                    if (line.startsWith("- ") || line.match(/^\d+\./)) {
                      return (
                        <div key={i} className="pl-2 py-0.5">
                          {parts}
                        </div>
                      );
                    }
                    // Inline code
                    const withCode = parts.map((p, j) => {
                      if (typeof p === "string" || p?.props?.children) {
                        const text = typeof p === "string" ? p : p.props.children;
                        if (typeof text === "string" && text.includes("`")) {
                          return (
                            <span key={j}>
                              {text.split(/(`[^`]+`)/g).map((seg, k) =>
                                seg.startsWith("`") && seg.endsWith("`") ? (
                                  <code
                                    key={k}
                                    className="px-1.5 py-0.5 rounded bg-secondary/60 text-foreground text-xs font-mono"
                                  >
                                    {seg.slice(1, -1)}
                                  </code>
                                ) : (
                                  seg
                                )
                              )}
                            </span>
                          );
                        }
                      }
                      return p;
                    });
                    return (
                      <p key={i} className="my-1">
                        {withCode}
                      </p>
                    );
                  })}
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
}

/* ─── Main page ──────────────────────────────────── */

export default function DocumentationPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");

  const getText = (o) => o[language] || o.en;

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sectionOrder;
    const q = searchQuery.toLowerCase();
    return sectionOrder.filter((key) => {
      const s = docs[key];
      return (
        getText(s.title).toLowerCase().includes(q) ||
        getText(s.desc).toLowerCase().includes(q) ||
        s.articles.some(
          (a) =>
            getText(a.title).toLowerCase().includes(q) ||
            getText(a.body).toLowerCase().includes(q)
        )
      );
    });
  }, [searchQuery, language]);

  // Make sure active section is visible after search
  const currentActive =
    filteredSections.includes(activeSection) ? activeSection : filteredSections[0] || "getting-started";
  const section = docs[currentActive];

  return (
    <LandingLayout>
      <LandingNavbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative py-14 lg:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl mx-auto"
            >
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-5"
              >
                <ArrowLeft size={16} />
                {language === "ro" ? "Pagina principală" : "Home"}
              </button>

              <Badge variant="primary" className="mb-3">
                <BookOpen size={14} className="mr-1.5" />
                {language === "ro" ? "Documentație" : "Documentation"}
              </Badge>

              <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
                {language === "ro" ? "Documentație " : ""}
                <span className="text-primary">AgriOne</span>
                {language === "en" ? " Docs" : ""}
              </h1>

              <p className="text-base text-muted-foreground mb-6">
                {language === "ro"
                  ? "Ghiduri pas cu pas, referințe tehnice și tot ce ai nevoie ca să folosești platforma eficient."
                  : "Step-by-step guides, technical references and everything you need to use the platform effectively."}
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === "ro" ? "Caută..." : "Search..."}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/80 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </Motion.div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="pb-20 lg:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[240px_1fr] gap-8">
              {/* Sidebar */}
              <nav className="lg:sticky lg:top-24 lg:self-start space-y-0.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-2">
                  {language === "ro" ? "Secțiuni" : "Sections"}
                </p>
                {filteredSections.map((key) => {
                  const s = docs[key];
                  const Icon = s.icon;
                  const active = key === currentActive;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-primary" : ""} />
                      <span className="truncate">{getText(s.title)}</span>
                    </button>
                  );
                })}
                {filteredSections.length === 0 && (
                  <p className="text-sm text-muted-foreground px-2 py-3">
                    {language === "ro" ? "Niciun rezultat." : "No results."}
                  </p>
                )}
              </nav>

              {/* Content panel */}
              {section && (
                <Motion.div
                  key={currentActive}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Section header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-0.5">{getText(section.title)}</h2>
                      <p className="text-sm text-muted-foreground">{getText(section.desc)}</p>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="space-y-2">
                    {section.articles.map((article, i) => (
                      <Article key={i} article={article} index={i} language={language} />
                    ))}
                  </div>

                  {/* Bottom nav */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
                    {(() => {
                      const idx = sectionOrder.indexOf(currentActive);
                      const prev = idx > 0 ? sectionOrder[idx - 1] : null;
                      const next = idx < sectionOrder.length - 1 ? sectionOrder[idx + 1] : null;
                      return (
                        <>
                          {prev ? (
                            <button
                              onClick={() => setActiveSection(prev)}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              <ArrowLeft size={14} />
                              {getText(docs[prev].title)}
                            </button>
                          ) : (
                            <span />
                          )}
                          {next ? (
                            <button
                              onClick={() => setActiveSection(next)}
                              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {getText(docs[next].title)}
                              <ArrowRight size={14} />
                            </button>
                          ) : (
                            <span />
                          )}
                        </>
                      );
                    })()}
                  </div>
                </Motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-8 lg:p-10 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
              <HelpCircle size={36} className="text-primary mx-auto mb-4" />
              <h2 className="text-xl lg:text-2xl font-bold mb-3">
                {language === "ro" ? "Ai nevoie de ajutor?" : "Need help?"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {language === "ro"
                  ? "Vizitează centrul de ajutor sau contactează-ne direct."
                  : "Visit the help center or reach out to us directly."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => navigate("/help")} variant="primary" size="sm">
                  {language === "ro" ? "Centru de Ajutor" : "Help Center"}
                </Button>
                <Button onClick={() => navigate("/")} variant="ghost" size="sm">
                  {language === "ro" ? "Pagina principală" : "Home"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingLayout>
  );
}
