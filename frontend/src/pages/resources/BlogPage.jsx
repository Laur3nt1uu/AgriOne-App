import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Cpu,
  Droplets,
  Filter,
  Leaf,
  Search,
  Sprout,
  Sun,
  Tag,
  TrendingUp,
  User,
  Wheat,
  Share2,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const blogArticles = [
  {
    id: 1,
    slug: "iot-agricultura-romania",
    featured: true,
    category: "technology",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop",
    title: {
      ro: "Cum IoT transformă agricultura în România",
      en: "How IoT is transforming agriculture in Romania",
    },
    excerpt: {
      ro: "Descoperă cum senzorii inteligenți ajută fermierii să economisească apă și să crească recolta cu până la 30%. Un ghid complet despre agricultura inteligentă.",
      en: "Discover how smart sensors help farmers save water and increase yields by up to 30%. A complete guide to smart agriculture.",
    },
    author: "AgriOne Team",
    date: "2024-03-10",
    readTime: "8 min",
    tags: ["IoT", "Senzori", "Irigații"],
    content: {
      ro: [
        "Internetul Lucrurilor (IoT) revoluționează modul în care fermierii din România își gestionează terenurile. Senzori inteligenți, dispozitive conectate și analiza datelor în timp real transformă agricultura tradițională într-o activitate bazată pe date precise și decizii informate.",
        "Studiile recente arată că fermierii care adoptă soluții IoT economisesc în medie 35% din consumul de apă și înregistrează creșteri ale recoltei de 20–30%. Senzorii de umiditate a solului, de temperatură și de luminozitate transmit date constant, permițând ajustarea automată a sistemelor de irigație și fertilizare.",
        "În România, platforme precum AgriOne fac această tehnologie accesibilă fermierilor de toate dimensiunile. Un kit de senzori connect poate fi instalat într-o zi, fără cunoștințe tehnice avansate. Datele sunt vizualizate pe telefon sau calculator, oferind o imagine clară a stării fiecărui teren în orice moment.",
        "Cel mai mare beneficiu raportat de fermieri nu este doar economic, ci și reducerea stresului operațional. În loc să verifice fizic fiecare teren zilnic, aceștia primesc notificări automate atunci când parametrii ies din intervalul optim, intervenind exact când este necesar.",
        "Adopția IoT în agricultură este în creștere accelerată. Dacă în 2020 mai puțin de 5% din fermele din România foloseau senzori conectați, în 2024 estimările indică peste 18%, cu o tendință clară de accelerare pe fond de simplificare a tehnologiei și reducere a costurilor.",
      ],
      en: [
        "The Internet of Things (IoT) is revolutionizing how farmers in Romania manage their lands. Smart sensors, connected devices and real-time data analytics are transforming traditional agriculture into a data-driven activity based on precise information and informed decisions.",
        "Recent studies show that farmers who adopt IoT solutions save an average of 35% in water consumption and record crop increases of 20–30%. Soil moisture, temperature and luminosity sensors transmit data constantly, allowing automatic adjustment of irrigation and fertilization systems.",
        "In Romania, platforms like AgriOne make this technology accessible to farmers of all sizes. A connected sensor kit can be installed in a day, without advanced technical knowledge. Data is visualized on phone or computer, giving a clear picture of each field's status at any time.",
        "The biggest benefit reported by farmers is not just economic, but also reducing operational stress. Instead of physically checking each field daily, they receive automatic notifications when parameters go out of the optimal range, intervening exactly when needed.",
        "IoT adoption in agriculture is growing rapidly. While in 2020 less than 5% of Romanian farms used connected sensors, in 2024 estimates indicate over 18%, with a clear acceleration trend as technology simplifies and costs reduce.",
      ],
    },
  },
  {
    id: 2,
    slug: "ghid-senzori-sol",
    category: "sensors",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    title: {
      ro: "Ghid complet: Senzori de umiditate pentru sol",
      en: "Complete guide: Soil moisture sensors",
    },
    excerpt: {
      ro: "Tot ce trebuie să știi despre senzorii de umiditate: tipuri, instalare, calibrare și interpretarea datelor pentru o irigație optimă.",
      en: "Everything you need to know about moisture sensors: types, installation, calibration and data interpretation for optimal irrigation.",
    },
    author: "Ing. Alexandru Popa",
    date: "2024-03-05",
    readTime: "12 min",
    tags: ["Senzori", "Sol", "Umiditate"],
    content: {
      ro: [
        "Senzorii de umiditate a solului sunt inima oricărui sistem de agricultură inteligentă. Aceștia măsoară conținutul de apă din sol și transmit date în timp real, permițând fermerilor să irige exact când și cât este nevoie, eliminând risipa și stresul hidric al plantelor.",
        "Există două tipuri principale de senzori folosiți în agricultură: rezistivi și capacitivi. Senzorii rezistivi sunt mai ieftini, dar se degradează mai rapid din cauza coroziunii. Senzorii capacitivi, deși mai scumpi, oferă citiri mai precise și au o durată de viață mult mai mare — recomandarea generală pentru agricultura comercială.",
        "Instalarea unui senzor este simplă: se introduce în sol la adâncimea rădăcinilor active ale culturii (10–30 cm pentru cereale, 20–40 cm pentru legume). Este important să se evite zona imediat în jurul tulpinii și să se asigure contact bun cu solul, fără goluri de aer.",
        "Calibrarea este esențială pentru citiri precise. Procesul implică două măsurători de referință: senzorul în sol complet uscat (valoare minimă) și senzorul în sol complet saturat cu apă (valoare maximă). AgriOne oferă un ghid pas cu pas pentru calibrare direct din interfața aplicației.",
        "Interpretarea datelor: valorile optime de umiditate variază pe cultură. Grâul preferă 50–70% din capacitatea de câmp, porumbul 60–80%, legumele 70–85%. Sistemul AgriOne include praguri predefinite pentru principalele culturi românești, cu posibilitate de personalizare.",
      ],
      en: [
        "Soil moisture sensors are the heart of any smart agriculture system. They measure the water content in soil and transmit real-time data, allowing farmers to irrigate exactly when and how much is needed, eliminating waste and plant water stress.",
        "There are two main types of sensors used in agriculture: resistive and capacitive. Resistive sensors are cheaper but degrade faster due to corrosion. Capacitive sensors, though more expensive, offer more precise readings and have a much longer lifespan — the general recommendation for commercial agriculture.",
        "Installing a sensor is simple: insert it into the soil at the depth of the active roots of the crop (10–30 cm for cereals, 20–40 cm for vegetables). It's important to avoid the area immediately around the stem and ensure good contact with the soil, without air gaps.",
        "Calibration is essential for accurate readings. The process involves two reference measurements: the sensor in completely dry soil (minimum value) and the sensor in soil completely saturated with water (maximum value). AgriOne provides a step-by-step calibration guide directly from the app interface.",
        "Data interpretation: optimal humidity values vary by crop. Wheat prefers 50–70% of field capacity, corn 60–80%, vegetables 70–85%. The AgriOne system includes predefined thresholds for major Romanian crops, with customization options.",
      ],
    },
  },
  {
    id: 3,
    slug: "economia-apei-agricultura",
    category: "sustainability",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop",
    title: {
      ro: "Economisirea apei în agricultură: Strategii moderne",
      en: "Water conservation in agriculture: Modern strategies",
    },
    excerpt: {
      ro: "Cu schimbările climatice, apa devine o resursă tot mai prețioasă. Află cum poți reduce consumul de apă cu până la 40% folosind tehnologia.",
      en: "With climate change, water is becoming an increasingly precious resource. Learn how you can reduce water consumption by up to 40% using technology.",
    },
    author: "Dr. Maria Ionescu",
    date: "2024-02-28",
    readTime: "6 min",
    tags: ["Sustenabilitate", "Irigații", "Apă"],
    content: {
      ro: [
        "Agricultura consumă aproximativ 70% din apa dulce utilizată la nivel global. În contextul schimbărilor climatice și al secetelor tot mai frecvente în România, optimizarea consumului de apă nu mai este o opțiune, ci o necesitate economică și ecologică.",
        "Irigația prin picurare combinată cu senzori de umiditate poate reduce consumul de apă cu 40–50% față de irigația tradițională prin aspersie. Apa este livrată direct la rădăcina plantei, exact în cantitatea necesară, eliminând evaporarea de suprafață și scurgerea în exces.",
        "Analiza datelor meteorologice în corelație cu umiditatea solului permite programarea inteligentă a irigației. Sistemele moderne pot integra prognoza meteo: dacă urmează precipitații în 24 de ore, irigația se amână automat, economisind apă și energie.",
        "Cultivarea soiurilor rezistente la secetă reprezintă o altă strategie complementară. Cercetările agricole românești au produs varietăți de porumb, grâu și floarea-soarelui adaptate condițiilor de stres hidric, cu performanțe bune chiar și cu 20% mai puțină apă.",
        "Investiția în sisteme de monitorizare a umidității se amortizează de obicei în primul sezon de cultură prin economii la apă și energie. Pe termen lung, protejarea calității solului prin evitarea suprairigației reprezintă un beneficiu cu valoare mult mai mare decât economiile directe.",
      ],
      en: [
        "Agriculture consumes approximately 70% of fresh water used globally. In the context of climate change and increasingly frequent droughts in Romania, optimizing water consumption is no longer an option, but an economic and ecological necessity.",
        "Drip irrigation combined with moisture sensors can reduce water consumption by 40–50% compared to traditional sprinkler irrigation. Water is delivered directly to the plant root, in exactly the required amount, eliminating surface evaporation and excess runoff.",
        "Analysis of meteorological data correlated with soil moisture enables intelligent irrigation scheduling. Modern systems can integrate weather forecasts: if precipitation is expected within 24 hours, irrigation is automatically postponed, saving water and energy.",
        "Growing drought-resistant varieties is another complementary strategy. Romanian agricultural research has produced varieties of corn, wheat and sunflower adapted to water stress conditions, with good performance even with 20% less water.",
        "The investment in humidity monitoring systems usually pays off in the first growing season through water and energy savings. Long-term, protecting soil quality by avoiding over-irrigation represents a benefit of much greater value than direct savings.",
      ],
    },
  },
  {
    id: 4,
    slug: "culturi-porumb-2024",
    category: "crops",
    image: "https://images.unsplash.com/photo-1601593768319-9e0b64d5e6d4?w=800&h=400&fit=crop",
    title: {
      ro: "Cultura porumbului în 2024: Tendințe și recomandări",
      en: "Corn cultivation in 2024: Trends and recommendations",
    },
    excerpt: {
      ro: "Analiză completă a sezonului de porumb: prețuri, soiuri recomandate, calendarul lucrărilor și sfaturi pentru maximizarea recoltei.",
      en: "Complete analysis of the corn season: prices, recommended varieties, work schedule and tips for maximizing harvest.",
    },
    author: "Ion Popescu",
    date: "2024-02-20",
    readTime: "10 min",
    tags: ["Porumb", "Culturi", "2024"],
    content: {
      ro: [
        "Porumbul rămâne una dintre cele mai cultivate plante în România, cu aproximativ 2,5 milioane hectare anual. Sezonul 2024 vine cu provocări legate de inputuri scumpe, dar și cu oportunități generate de cererea crescută pe piețele europene.",
        "Soiurile recomandate pentru 2024 includ hibrizi cu FAO 400–500 pentru zonele din sudul țării, unde riscul de secetă este mai mare. Hibrizi precum Pioneer P9241, Dekalb DKC4717 și Syngenta NK Falkone au demonstrat performanțe bune în condițiile climatice din ultimii ani.",
        "Calendarul optim al lucrărilor: pregătirea solului toamna (scarifiat, arătură adâncă), fertilizarea de bază cu fosfor și potasiu înainte de semănat, semănatul la temperatura solului de minimum 10°C (de obicei 15–30 aprilie), prima fertilizare cu azot la 6–8 frunze.",
        "Monitorizarea cu senzori a umidității și temperaturii solului pe parcursul sezonului permite fertilizarea și irigarea precisă. Datele arată că fermierii care folosesc monitorizare continuă reduc cheltuielile cu inputuri de 15–20% menținând sau crescând producția.",
        "Recolta estimată pentru 2024 variază între 6–10 t/ha în condiții normale, cu potențial de 12–14 t/ha la irigat cu management precis. Prețurile de referință EX Works Romania se situează în intervalul 180–220 EUR/tonă, oferind marje acceptabile la costuri de producție de 900–1200 EUR/ha.",
      ],
      en: [
        "Corn remains one of the most cultivated plants in Romania, with approximately 2.5 million hectares annually. The 2024 season comes with challenges related to expensive inputs, but also with opportunities generated by increased demand on European markets.",
        "Recommended varieties for 2024 include hybrids with FAO 400–500 for areas in the south of the country, where drought risk is higher. Hybrids such as Pioneer P9241, Dekalb DKC4717 and Syngenta NK Falkone have demonstrated good performance in the climatic conditions of recent years.",
        "Optimal work schedule: soil preparation in autumn (scarifying, deep plowing), base fertilization with phosphorus and potassium before sowing, sowing at minimum soil temperature of 10°C (usually April 15–30), first nitrogen fertilization at 6–8 leaves.",
        "Sensor monitoring of soil moisture and temperature throughout the season allows precise fertilization and irrigation. Data shows farmers who use continuous monitoring reduce input costs by 15–20% while maintaining or increasing production.",
        "Estimated yield for 2024 varies between 6–10 t/ha under normal conditions, with potential of 12–14 t/ha under irrigated precise management. Reference EX Works Romania prices are in the range of 180–220 EUR/tonne, offering acceptable margins at production costs of 900–1200 EUR/ha.",
      ],
    },
  },
  {
    id: 5,
    slug: "subventii-apia-2024",
    category: "economics",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    title: {
      ro: "Subvenții APIA 2024: Tot ce trebuie să știi",
      en: "APIA Subsidies 2024: Everything you need to know",
    },
    excerpt: {
      ro: "Ghid actualizat despre subvențiile agricole: termene, documente necesare, calcul plăți și noutățile campaniei 2024.",
      en: "Updated guide on agricultural subsidies: deadlines, required documents, payment calculation and 2024 campaign news.",
    },
    author: "Consultant APIA",
    date: "2024-02-15",
    readTime: "15 min",
    tags: ["APIA", "Subvenții", "Finanțe"],
    content: {
      ro: [
        "Campania APIA 2024 aduce modificări importante față de anul precedent. Plata de bază pe suprafață (SPS) a crescut la 152 EUR/ha, iar noile eco-scheme oferă bonusuri de până la 75 EUR/ha suplimentar pentru practici agricole prietenoase cu mediul.",
        "Termenele importante ale campaniei 2024: depunerea cererii unice — 1 martie – 15 mai (fără penalizare). Depunerea întârziată este posibilă până la 9 iunie cu o penalizare de 1% pe zi lucrătoare. Documentele necesare: actul de identitate, dovada dreptului de utilizare a terenului (contract arendă, titlu proprietate), extras din Registrul Agricol.",
        "Noutățile eco-schemelor 2024 vizează: rotația culturilor (minimum 3 culturi diferite pe fermă), menținerea terenurilor necultivate (minim 4% din suprafața arabilă), utilizarea redusă a pesticidelor chimice. Fermierii care îndeplinesc aceste criterii primesc plăți suplimentare automat.",
        "Calculul orientativ al plăților pentru o fermă de 100 ha: plata de bază 15.200 EUR + plata redistributivă pentru primele 30 ha: 3.600 EUR + eco-scheme (dacă eligibil): 7.500 EUR. Total estimat: ~26.300 EUR pentru o fermă de 100 ha cu eco-scheme complete.",
        "AgriOne integrează funcționalitatea de calcul APIA care estimează automat plățile eligibile pe baza suprafețelor terenurilor înregistrate în platformă. Această funcție este disponibilă din meniul Terenuri → APIA, simplificând planificarea financiară a fermei.",
      ],
      en: [
        "The 2024 APIA campaign brings important changes compared to the previous year. The basic area payment (SPS) has increased to 152 EUR/ha, and the new eco-schemes offer bonuses of up to 75 EUR/ha additionally for environmentally friendly agricultural practices.",
        "Important 2024 campaign deadlines: single application submission — March 1 – May 15 (without penalty). Late submission is possible until June 9 with a penalty of 1% per working day. Required documents: identity document, proof of right to use land (tenancy contract, property title), extract from Agricultural Register.",
        "The 2024 eco-scheme novelties target: crop rotation (minimum 3 different crops on farm), maintenance of uncultivated land (minimum 4% of arable area), reduced use of chemical pesticides. Farmers who meet these criteria receive additional payments automatically.",
        "Indicative payment calculation for a 100 ha farm: base payment 15,200 EUR + redistributive payment for first 30 ha: 3,600 EUR + eco-schemes (if eligible): 7,500 EUR. Estimated total: ~26,300 EUR for a 100 ha farm with full eco-schemes.",
        "AgriOne integrates APIA calculation functionality that automatically estimates eligible payments based on land areas registered in the platform. This feature is available from the Lands → APIA menu, simplifying farm financial planning.",
      ],
    },
  },
  {
    id: 6,
    slug: "temperatura-sol-culturi",
    category: "sensors",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
    title: {
      ro: "Importanța temperaturii solului pentru culturi",
      en: "The importance of soil temperature for crops",
    },
    excerpt: {
      ro: "De ce temperatura solului este esențială pentru germinare și creștere. Cum să monitorizezi și să optimizezi condițiile pentru fiecare cultură.",
      en: "Why soil temperature is essential for germination and growth. How to monitor and optimize conditions for each crop.",
    },
    author: "Ing. Andrei Moldovan",
    date: "2024-02-10",
    readTime: "7 min",
    tags: ["Temperatură", "Sol", "Monitorizare"],
    content: {
      ro: [
        "Temperatura solului influențează toate procesele biologice fundamentale: germinarea semințelor, absorbția apei și nutrienților, activitatea microbiologică și rata de creștere a rădăcinilor. Mulți fermieri neglijează acest parametru, concentrându-se exclusiv pe umiditate, dar temperaturile suboptimale pot anula toate celelalte avantaje.",
        "Pragurile minime de germinare variază pe cultură: grâul germinează la 3–5°C, porumbul la 10°C, floarea-soarelui la 8°C, soia la 12°C. Semănatul sub aceste temperaturi duce la germinare neuniformă, pierderi de sămânță și răsărire slabă, probleme care nu pot fi remediate ulterior.",
        "Monitorizarea temperaturii solului cu senzori tip DS18B20 la adâncimea de 10 cm oferă datele necesare pentru decizia optimă de semănat. Senzorii AgriOne afișează temperatura în timp real și alertează fermierul atunci când condițiile sunt propice pentru semănat sau când există risc de îngheț tardiv.",
        "Temperatura solului influențează și eficiența îngrășămintelor. Azotul din îngrășămintele minerale este absorbit eficient de plante doar la temperaturi ale solului de peste 10°C. Aplicarea îngrășămintelor cu azot pe sol rece, sub 5°C, duce la pierderi prin levigare fără beneficii pentru cultură.",
        "Sfat practic: înregistrați temperatura solului în primăvară din 1 martie și urmăriți tendința. Creșterile constante de 1–2°C pe săptămână indică un sezon bun. Variațiile mari între zi și noapte în sol (peste 8°C) semnalează un sol cu structură slabă care necesită îmbunătățire.",
      ],
      en: [
        "Soil temperature influences all fundamental biological processes: seed germination, water and nutrient absorption, microbiological activity and root growth rate. Many farmers neglect this parameter, focusing exclusively on moisture, but suboptimal temperatures can negate all other advantages.",
        "Minimum germination thresholds vary by crop: wheat germinates at 3–5°C, corn at 10°C, sunflower at 8°C, soy at 12°C. Sowing below these temperatures leads to uneven germination, seed losses and poor emergence, problems that cannot be remedied later.",
        "Monitoring soil temperature with DS18B20 sensors at 10 cm depth provides the data needed for the optimal sowing decision. AgriOne sensors display real-time temperature and alert the farmer when conditions are right for sowing or when there is risk of late frost.",
        "Soil temperature also influences fertilizer efficiency. Nitrogen from mineral fertilizers is efficiently absorbed by plants only at soil temperatures above 10°C. Applying nitrogen fertilizers on cold soil, below 5°C, leads to leaching losses without benefits for the crop.",
        "Practical tip: record soil temperature in spring from March 1st and monitor the trend. Consistent increases of 1–2°C per week indicate a good season. Large day-night variations in soil (over 8°C) signal a soil with weak structure that needs improvement.",
      ],
    },
  },
  {
    id: 7,
    slug: "automatizare-irigatie",
    category: "technology",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=400&fit=crop",
    title: {
      ro: "Automatizarea irigației: De la idee la implementare",
      en: "Irrigation automation: From idea to implementation",
    },
    excerpt: {
      ro: "Pas cu pas: cum să implementezi un sistem de irigație automată bazat pe senzori. Costuri, componente și configurare.",
      en: "Step by step: how to implement an automatic irrigation system based on sensors. Costs, components and configuration.",
    },
    author: "AgriOne Team",
    date: "2024-02-01",
    readTime: "14 min",
    tags: ["Automatizare", "Irigații", "DIY"],
    content: {
      ro: [
        "Un sistem de irigație automată bazat pe senzori poate fi implementat modular, pornind de la o investiție minimă de 300–500 EUR și scalând pe măsură ce demonstrezi rezultatele. Nu este nevoie să automatizezi totul de la început — chiar și monitorizarea fără automatizare poate aduce economii semnificative.",
        "Componentele unui sistem de bază: senzor de umiditate sol (15–40 EUR), microcontroller ESP32 sau Arduino (5–15 EUR), releu pentru controlul pompei (3–8 EUR), pompă submersibilă sau electroventil (30–150 EUR depending on scale), carcasă IP65 pentru protecție (10–20 EUR). Total sistem de bază: 65–235 EUR per zonă de irigație.",
        "Configurarea software: platforma AgriOne primește datele de la senzori prin WiFi și permite programarea regulilor de irigație. Exemplu: dacă umiditatea sol < 40% și ora este între 20:00–06:00, activează pompa 15 minute. Regulile pot fi setate din aplicație fără cunoștințe de programare.",
        "Implementarea pas cu pas: 1) Instalează senzorii în sol la adâncimea rădăcinilor active. 2) Conectează microcontrollerul la rețeaua WiFi a fermei. 3) Asociază senzorii cu terenul în AgriOne. 4) Setează pragurile de irigație. 5) Conectează releul la pompa sau electroventilul de irigație. 6) Testează în mod manual înainte de a activa automatizarea.",
        "Rezultate concrete raportate de fermieri AgriOne: reducere consum apă 30–45%, scădere cheltuieli energie electrică pompare 25–35%, reducere timp de monitorizare manuală 2–3 ore/zi. Amortizarea investiției se realizează de obicei în primul sezon de cultură.",
      ],
      en: [
        "An automated irrigation system based on sensors can be implemented modularly, starting from a minimum investment of 300–500 EUR and scaling as you demonstrate results. There's no need to automate everything from the start — even monitoring without automation can bring significant savings.",
        "Components of a basic system: soil moisture sensor (15–40 EUR), ESP32 or Arduino microcontroller (5–15 EUR), relay for pump control (3–8 EUR), submersible pump or electrovalve (30–150 EUR depending on scale), IP65 enclosure for protection (10–20 EUR). Total basic system: 65–235 EUR per irrigation zone.",
        "Software configuration: the AgriOne platform receives data from sensors via WiFi and allows programming irrigation rules. Example: if soil moisture < 40% and time is between 20:00–06:00, activate pump for 15 minutes. Rules can be set from the app without programming knowledge.",
        "Step-by-step implementation: 1) Install sensors in soil at active root depth. 2) Connect microcontroller to farm WiFi network. 3) Associate sensors with land in AgriOne. 4) Set irrigation thresholds. 5) Connect relay to irrigation pump or electrovalve. 6) Test manually before activating automation.",
        "Concrete results reported by AgriOne farmers: 30–45% reduction in water consumption, 25–35% decrease in pumping electricity costs, 2–3 hours/day reduction in manual monitoring time. Return on investment is usually achieved in the first growing season.",
      ],
    },
  },
  {
    id: 8,
    slug: "grau-toamna-greseli",
    category: "crops",
    image: "https://images.unsplash.com/photo-1574943320219-5ac2456e5e5f?w=800&h=400&fit=crop",
    title: {
      ro: "5 greșeli comune la grâul de toamnă și cum să le eviți",
      en: "5 common mistakes with winter wheat and how to avoid them",
    },
    excerpt: {
      ro: "Lecții învățate de la fermieri experimentați: ce să faci și ce să nu faci când cultivi grâu de toamnă pentru rezultate optime.",
      en: "Lessons learned from experienced farmers: what to do and what not to do when growing winter wheat for optimal results.",
    },
    author: "Elena Dumitrescu",
    date: "2024-01-25",
    readTime: "8 min",
    tags: ["Grâu", "Sfaturi", "Culturi"],
    content: {
      ro: [
        "Grâul de toamnă este cultura cu cea mai mare suprafață cultivată în România — peste 2 milioane de hectare anual. Cu toate acestea, diferența de producție între fermierii buni și cei excelenți este uriașă: 4 t/ha față de 8 t/ha, deseori din cauza unor greșeli evitabile în managementul culturii.",
        "Greșeala #1: Semănatul prea devreme. Semănatul înainte de 1 octombrie (în zonele de câmpie) determină o înfrățire excesivă urmată de iernat slab și atacuri intense de boli fungice primăvara. Data optimă: 10–25 octombrie pentru câmpie, 5–20 octombrie pentru deal.",
        "Greșeala #2: Densitate prea mare. Fermierilor le este teamă de răsărirea slabă și măresc doza de sămânță. Doza optimă este 220–280 boabe germinabile/m², echivalentul a 170–220 kg sămânță/ha. Densități peste 350 boabe/m² duc la autocompetție, susceptibilitate la cădere și producții mai mici.",
        "Greșeala #3: Fertilizarea cu azot toamna în exces. Azotul aplicat toamna stimulează creșteri vegetative excesive care ierneaza slab. O doză de maximum 30–40 kg N/ha toamna este suficientă; restul azotului se aplică fractionat: la reluarea vegetației și la începutul alungirii paiului.",
        "Greșeala #4: Ignorarea pH-ului solului. Grâul produce optim la pH 6,2–7,2. Un pH sub 5,8 reduce semnificativ disponibilitatea fosforului și molibdenului, indiferent de cât de mult îngrășamant aplici. Verificați pH-ul sol annual și corectați cu amendamente calcaroase dacă este necesar. Greșeala #5: Lipsa monitorizării continue — senzorii IoT elimină această problemă oferind date în timp real.",
      ],
      en: [
        "Winter wheat is the crop with the largest cultivated area in Romania — over 2 million hectares annually. However, the production difference between good and excellent farmers is enormous: 4 t/ha versus 8 t/ha, often due to avoidable mistakes in crop management.",
        "Mistake #1: Sowing too early. Sowing before October 1st (in lowland areas) causes excessive tillering followed by poor wintering and intense fungal disease attacks in spring. Optimal date: October 10–25 for lowlands, October 5–20 for hills.",
        "Mistake #2: Too high density. Farmers fear poor emergence and increase seed rate. The optimal rate is 220–280 germinating seeds/m², equivalent to 170–220 kg seed/ha. Densities above 350 seeds/m² lead to self-competition, susceptibility to lodging and lower yields.",
        "Mistake #3: Excessive nitrogen fertilization in autumn. Nitrogen applied in autumn stimulates excessive vegetative growth that winters poorly. A maximum dose of 30–40 kg N/ha in autumn is sufficient; the rest of the nitrogen is applied fractionated: at vegetation resumption and at the beginning of stem elongation.",
        "Mistake #4: Ignoring soil pH. Wheat produces optimally at pH 6.2–7.2. A pH below 5.8 significantly reduces phosphorus and molybdenum availability, regardless of how much fertilizer you apply. Check soil pH annually and correct with limestone amendments if necessary. Mistake #5: Lack of continuous monitoring — IoT sensors eliminate this problem by providing real-time data.",
      ],
    },
  },
];

const categories = [
  { id: "all", label: { ro: "Toate", en: "All" }, icon: BookOpen },
  { id: "technology", label: { ro: "Tehnologie", en: "Technology" }, icon: Cpu },
  { id: "sensors", label: { ro: "Senzori", en: "Sensors" }, icon: Droplets },
  { id: "crops", label: { ro: "Culturi", en: "Crops" }, icon: Wheat },
  { id: "sustainability", label: { ro: "Sustenabilitate", en: "Sustainability" }, icon: Leaf },
  { id: "economics", label: { ro: "Economie", en: "Economics" }, icon: TrendingUp },
];

const categoryIcon = {
  technology: Cpu,
  sensors: Droplets,
  crops: Wheat,
  sustainability: Leaf,
  economics: TrendingUp,
};

function ArticleReadView({ article, language, onBack }) {
  const getText = (obj) => obj[language] || obj.en;
  const CategoryIcon = categoryIcon[article.category] || BookOpen;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        {language === "ro" ? "Înapoi la articole" : "Back to articles"}
      </button>

      {/* Featured image */}
      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-8">
        <img
          src={article.image}
          alt={getText(article.title)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
          <CategoryIcon size={12} className="mr-1" />
          {categories.find((c) => c.id === article.category)?.label[language]}
        </Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <span className="flex items-center gap-1"><User size={14} />{article.author}</span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(article.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}
        </span>
        <span className="flex items-center gap-1"><Clock size={14} />{article.readTime}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
        {getText(article.title)}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {article.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            <Tag size={10} className="mr-1" />{tag}
          </Badge>
        ))}
      </div>

      <div className="h-px bg-border/30 mb-8" />

      {/* Content */}
      <div className="space-y-5">
        {(article.content?.[language] || article.content?.en || []).map((paragraph, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Share */}
      <div className="mt-10 pt-8 border-t border-border/30 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-muted-foreground">
          {language === "ro" ? "Ți-a fost util acest articol?" : "Was this article helpful?"}
        </div>
        <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <Share2 size={16} />
          {language === "ro" ? "Distribuie" : "Share"}
        </button>
      </div>
    </Motion.div>
  );
}

function ArticleCard({ article, featured = false, language, onClick }) {
  const getText = (obj) => obj[language] || obj.en;
  const CategoryIcon = categoryIcon[article.category] || BookOpen;

  if (featured) {
    return (
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="card overflow-hidden group cursor-pointer"
        onClick={onClick}
      >
        <div className="grid lg:grid-cols-2">
          <div className="relative h-48 sm:h-56 lg:h-full overflow-hidden">
            <img
              src={article.image}
              alt={getText(article.title)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              <Sprout size={12} className="mr-1" />
              {language === "ro" ? "Articol Recomandat" : "Featured Article"}
            </Badge>
          </div>
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <CategoryIcon size={16} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {categories.find((c) => c.id === article.category)?.label[language]}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-3 group-hover:text-primary transition-colors">
              {getText(article.title)}
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-3">{getText(article.excerpt)}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><User size={14} />{article.author}</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(article.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}
              </span>
              <span className="flex items-center gap-1"><Clock size={14} />{article.readTime}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag size={10} className="mr-1" />{tag}
                </Badge>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
              {language === "ro" ? "Citește articolul" : "Read article"}
              <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </Motion.div>
    );
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card overflow-hidden group cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={getText(article.title)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-0 text-xs">
            <CategoryIcon size={12} className="mr-1" />
            {categories.find((c) => c.id === article.category)?.label[language]}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {getText(article.title)}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {getText(article.excerpt)}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><User size={12} />{article.author}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{article.readTime}</span>
        </div>
      </div>
    </Motion.div>
  );
}

export default function BlogPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const getText = (obj) => obj[language] || obj.en;

  const featuredArticle = blogArticles.find((a) => a.featured);
  const regularArticles = blogArticles.filter((a) => !a.featured);

  const filteredArticles = regularArticles.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      getText(article.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getText(article.excerpt).toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <LandingLayout>
      <LandingNavbar />

      <main className="flex-1">
        {selectedArticle ? (
          <ArticleReadView
            article={selectedArticle}
            language={language}
            onBack={() => setSelectedArticle(null)}
          />
        ) : (
          <>
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
                    Blog
                  </Badge>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                    {language === "ro" ? "Articole despre " : "Articles about "}
                    <span className="text-primary">
                      {language === "ro" ? "Agricultură" : "Agriculture"}
                    </span>
                  </h1>

                  <p className="text-lg text-muted-foreground mb-8">
                    {language === "ro"
                      ? "Ghiduri, tutoriale și noutăți despre agricultura inteligentă, senzori IoT, culturi și economie agricolă."
                      : "Guides, tutorials and news about smart agriculture, IoT sensors, crops and agricultural economics."}
                  </p>

                  <div className="relative max-w-xl mx-auto">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={20}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        language === "ro" ? "Caută articole..." : "Search articles..."
                      }
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    />
                  </div>
                </Motion.div>
              </div>
            </section>

            {/* Category Filter */}
            <section className="py-6 border-y border-border/30 bg-card/30 sticky top-14 sm:top-16 z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <Filter size={16} className="text-muted-foreground flex-shrink-0" />
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          activeCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                        }`}
                      >
                        <Icon size={14} />
                        {getText(category.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Featured Article */}
            {featuredArticle && activeCategory === "all" && !searchQuery && (
              <section className="py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <ArticleCard
                    article={featuredArticle}
                    featured
                    language={language}
                    onClick={() => setSelectedArticle(featuredArticle)}
                  />
                </div>
              </section>
            )}

            {/* Articles Grid */}
            <section className="py-12 lg:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article, index) => (
                    <Motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ArticleCard
                        article={article}
                        language={language}
                        onClick={() => setSelectedArticle(article)}
                      />
                    </Motion.div>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-16">
                    <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">
                      {language === "ro"
                        ? "Nu s-au găsit articole pentru această căutare."
                        : "No articles found for this search."}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-16 lg:py-24 bg-card/30 border-y border-border/30">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="card p-8 lg:p-12 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
                    <Sun size={48} className="text-primary mx-auto mb-6" />
                    <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
                      {language === "ro" ? "Fii la curent cu noutățile" : "Stay up to date"}
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                      {language === "ro"
                        ? "Abonează-te la newsletter și primești săptămânal articole noi despre agricultură inteligentă."
                        : "Subscribe to our newsletter and receive weekly articles about smart agriculture."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        placeholder={
                          language === "ro" ? "Adresa ta de email" : "Your email address"
                        }
                        className="flex-1 px-4 py-3 rounded-xl bg-card/80 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <Button variant="primary">
                        {language === "ro" ? "Abonează-te" : "Subscribe"}
                      </Button>
                    </div>
                  </div>
                </Motion.div>
              </div>
            </section>
          </>
        )}
      </main>

      <LandingFooter />
    </LandingLayout>
  );
}
