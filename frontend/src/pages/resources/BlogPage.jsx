import LandingFooter from "../../components/landing/LandingFooter";
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
  FileText,
  Cloud,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import NewsletterSubscribe from "../../components/newsletter/NewsletterSubscribe";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";

const blogArticles = [
  {
    id: 1,
    slug: "ai-agricultura-2026",
    featured: true,
    category: "technology",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop",
    title: {
      ro: "Inteligența Artificială în Agricultura României: Revoluția 2026",
      en: "Artificial Intelligence in Romanian Agriculture: The 2026 Revolution",
    },
    excerpt: {
      ro: "Cum AI predictivă și machine learning transformă complet agricultura modernă. Fermierii cu AI obțin recolte cu 45% mai mari și reduc costurile cu 35%.",
      en: "How predictive AI and machine learning completely transform modern agriculture. Farmers using AI achieve 45% higher yields and reduce costs by 35%.",
    },
    author: "Dr. Andrei Popescu",
    date: "2026-03-12",
    readTime: "9 min",
    tags: ["AI", "Machine Learning", "Smart Agriculture"],
    content: {
      ro: [
        "Anul 2026 marchează un punct de cotitură în agricultura românească: peste 32% dintre fermele comerciale folosesc deja soluții de inteligență artificială predictivă. AgriOne și alte platforme integrate AI analizează în timp real milioane de puncte de date - meteo, umiditate sol, nutrienți, satelit - și oferă recomandări precise care transformă complet managementul fermei.",
        "Studiile din 2025-2026 relevă rezultate impresionante: fermierii care integrează AI în deciziile zilnice obțin creșteri medii de recoltă de 42-48% comparativ cu agricultura tradițională, reduc consumul de apă cu 38-44%, scad utilizarea de pesticide cu 55% și economisesc 30-35% din costurile totale de operare.",
        "Funcțiile AI din AgriOne includ: predicții meteo locale ultra-precise (6 ore - 14 zile), alerte de risc boli/dăunători cu 7-10 zile înainte, recomandări automate de irigație și fertilizare personalizate pe parcelă, predicții de recoltă cu acuratețe 92%+, optimizare logistică pentru lucrări agricole și analize comparative automate între terenuri.",
        "Avantajul concurențial este uriaș. Un fermier din Teleorman care folosește AI știe exact: când să sămene (la ziua optimă), câtă apă să dea și când (eliminând risipa), ce doză de îngrășământ exact pe zonă (economie 25-40%), când să trateze preventiv (înainte să apară problema), când să recolteze (la maturitatea perfectă). Deciziile bazate pe date, nu pe intuiție sau 'luna din calendar'.",
        "Democratizarea AI face această tehnologie accesibilă chiar și fermelor mici. AgriOne oferă funcții AI de bază gratuit pentru orice fermier cu minim un teren monitorizat. Abonamentele premium încep de la 25 EUR/lună și includ AI predictiv avansat, analize comparative și consultanță automată. Investiția se recuperează în primele 2-3 luni din economii și creșteri de productivitate.",
      ],
      en: [
        "The year 2026 marks a turning point in Romanian agriculture: over 32% of commercial farms already use predictive artificial intelligence solutions. AgriOne and other AI-integrated platforms analyze millions of data points in real-time - weather, soil moisture, nutrients, satellite - and provide precise recommendations that completely transform farm management.",
        "Studies from 2025-2026 reveal impressive results: farmers who integrate AI into daily decisions achieve average yield increases of 42-48% compared to traditional agriculture, reduce water consumption by 38-44%, decrease pesticide use by 55% and save 30-35% of total operating costs.",
        "AI features in AgriOne include: ultra-precise local weather predictions (6 hours - 14 days), disease/pest risk alerts 7-10 days in advance, automatic irrigation and fertilization recommendations personalized per plot, harvest predictions with 92%+ accuracy, logistic optimization for agricultural operations and automatic comparative analyses between fields.",
        "The competitive advantage is enormous. A farmer from Teleorman using AI knows exactly: when to sow (on the optimal day), how much water to give and when (eliminating waste), what fertilizer dose exactly per zone (25-40% savings), when to treat preventively (before the problem appears), when to harvest (at perfect maturity). Data-driven decisions, not intuition or 'calendar month'.",
        "AI democratization makes this technology accessible even to small farms. AgriOne offers basic AI features free for any farmer with at least one monitored field. Premium subscriptions start at 25 EUR/month and include advanced predictive AI, comparative analyses and automated consulting. The investment is recovered in the first 2-3 months from savings and productivity gains.",
      ],
    },
  },
  {
    id: 2,
    slug: "schimbari-climatice-adaptare-2026",
    category: "sustainability",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop",
    title: {
      ro: "Adaptarea la schimbările climatice: Strategii pentru 2026-2030",
      en: "Climate change adaptation: Strategies for 2026-2030",
    },
    excerpt: {
      ro: "Secetele severe din 2025 au schimbat agricultura. Cum să-ți protejezi ferma: soiuri reziliente, management apă, diversificare culturi.",
      en: "The severe droughts of 2025 changed agriculture. How to protect your farm: resilient varieties, water management, crop diversification.",
    },
    author: "Dr. Maria Ionescu",
    date: "2026-03-08",
    readTime: "11 min",
    tags: ["Climate", "Sustainability", "Resilience"],
    content: {
      ro: [
        "Anul 2025 a fost cel mai secetos an din istoria agricolă recentă a României, cu pierderi estimate la 2.1 miliarde EUR. Temperatura medie a crescut cu 1.8°C față de media 1990-2020, iar precipitațiile în perioada critică aprilie-iulie au fost cu 42% sub normal. Schimbările climatice nu mai sunt o teorie - sunt realitatea din câmp.",
        "Strategia #1: Soiuri și hibrizi toleranți la stres. Cercetarea INCDA Fundulea a lansat în 2025-2026 noi varietăți de grâu (Fundulea 382, Chimpaز 501) și porumb (Romanian Hybrid RH-550, RH-620) care mențin producții de 85-90% chiar și în condiții de secetă moderată (30% minus precipitații). Investiția în sămânța certificată premium se amortizează de 3-5 ori în ani dificili.",
        "Strategia #2: Managementul avansat al apei. Tehnologiile 2026 permit: irigație de precizie cu senzori multi-parametru (umiditate la 3 adâncimi, salinitate, EC), sisteme de captare și stocare ape pluviale cu subvenții PNRR 2024-2027 (până la 70% din investiție), reciclare și reutilizare inteligentă a apei, mulci organice și tehnici de conservare umiditate (no-till, cover crops).",
        "Strategia #3: Diversificarea culturilor și integrarea verigilor valorice. Monocultura creează risc imens. Tendința 2026: rotații complexe de 4-5 culturi (inclusiv leguminoase fixatoare de azot), culturi duble anuale (rapiță + porumb siloz/soia), integrarea verticală (procesare la fermă, vânzare directă) care compensează volatilitatea prețurilor. Fermele diversificate au traversat 2025 cu pierderi de 3-5 ori mai mici decât cele cu monocultură.",
        "Strategia #4: Asigurări agricole și instrumente financiare. Guvernul României a extins în 2026 programul de subvenționare prime asigurare la 75% (față de 50% anterior), acoperind riscuri multiple: secetă, ger, grindină, inundații. Fermierii pot combina cu asigurări tip 'index' bazate pe date satelit care plătesc automat când parametrii climatici depășesc pragurile critice.",
        "AgriOne contribuie activ la adaptare oferind: analize istorice și predictive ale riscului climatic pe parcelă, recomandări AI de culturi optime bazate pe proiecții meteo 6-12 luni, monitorizare continuă a stresului hidric și intervenții preventive, conectare directă cu brokeri asigurări agricole pentru oferte personalizate. Fermele echipate cu AgriOne au raportat în 2025 pierderile cu 38% mai mici decât media națională.",
      ],
      en: [
        "The year 2025 was the driest year in Romania's recent agricultural history, with estimated losses of 2.1 billion EUR. The average temperature increased by 1.8°C compared to the 1990-2020 average, and precipitation in the critical April-July period was 42% below normal. Climate change is no longer a theory - it's the reality in the field.",
        "Strategy #1: Stress-tolerant varieties and hybrids. INCDA Fundulea research launched in 2025-2026 new wheat varieties (Fundulea 382, Chimpaز 501) and corn (Romanian Hybrid RH-550, RH-620) that maintain 85-90% yields even in moderate drought conditions (30% less precipitation). Investment in premium certified seed pays back 3-5 times in difficult years.",
        "Strategy #2: Advanced water management. 2026 technologies enable: precision irrigation with multi-parameter sensors (moisture at 3 depths, salinity, EC), rainwater harvesting and storage systems with PNRR 2024-2027 subsidies (up to 70% of investment), intelligent water recycling and reuse, organic mulches and moisture conservation techniques (no-till, cover crops).",
        "Strategy #3: Crop diversification and value chain integration. Monoculture creates enormous risk. 2026 trend: complex 4-5 crop rotations (including nitrogen-fixing legumes), double annual crops (rapeseed + silage corn/soybean), vertical integration (on-farm processing, direct sales) that compensates for price volatility. Diversified farms went through 2025 with losses 3-5 times smaller than monoculture ones.",
        "Strategy #4: Agricultural insurance and financial instruments. The Romanian government expanded in 2026 the insurance premium subsidy program to 75% (from 50% previously), covering multiple risks: drought, frost, hail, floods. Farmers can combine with 'index' type insurances based on satellite data that pay automatically when climate parameters exceed critical thresholds.",
        "AgriOne actively contributes to adaptation by offering: historical and predictive climate risk analyses per plot, AI crop recommendations based on 6-12 month weather projections, continuous monitoring of water stress and preventive interventions, direct connection with agricultural insurance brokers for personalized offers. Farms equipped with AgriOne reported in 2025 losses 38% lower than the national average.",
      ],
    },
  },
  {
    id: 3,
    slug: "agricultura-regenerativa-tendinte",
    category: "sustainability",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop",
    title: {
      ro: "Agricultura Regenerativă: De la Trend la Standard în 2026",
      en: "Regenerative Agriculture: From Trend to Standard in 2026",
    },
    excerpt: {
      ro: "Agricultura regenerativă nu mai este nișă - este viitorul. Cum să restaurezi solul, să sechestrezi carbon și să obții producții mai mari sustenabil.",
      en: "Regenerative agriculture is no longer niche - it's the future. How to restore soil, sequester carbon and achieve higher sustainable yields.",
    },
    author: "Ing. Cristian Vasile",
    date: "2026-03-05",
    readTime: "10 min",
    tags: ["Regenerative", "Soil Health", "Carbon"],
    content: {
      ro: [
        "Agricultura regenerativă a trecut în 2026 de la statutul de 'trend eco' la standard economic solid. Peste 180.000 hectare în România sunt certificate în programe de agricultură regenerativă, fermele participante încasând în medie 45-85 EUR/ha/an din credite de carbon și prime de calitate plus 15-28% creșteri de productivitate în anii 2-5.",
        "Principiile de bază ale agriculturii regenerative: eliminarea arăturii (no-till/minimum tillage) care protejează structura solului și microbiomul, menținerea solului acoperit permanent cu culturi vii sau reziduuri (zero perioadă sol gol), diversificarea extremă prin rotații complexe 5-8 culturi, integrare animale-vegetale (pășunat rotațional, compost), eliminarea sau minimizarea inputurilor chimice de sinteză.",
        "Monitoring și certificare. Platforme precum AgriOne integrează module de monitorizare agricultură regenerativă: niveluri materie organică (trend crescător = regenerare), biodiversitate sol (numărătoare organisme, activitate enzimatică), sechestrare carbon (calcul automat pe bază de practici + analiză sol), reducere emisii GES comparativ cu metoda convențională. Rapoarte automate acceptate de organisme certificatoare (Carbon Credits, SustainCert România).",
        "Beneficii economice concrete: reducere costuri inputuri chimice 40-60% (înlocuire cu biologizare, compost, cover crops), creștere retenție apă în sol +35-60% (reziliență secetă), prime prețuri 10-25% (contracte direct cu procesatori/retail pentru produse regenerative), venituri suplimentare carbon 35-95 EUR/ha/an (în funcție de program), reducere costuri combustibil 25-40% (mai puține treceri cu utilaje).",
        "Cum începi tranziția: Pas 1 - Educație (cursuri, webinarii AgriAcademy România). Pas 2 - Plan tranziție graduală 3-5 ani (nu schimbi tot dintr-odată). Pas 3 - Începe cu 10-20% din suprafață ca pilot. Pas 4 - Monitorizare intensivă (senzori sol, analize biologice, yield mapping). Pas 5 - Ajustare și extindere pe baza rezultatelor. AgriOne oferă consultanță gratuită de tranziție pentru ferme cu minim 50 ha.",
      ],
      en: [
        "Regenerative agriculture moved in 2026 from 'eco trend' status to solid economic standard. Over 180,000 hectares in Romania are certified in regenerative agriculture programs, participating farms earning on average 45-85 EUR/ha/year from carbon credits and quality premiums plus 15-28% productivity increases in years 2-5.",
        "Basic principles of regenerative agriculture: elimination of plowing (no-till/minimum tillage) that protects soil structure and microbiome, keeping soil permanently covered with living crops or residues (zero bare soil period), extreme diversification through complex 5-8 crop rotations, animal-plant integration (rotational grazing, compost), elimination or minimization of synthetic chemical inputs.",
        "Monitoring and certification. Platforms like AgriOne integrate regenerative agriculture monitoring modules: organic matter levels (upward trend = regeneration), soil biodiversity (organism counts, enzymatic activity), carbon sequestration (automatic calculation based on practices + soil analysis), GHG emission reduction compared to conventional method. Automated reports accepted by certifying bodies (Carbon Credits, SustainCert Romania).",
        "Concrete economic benefits: 40-60% reduction in chemical input costs (replacement with biologization, compost, cover crops), +35-60% increase in soil water retention (drought resilience), 10-25% price premiums (direct contracts with processors/retail for regenerative products), additional carbon income 35-95 EUR/ha/year (depending on program), 25-40% reduction in fuel costs (fewer equipment passes).",
        "How to start the transition: Step 1 - Education (courses, AgriAcademy Romania webinars). Step 2 - Gradual transition plan 3-5 years (don't change everything at once). Step 3 - Start with 10-20% of area as pilot. Step 4 - Intensive monitoring (soil sensors, biological analyses, yield mapping). Step 5 - Adjustment and expansion based on results. AgriOne offers free transition consulting for farms with minimum 50 ha.",
      ],
    },
  },
  {
    id: 4,
    slug: "porumb-2026-soiuri-management",
    category: "crops",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&h=400&fit=crop",
    title: {
      ro: "Cultura porumbului 2026: Soiuri noi și management performant",
      en: "Corn cultivation 2026: New varieties and high-performance management",
    },
    excerpt: {
      ro: "Analiza completă sezon 2026: hibrizii cu performanțe record, prețuri estimate, tehnologii de precizie, calendarul lucrărilor și sfaturi practice.",
      en: "Complete 2026 season analysis: record-performing hybrids, estimated prices, precision technologies, work schedule and practical tips.",
    },
    author: "Ing. Ion Dumitru",
    date: "2026-03-01",
    readTime: "12 min",
    tags: ["Corn", "Hybrids", "2026"],
    content: {
      ro: [
        "Porumbul rămâne în 2026 cultura strategică a României cu 2.42 milioane hectare estimate. Sezonul 2026 aduce oportunități excepționale: prețuri în creștere (230-265 EUR/tonă EX Works), cerere europeană susținută de deficit regional, soiuri noi cu potențial 14-16 t/ha la irigat, și tehnologii de precizie accesibile care reduc costurile cu 20-30%.",
        "Hibrizii 2026 cu performanțe record: Pioneer P2089 (FAO 420, potențial 15.5 t/ha irigat, rezistent secetă++), KWS Kinemas (FAO 380, stabilitate excepțională în condiții variate), Limagrain LG 31.389 (FAO 390, precocitate + randament), DKC 4608 (FAO 460, pentru sudul țării, rezistent căldură record). Prefer hibrizii cu FAO 350-420 în contextul climei actuale - maturitate mai rapidă = evitare stres termic august.",
        "Costuri estimate 2026 pentru producție performantă: sămânță hibrid certificat 150-195 EUR/ha, fertilizare complexă NPK + microelemente 340-420 EUR/ha, protecția plantelor integrated 65-95 EUR/ha, combustibil și manoperă utilaje 185-240 EUR/ha, irigație (dacă aplicabil) 160-220 EUR/ha, asigurare agricolă subvenționată 25-40 EUR/ha. TOTAL: 925-1210 EUR/ha. La 10 t/ha și 245 EUR/t = 2450 EUR/ha venit brut → profit 1240-1525 EUR/ha.",
        "Calendarul optim lucrărilor 2026: pregătire sol toamnă 2025 (discare, arătură 28-32 cm, fertilizare P-K de bază), semănat 15 aprilie - 5 mai când temperatura solului 10 cm > 12°C constant (monitorat cu senzori AgriOne), densitate 70,000-82,000 plante/ha (funcție de híbrid și zonă), fertilizare azot N1 la 4-6 frunze (140-160 kg element N/ha fracționat), irigații critice la înflorire și umplere bob (economie maximă cu senzori umiditate și AI predictiv), recoltare la 22-25% umiditate boabe (evitare costuri uscare).",
        "Tehnologii precision farming care fac diferența în 2026: semănat variabil (ajustare densitate în funcție de fertilitate zonă), fertilizare variabilă pe bază de hărți satelit NDVI, irigație de precizie cu senzori multi-adâncime (economie 35-42% apă), monitorizare dăunători cu capcane smart conectate (tratament preventiv țintit), yield mapping la recoltare (analiza variabilității și planificare an următor). AgriOne integrează toate aceste tech într-o singură platformă - 85 EUR/ha/sezon pentru pachet complet.",
      ],
      en: [
        "Corn remains Romania's strategic crop in 2026 with an estimated 2.42 million hectares. The 2026 season brings exceptional opportunities: rising prices (230-265 EUR/tonne EX Works), European demand sustained by regional deficit, new varieties with potential 14-16 t/ha under irrigation, and accessible precision technologies that reduce costs by 20-30%.",
        "2026 record-performing hybrids: Pioneer P2089 (FAO 420, potential 15.5 t/ha irrigated, drought resistant++), KWS Kinemas (FAO 380, exceptional stability in varied conditions), Limagrain LG 31.389 (FAO 390, precocity + yield), DKC 4608 (FAO 460, for southern country, record heat resistant). Prefer hybrids with FAO 350-420 in the current climate context - faster maturity = avoiding August heat stress.",
        "Estimated 2026 costs for high-performance production: certified hybrid seed 150-195 EUR/ha, complex NPK fertilization + microelements 340-420 EUR/ha, integrated plant protection 65-95 EUR/ha, fuel and equipment labor 185-240 EUR/ha, irrigation (if applicable) 160-220 EUR/ha, subsidized agricultural insurance 25-40 EUR/ha. TOTAL: 925-1210 EUR/ha. At 10 t/ha and 245 EUR/t = 2450 EUR/ha gross income → profit 1240-1525 EUR/ha.",
        "2026 optimal work schedule: autumn 2025 soil preparation (discing, 28-32 cm deep plowing, basic P-K fertilization), sowing April 15 - May 5 when 10 cm soil temperature > 12°C constant (monitored with AgriOne sensors), density 70,000-82,000 plants/ha (depending on hybrid and zone), nitrogen fertilization N1 at 4-6 leaves (140-160 kg N element/ha fractionated), critical irrigations at flowering and grain filling (maximum savings with moisture sensors and predictive AI), harvest at 22-25% grain moisture (avoiding drying costs).",
        "Precision farming technologies that make a difference in 2026: variable seeding (density adjustment based on zone fertility), variable fertilization based on NDVI satellite maps, precision irrigation with multi-depth sensors (35-42% water savings), pest monitoring with connected smart traps (targeted preventive treatment), yield mapping at harvest (variability analysis and planning for next year). AgriOne integrates all these tech in a single platform - 85 EUR/ha/season for complete package.",
      ],
    },
  },
  {
    id: 5,
    slug: "subventii-pnrr-pac-2026",
    category: "economics",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    title: {
      ro: "Ghid complet: Subvenții și finanțări agricole 2026-2027",
      en: "Complete guide: Agricultural subsidies and funding 2026-2027",
    },
    excerpt: {
      ro: "Tot ce trebuie să știi: APIA, PNRR, PAC 2023-2027, eco-scheme, investiții irigații, digitalizare. Termene, condiții, calcule și strategii de maximizare.",
      en: "Everything you need to know: APIA, PNRR, CAP 2023-2027, eco-schemes, irrigation investments, digitalization. Deadlines, conditions, calculations and maximization strategies.",
    },
    author: "Consultant EU Fonduri",
    date: "2026-02-25",
    readTime: "16 min",
    tags: ["APIA", "PNRR", "Funding"],
    content: {
      ro: [
        "Campania 2026 aduce finanțări record pentru agricultura românească: bugetul PAC 2023-2027 a fost suplimentat cu 340 milioane EUR din PNRR, eco-schemele au fost simplificate și au praguri mai accesibile, iar ratele de plată au crescut semnificativ. Un fermier bine informat poate accesa 180-350 EUR/ha doar din plăți directe, plus finanțări investiții 50-90% pentru modernizare.",
        "APIA 2026 - Plata de bază pe suprafață (PDS): 167 EUR/ha (creștere față de 152 EUR în 2024). Plata redistributivă primele 150 ha: 80 EUR/ha suplimentar (importante pentru ferme mici/medii). Plata pentru tineri fermieri (<40 ani, primii 5 ani): 95 EUR/ha până la max 100 ha (crucial pentru atragerea tinerilor). Termene depunere cerere unică: 1 martie - 15 mai 2026 fără penalizări, până 10 iunie cu penalizări 1%/zi.",
        "Eco-schemele 2026 (simplificare majoră față de 2024): ECO 1 - Practici benefice pentru climă și mediu (minim rotație 3 culturi, 4% teren ecologic): 75 EUR/ha. ECO 2 - Agricultura cu aport redus carbon (reducere 20% fertilizanți chimici, monitorizare digitală): 105 EUR/ha. ECO 3 - Menținere pajiști permanente degradare risc: 380 EUR/ha. ECO 4 - Agricultura de precizie și monitorizare digitală (senzori, platforme tip AgriOne): 125 EUR/ha. Cumulabile între ele dacă condiții diferite!",
        "PNRR Componenta Agricultură 2026-2027 - Investiții majore: Irigații de precizie: granturi 60-75% până la 2 milioane EUR/proiect (sisteme picurare, senzori, automatizare). Digitalizare fermă: 70-85% grant până la 150.000 EUR (senzori IoT, software management, drone agricole, roboți). Energie regenerabilă fermă: 50-65% până la 500.000 EUR (panouri solare, biogas, pompe eficiente). Depozitare și procesare: 45-60% până la 3 milioane EUR (silozuri moderne, linii procesare, camere frigorifice). Aplicare în sistem online - AgriOne pregătește documentația automată pe bază de date fermă existente.",
        "Strategii de maximizare fonduri 2026: Pasul 1 - Înregistrare APIA corectă a tuturor terenurilor + asociere cu eco-scheme compatibile = 240-370 EUR/ha garantat. Pasul 2 - Dacă ai < 40 ani sau poți angaja tânăr manager = +95 EUR/ha. Pasul 3 - Investiție digitalizare ferma prin PNRR (70-85% grant) = payback sub 2 ani din economii operaționale + activare ECO 4. Pasul 4 - Dacă zona secetă, aplică grant irigații PNRR (60-75%) = transformi fundamental productivitatea. Pasul 5 - Consultanță specializată (AgriOne oferă gratuit pentru utilizatori Premium).",
      ],
      en: [
        "The 2026 campaign brings record funding for Romanian agriculture: the CAP 2023-2027 budget has been supplemented with 340 million EUR from PNRR, eco-schemes have been simplified and have more accessible thresholds, and payment rates have increased significantly. A well-informed farmer can access 180-350 EUR/ha from direct payments alone, plus 50-90% investment funding for modernization.",
        "APIA 2026 - Basic payment per area (BPS): 167 EUR/ha (increase from 152 EUR in 2024). Redistributive payment first 150 ha: 80 EUR/ha additional (important for small/medium farms). Payment for young farmers (<40 years, first 5 years): 95 EUR/ha up to max 100 ha (crucial for attracting youth). Single application submission deadlines: March 1 - May 15, 2026 without penalties, until June 10 with 1%/day penalties.",
        "2026 eco-schemes (major simplification vs 2024): ECO 1 - Practices beneficial for climate and environment (minimum 3 crop rotation, 4% ecological land): 75 EUR/ha. ECO 2 - Low-carbon agriculture (20% reduction chemical fertilizers, digital monitoring): 105 EUR/ha. ECO 3 - Maintenance permanent grassland degradation risk: 380 EUR/ha. ECO 4 - Precision agriculture and digital monitoring (sensors, AgriOne-type platforms): 125 EUR/ha. Cumulative between them if different conditions!",
        "PNRR Agriculture Component 2026-2027 - Major investments: Precision irrigation: 60-75% grants up to 2 million EUR/project (drip systems, sensors, automation). Farm digitalization: 70-85% grant up to 150,000 EUR (IoT sensors, management software, agricultural drones, robots). Farm renewable energy: 50-65% up to 500,000 EUR (solar panels, biogas, efficient pumps). Storage and processing: 45-60% up to 3 million EUR (modern silos, processing lines, cold rooms). Apply in online system - AgriOne prepares documentation automatically based on existing farm data.",
        "2026 fund maximization strategies: Step 1 - Correct APIA registration of all lands + association with compatible eco-schemes = 240-370 EUR/ha guaranteed. Step 2 - If you're < 40 years or can hire young manager = +95 EUR/ha. Step 3 - Farm digitalization investment through PNRR (70-85% grant) = payback under 2 years from operational savings + ECO 4 activation. Step 4 - If drought zone, apply PNRR irrigation grant (60-75%) = fundamentally transform productivity. Step 5 - Specialized consulting (AgriOne offers free for Premium users).",
      ],
    },
  },
  {
    id: 6,
    slug: "drone-satelit-agricultura",
    category: "technology",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=400&fit=crop",
    title: {
      ro: "Drone și sateliți în agricultură: Cum să folosești imagistica aeriană",
      en: "Drones and satellites in agriculture: How to use aerial imagery",
    },
    excerpt: {
      ro: "Ghid practic: monitorizare NDVI, detectare boli, hartă fertilizare variabilă, yield mapping. Tehnologii 2026 accesibile și profitabile pentru orice fermă.",
      en: "Practical guide: NDVI monitoring, disease detection, variable fertilization map, yield mapping. 2026 accessible and profitable technologies for any farm.",
    },
    author: "Ing. Mihai Georgescu",
    date: "2026-02-20",
    readTime: "13 min",
    tags: ["Drones", "Satellites", "Remote Sensing"],
    content: {
      ro: [
        "Monitorizarea aeriană a devenit în 2026 accesibilă pentru orice fermier: imagine satelit gratuite la rezoluție 10m din programele Sentinel-2 și Copernicus, drone agricole sub 5000 EUR cu senzori multispectral, și platforme software tip AgriOne care procesează automat datele și generează recomandări concrete. Nu mai este 'tech de lux' - este standard de eficiență.",
        "Aplicații practice monitorizare satelit în AgriOne (gratuit pentru utilizatori): NDVI (Normalized Difference Vegetation Index) - hartă sănătate vegetație actualizată la 3-5 zile, identifică instant zonele cu stres, deficiențe nutriționale sau atacuri boli/dăunători cu 5-8 zile înainte de simptome vizibile. NDRE (Normalized Difference Red Edge) - monitorizare nivel azot în plante, permite fertilizare variabilă precisă doar în zonele deficitare = economie 25-40% îngrășăminte. NDMI (Moisture Index) - nivelul de stres hidric, complementar cu senzorii de sol pentru decizie irigație optimă.",
        "Drone agricole în 2026 - investiție profitabilă: Dronă agricolă entry-level: 4500-8500 EUR, include cameră RGB + multispectral, autonomie 25-35 min, acoperire 30-50 ha/zbor. Servicii drone externe dacă nu vrei să investești: 8-15 EUR/ha/survolare, 3-6 survolare/sezon = 24-90 EUR/ha/an (mai ieftin decât cumpărarea pentru ferme < 200 ha). Utilizări principale: mapping NDVI înaltă rezoluție (1-5 cm/pixel), detectare timpurie boli/dăunători, verificare uniformitate răsărire, estimare yield pre-recoltare, documentare daune pentru asigurări.",
        "Fertilizare variabilă pe bază de imagini: procesul complet - AgriOne procesează imagini satelit/drone și generează hartă NDRE (nivel azot în plante), hartă se exportă în format compatibil utilaje agricole (Trimble, John Deere, New Holland), tractor cu rate controller și GPS RTK aplică îngrășământ variabil pe zonă: mai mult în zonele deficitare, mai puțin în zonele cu nivel optim. Rezultat: economie 20-35% îngrășăminte, uniformizare producție pe întreaga parcelă, creștere producție zonele subperformante 15-25%. Cost sistem complet (fără tractor): 6000-12000 EUR, amortizare 2-3 sezoane pentru ferme 150+ ha.",
        "Yield mapping și analiză performanță: combinele moderne (2020+) au senzori yield integrat care măsoară producția în timp real cu geolocation. AgriOne procesează datele de recoltare și generează: hartă producție pe zonă (identifică varibilitatea în parcelă), analiză corelație cu fertilizare/irigație/tipuri sol, prognoza și recomandări optimizare sezon următor. Fermierii care folosesc yield mapping + ajustări zonale obțin în medie 12-18% creștere producție și 18-25% reducere costuri input în anii 2-4.",
      ],
      en: [
        "Aerial monitoring became accessible in 2026 for any farmer: free satellite imagery at 10m resolution from Sentinel-2 and Copernicus programs, agricultural drones under 5000 EUR with multispectral sensors, and software platforms like AgriOne that automatically process data and generate concrete recommendations. It's no longer 'luxury tech' - it's the efficiency standard.",
        "Practical satellite monitoring applications in AgriOne (free for users): NDVI (Normalized Difference Vegetation Index) - vegetation health map updated every 3-5 days, instantly identifies areas with stress, nutritional deficiencies or disease/pest attacks 5-8 days before visible symptoms. NDRE (Normalized Difference Red Edge) - nitrogen level monitoring in plants, allows precise variable fertilization only in deficient areas = 25-40% fertilizer savings. NDMI (Moisture Index) - water stress level, complementary with soil sensors for optimal irrigation decision.",
        "Agricultural drones in 2026 - profitable investment: Entry-level agricultural drone: 4500-8500 EUR, includes RGB + multispectral camera, 25-35 min autonomy, 30-50 ha/flight coverage. External drone services if you don't want to invest: 8-15 EUR/ha/flyover, 3-6 flyovers/season = 24-90 EUR/ha/year (cheaper than buying for farms < 200 ha). Main uses: high-resolution NDVI mapping (1-5 cm/pixel), early disease/pest detection, emergence uniformity verification, pre-harvest yield estimation, damage documentation for insurance.",
        "Variable fertilization based on images: complete process - AgriOne processes satellite/drone images and generates NDRE map (nitrogen level in plants), map is exported in agricultural equipment compatible format (Trimble, John Deere, New Holland), tractor with rate controller and RTK GPS applies variable fertilizer per zone: more in deficient areas, less in areas with optimal level. Result: 20-35% fertilizer savings, yield uniformity across entire plot, 15-25% yield increase in underperforming areas. Complete system cost (without tractor): 6000-12000 EUR, amortization 2-3 seasons for farms 150+ ha.",
        "Yield mapping and performance analysis: modern combines (2020+) have integrated yield sensors that measure production in real-time with geolocation. AgriOne processes harvest data and generates: production map per zone (identifies variability in plot), correlation analysis with fertilization/irrigation/soil types, forecast and optimization recommendations for next season. Farmers using yield mapping + zonal adjustments achieve on average 12-18% yield increase and 18-25% input cost reduction in years 2-4.",
      ],
    },
  },
  {
    id: 7,
    slug: "leguminoase-proteine-vegetale",
    category: "crops",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    title: {
      ro: "Boom-ul leguminoaselor: Mazăre, soia, năut - Oportunități 2026",
      en: "Legume boom: Peas, soybeans, chickpeas - 2026 Opportunities",
    },
    excerpt: {
      ro: "Cererea de proteine vegetale explodează în Europa. Cum să profiți: culturi profitabile, agrotehnică, piețe, contracte, subvenții speciale.",
      en: "Demand for plant proteins explodes in Europe. How to benefit: profitable crops, agrotechnics, markets, contracts, special subsidies.",
    },
    author: "Dr. Elena Radu",
    date: "2026-02-15",
    readTime: "11 min",
    tags: ["Legumes", "Protein", "Markets"],
    content: {
      ro: [
        "Europa importă în prezent 14 milioane tone soia/an, în principal din America de Sud. Strategia EU 'Plant Protein' 2023-2030 vizează reducerea dependenței la 40% prin stimularea producției locale de mazăre, bob, soia, năut, linte. Pentru fermierii români această strategie înseamnă oportunități financiare uriașe: prețuri premium, contracte pe termen lung, subvenții speciale UAC 120-250 EUR/ha și cerere în continuă creștere.",
        "Mazărea - cultura profitabilă și sustenabilă: fixează 80-120 kg azot/ha (economie îngrășăminte cultura următoare 100-150 EUR/ha), precocitate (recoltare iunie-iulie), permite cultură dublă (mazăre + rapiță/porumb siloz), prețuri excelente 380-550 EUR/tonă (vs cerere veggie, plant-based), producții 2.5-4.5 t/ha. Soiuri 2026 recomandate: Ambassador, Respect, Astronaute (înaltă proteină 23-25%). Important: contract pre-semănat cu procesator (Arpis, Agricover, Unilever România) care garantează preț și asistență tehnică.",
        "Soia - avantaj rotație și economie: fixează azot 70-110 kg/ha, toleranță bună secetă (rădăcini adânci), prețuri stabile 450-580 EUR/tonă (cerere biodisel + alimentație), producții 2.8-4.2 t/ha (soiuri adaptate clima), eligibilă subventii coupled 180-240 EUR/ha. Soiuri 2026: ES Mentor, Madara, Melrose (FAO 000-00, adaptate nord/centru), Acajou, Augusta (FAO 0-I, pentru sud). Agrotehnică simplificată, costuri totale 450-650 EUR/ha, profit net estimat 800-1400 EUR/ha la 3.5 t/ha.",
        "Năutul - nișă profitabilă în creștere: cerere enormă pentru hummus, snacks, plant-based (creștere consum UE +35%/an din 2023), prețuri record 900-1400 EUR/tonă pentru calitate premium, producții 1.8-3.2 t/ha România (zonele calde, sud/SE), rezistent secetă excepțional. Provocări: tehnologie încă în fază de adaptare la România, necesită sămânță certificată (scumpă: 180-250 EUR/ha), risc boli fungice dacă exces umiditate. Recomandare: începe cu 5-10 ha pilot, contract integrat cu procesator care oferă asistență tehnică full.",
        "Subvenții și facilități leguminoase 2026: plata cuplată UAC leguminoase proteice: 180 EUR/ha pentru soia și proteaginoase, 125 EUR/ha pentru mazăre și bob. Eco-schemă rotație culturi (mandatory 3+ culturi, incluzând 1 leguminoasă): 75 EUR/ha. Măsura PNDR investiții procesare leguminoase: 55% grant până 2 mil EUR (interesant pentru cooperative = integrare verticală). AgriOne calculează automat eligibilitatea și optimizarea subventii pe bază de plan de cultură introdus în platformă.",
      ],
      en: [
        "Europe currently imports 14 million tons of soybeans/year, mainly from South America. The EU 'Plant Protein' Strategy 2023-2030 aims to reduce dependence to 40% by stimulating local production of peas, beans, soybeans, chickpeas, lentils. For Romanian farmers this strategy means huge financial opportunities: premium prices, long-term contracts, special CAP subsidies 120-250 EUR/ha and continuously growing demand.",
        "Peas - profitable and sustainable crop: fixes 80-120 kg nitrogen/ha (fertilizer savings for next crop 100-150 EUR/ha), early maturity (harvest June-July), allows double crop (peas + rapeseed/silage corn), excellent prices 380-550 EUR/tonne (vs veggie demand, plant-based), yields 2.5-4.5 t/ha. Recommended 2026 varieties: Ambassador, Respect, Astronaute (high protein 23-25%). Important: pre-sowing contract with processor (Arpis, Agricover, Unilever Romania) that guarantees price and technical assistance.",
        "Soybeans - rotation and economic advantage: fixes nitrogen 70-110 kg/ha, good drought tolerance (deep roots), stable prices 450-580 EUR/tonne (biodiesel demand + feed), yields 2.8-4.2 t/ha (climate-adapted varieties), eligible for coupled subsidies 180-240 EUR/ha. 2026 varieties: ES Mentor, Madara, Melrose (FAO 000-00, adapted north/center), Acajou, Augusta (FAO 0-I, for south). Simplified agrotechnics, total costs 450-650 EUR/ha, estimated net profit 800-1400 EUR/ha at 3.5 t/ha.",
        "Chickpeas - growing profitable niche: enormous demand for hummus, snacks, plant-based (EU consumption growth +35%/year since 2023), record prices 900-1400 EUR/tonne for premium quality, yields 1.8-3.2 t/ha Romania (hot zones, south/SE), exceptional drought resistant. Challenges: technology still in adaptation phase to Romania, requires certified seed (expensive: 180-250 EUR/ha), risk of fungal diseases if excess moisture. Recommendation: start with 5-10 ha pilot, integrated contract with processor offering full technical assistance.",
        "Legume subsidies and facilities 2026: coupled payment CAP protein legumes: 180 EUR/ha for soybeans and protein crops, 125 EUR/ha for peas and beans. Crop rotation eco-scheme (mandatory 3+ crops, including 1 legume): 75 EUR/ha. NRDP measure legume processing investments: 55% grant up to 2 mil EUR (interesting for cooperatives = vertical integration). AgriOne automatically calculates eligibility and subsidy optimization based on crop plan entered in the platform.",
      ],
    },
  },
  {
    id: 8,
    slug: "community-agricultura-sociala",
    category: "sustainability",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop",
    title: {
      ro: "Agricultura comunitară și CSA: Modelul de business care crește 40%/an",
      en: "Community agriculture and CSA: The business model growing 40%/year",
    },
    excerpt: {
      ro: "Community Supported Agriculture transformă relația fermier-consumator. Vânzări directe, predictibilitate venit, prețuri premium, loialitate clienți.",
      en: "Community Supported Agriculture transforms the farmer-consumer relationship. Direct sales, income predictability, premium prices, customer loyalty.",
    },
    author: "Ana Popescu",
    date: "2026-02-10",
    readTime: "10 min",
    tags: ["CSA", "Direct Sales", "Community"],
    content: {
      ro: [
        "Modelul CSA (Community Supported Agriculture) explodează în România: peste 340 de ferme CSA active în 2026 (vs 89 în 2023), creștere continuă 35-45%/an, cifră afaceri cumulată 45+ milioane EUR. Principiul este simplu: consumatorii cumpără 'abonamente' la recolta fermei înainte de sezon, fermierul primește capital de lucru la început și predictibilitate, consumatorii primesc produse proaspete, locale, la preț corect și relație directă cu sursa alimentelor lor.",
        "Cum funcționează CSA practic: Fermierul oferă pachete sezonale (de ex. coș legume săptămânal martie-octombrie: 240 EUR/lună/familie). Consumatorii plătesc integral sau fracționat la început de sezon (februarie-martie). Fermierul cultivă diversificat (15-30 culturi legume, fructe) bazat pe număr membri. Distribuție săptămânală: puncte colectare urbane sau livrare la domiciliu. Comunicare constantă: newsletter, vizite la fermă, Facebook/Instagram community. Avantaj fermier: cash-flow pozitiv de la început, preț premium (30-50% peste piață angro), elimină intermediari, loialitate ridicată membri (retention rate 75-85%).",
        "Modelul financiar CSA: Fermă medie 5-8 ha legume diversificate, 80-150 familii membre, preț mediu abonament 35-50 EUR/săptămână, venit brut anual 140.000-300.000 EUR, costuri de producție 45-55% (vs 65-70% agricultură convențională datorită eliminării intermediarilor), profit net 40-55%, plus avantaje secundare: eliminare risc preț piață, eliminare risc neplată/vânzare produse, loialitate și marketing organic prin membri mulțumiți.",
        "Cum începi o fermă CSA: Pasul 1 - Începe mic (2-3 ha, 20-30 familii an 1) și crește organic. Pasul 2 - Cultivare diversificată mare (minimum 12-15 culturi pentru coș variat). Pasul 3 - Locație strategică aproape de urban (livrat max 30-40 km). Pasul 4 - Comunitate înainte de vânzare: evenimente, open farm days, FB groups, story-telling. Pasul 5 - Tehnologie simplificare: AgriOne+CSA module pentru management abonamente, planificare culturi pe bază de membri, logistică livrări. Investiție start minimă: 15.000-35.000 EUR (teren pregătit, irigație, utilaje mici, tunel, capital lucru an 1). ROI realistic: 2-3 ani până la profit sustenabil.",
        "CSA+ în 2026: modele avansate care combină: CSA clasic (legume) + ferma animale (ouă, pui, lactate) = diversificare venituri, CSA + agro-turism (cazare, evenimente) = maximizare valoare fermă, CSA + procesare (murături, sucuri, dulcețuri) = prelungire sezon, valoare adăugată, Multi-farm CSA (cooperare 3-5 ferme specializate = ofertă completă). AgriOne lansează în aprilie 2026 modulul 'CSA Manager' complet integrat cu producție, vânzări, livrări, financiar - 45 EUR/lună pentru ferme CSA.",
      ],
      en: [
        "The CSA (Community Supported Agriculture) model explodes in Romania: over 340 active CSA farms in 2026 (vs 89 in 2023), continuous growth 35-45%/year, cumulative turnover 45+ million EUR. The principle is simple: consumers buy 'subscriptions' to the farm's harvest before the season, the farmer receives working capital at the start and predictability, consumers receive fresh, local products at fair prices and direct relationship with their food source.",
        "How CSA works in practice: Farmer offers seasonal packages (e.g. weekly vegetable basket March-October: 240 EUR/month/family). Consumers pay in full or installments at the start of season (February-March). Farmer grows diversified (15-30 vegetable, fruit crops) based on member number. Weekly distribution: urban collection points or home delivery. Constant communication: newsletter, farm visits, Facebook/Instagram community. Farmer advantage: positive cash-flow from start, premium price (30-50% above wholesale market), eliminates intermediaries, high member loyalty (retention rate 75-85%).",
        "CSA financial model: Average farm 5-8 ha diversified vegetables, 80-150 member families, average subscription price 35-50 EUR/week, annual gross income 140,000-300,000 EUR, production costs 45-55% (vs 65-70% conventional agriculture due to elimination of intermediaries), net profit 40-55%, plus secondary advantages: elimination of market price risk, elimination of non-payment/product sale risk, loyalty and organic marketing through satisfied members.",
        "How to start a CSA farm: Step 1 - Start small (2-3 ha, 20-30 families year 1) and grow organically. Step 2 - High diversified cultivation (minimum 12-15 crops for varied basket). Step 3 - Strategic location near urban (deliver max 30-40 km). Step 4 - Community before sales: events, open farm days, FB groups, story-telling. Step 5 - Simplification technology: AgriOne+CSA module for subscription management, crop planning based on members, delivery logistics. Minimum start investment: 15,000-35,000 EUR (prepared land, irrigation, small equipment, tunnel, year 1 working capital). Realistic ROI: 2-3 years until sustainable profit.",
        "CSA+ in 2026: advanced models that combine: classic CSA (vegetables) + animal farm (eggs, chickens, dairy) = income diversification, CSA + agro-tourism (accommodation, events) = farm value maximization, CSA + processing (pickles, juices, jams) = season extension, added value, Multi-farm CSA (cooperation 3-5 specialized farms = complete offer). AgriOne launches in April 2026 the 'CSA Manager' module fully integrated with production, sales, deliveries, financial - 45 EUR/month for CSA farms.",
      ],
    },
  },
  {
    id: 9,
    slug: "ghid-complet-apia-2026-subventii-termene",
    category: "legislation",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
    title: {
      ro: "Ghidul complet APIA 2026: Subvenții, termene și documentație necesară",
      en: "Complete APIA 2026 Guide: Subsidies, deadlines and required documentation",
    },
    excerpt: {
      ro: "Tot ce trebuie să știi despre subvențiile APIA 2026: plăți pe suprafață, eco-scheme, coupled support, termene critice și documentele necesare pentru o cerere fără erori.",
      en: "Everything you need to know about APIA 2026 subsidies: area payments, eco-schemes, coupled support, critical deadlines and necessary documents for an error-free application.",
    },
    author: "Avocat Mihai Georgescu",
    date: "2026-03-14",
    readTime: "12 min",
    tags: ["APIA", "Subvenții", "PAC", "Legislație"],
    content: {
      ro: [
        "Plățile pe suprafață 2026 în România s-au stabilizat la valori competitive: plata de bază 155 EUR/ha (creștere față de 145 EUR/ha în 2025), plata redistributivă primii 30 ha: +52 EUR/ha (total 207 EUR/ha), plata pentru tineri fermieri sub 40 ani: +95 EUR/ha (primul an de acces la schema, max 5 ani), plata pentru zone cu constrângeri naturale (zonele montane, defavorizate): 35-85 EUR/ha suplimentar. Un fermier tânăr cu 100 ha în valori medii primește: 155×100 + 52×30 + 95×100 = ~26.000 EUR doar din plățile de bază.",
        "Eco-schemele 2026 sunt obligatorii pentru a primi plata de bază și oferă plăți suplimentare: Eco 1 - Agricultură de precizie și reducere pesticide (90 EUR/ha, necesită: aplicare pesticide cu echipament ISOBUS, dosar pulverizare cu justificare tratamente, reducere 20% comparativ 2020-2022). Eco 2 - Practici benefice sol și cultură (75 EUR/ha, necesită: minimum 3 culturi pe exploatație, nici o cultură >75% din teren arabil, minimum 7% set-aside/ecological focus area). Eco 3 - Culturi fixatoare azot și rotație (85 EUR/ha, necesită: minimum o leguminoasă în rotație, documentare rotație 3 ani). Fermele pot cumula Eco2+Eco3 pentru 160 EUR/ha total.",
        "Plățile coupled (cuplate) 2026 pentru sectoare prioritare: Sectorul vegetal - Sfeclă de zahăr 450 EUR/ha (max 25.000 ha nivel național), Soia și proteaginoase 180 EUR/ha, Hamei 900 EUR/ha (fermieri tradiționali Covasna, Harghita), Mazăre/bob/linte proteinică 125 EUR/ha, Legume în câmp 320 EUR/ha (tomate, ardei, ceapă industrie), Cartofi 275 EUR/ha. Sectorul zootehnic - Vaci de lapte 250 EUR/cap (min 3 vaci, producție livrată formală), Vaci alăptătoare 180 EUR/cap, Oi/capre 45 EUR/cap (min 10 capete), Stupi 70 EUR/stup (apicultori înregistrați ANSVSA).",
        "Termene critice APIA 2026 - marchează-ți în calendar: 1 martie - Deschidere portal online eApia pentru înscriere cereri unique. 15 martie - Termen recomandat depunere cerere (evitare aglomerație, timp corecturi). 15 mai - Termen limită legal depunere cereri unice FĂRĂ penalități. Depuneri 16 mai - 9 iunie: penalizări 1% pe zi întârziere. După 9 iunie: cerere respinsă complet. 15 iunie - Termen declarare suprafețe culturi de vară (porumb, floarea soarelui, soia). 15 septembrie - Termen modificări post-control (dacă GAL sau APIA solicită). Decembrie 2026 - Plată avans 85% (dacă cerere fără probleme). Ianuarie-Februarie 2027 - Plată finală sold subvenții 2026.",
        "Documentația obligatorie pentru cererea unică 2026: Contractul de arendă valabil sau titlu proprietate actualizat (ANCPI extras carte funciară cu dată recentă 2025-2026), Copia CI/BI fermier titular sau reprezentant legal, Contract de consultanță cu specialist autorizat APIA sau delegație acces portal eApia (dacă folosești consultant), Dovada calității de fermier activ (extrase bancare vânzări agricole sau declarații fiscale), Pentru eco-scheme: registrul electronic tratamente fitosanitare + facturi achiziție inputuri, evidență rotații culturi 3 ani, dovezi achiziție echipament certificat ISOBUS, Pentru zonale/coupled: contracte livrare lapte, certificate sanitar veterinare efectiv, declarații vânzări produse vegetale specifice.",
        "Greșelile frecvente care costă subvenții: Suprapuneri parcele între fermieri (reduce suprafața eligibilă pentru TOȚI implicați - APIA aplică penalizare reciprocă), Declarare suprafață mai mare decât realitate (dacă măsurătorile GPS/satelit diferă cu +3%, plătești înapoi diferența + penalități), Nerespectare condiționalitate (verificări cross-compliance pentru mediu, sănătate animale, siguranță alimentară - încălcare = reducere 1-5% din toate plățile), Declarare culturi incorecte sau schimbare cultură după declarare (trebuie notificare APIA în 24-48h), Neactualizare date bancare (plăți returnate = întârziere luni de zile).",
        "Instrumente digitale care simplifică procesul: eApia portal oficial (https://eapia.apia.org.ro) - depunere online cerere, tracking status, notificări termene, AgriOne integrare APIA automată - sincronizare terenuri din baza LPIS APIA, pre-completare cerere pe bază date parcelă, calcul automat eligibilitate eco-scheme și coupled, alertă termene personalizată cu notificări push, simulare sumă subvenție înaintea depunerii. Fermierii AgriOne cu modulul APIA activ au rata de aprobare cereri 97.3% (vs media națională 89%) și economisesc 4-6 ore muncă administrativă per campanie.",
        "Strategia optimă pentru subvenții maxime 2026: Pasul 1 - Planificare cultură în funcție de eligibilitate (balanced între piață și subvenții). Pasul 2 - Aplicare minimum Eco2+Eco3 (160 EUR/ha câștig automat). Pasul 3 - Dacă ești sub 40 ani, asigură-te că ești înregistrat ca tânăr fermier APIA (95 EUR/ha extra 5 ani = 475 EUR/ha total). Pasul 4 - Diversifică pentru a accesa coupled payments (exemplu: soia 180 EUR/ha, mazăre 125 EUR/ha). Pasul 5 - Depune cererea în primele 2 săptămâni (1-15 martie) pentru timp maxim corecții dacă necesare. Pasul 6 - Monitorizează activ notificările APIA și răspunde prompt orice solicitare (termenele de răspuns sunt stricte: 10 zile lucrătoare sau cerere respinsă).",
        "Scenarii realiste plăți 2026: Scenariu A - Fermier 50 ha grâu cu Eco2+Eco3 = 155 + 160 = 315 EUR/ha × 50 = 15.750 EUR. Scenariu B - Fermier tânăr 80 ha (40 ha grâu + 40 ha soia) cu Eco2+Eco3 + tânăr fermier + coupled soia = grâu: (155+52+95+160)×40 = 18.480 EUR + soia: (155+95+160+180)×40 = 23.600 EUR = 42.080 EUR total. Scenariu C - Fermă mare 500 ha diversificată optim (grâu/porumb/soia/floarea soarelui/mazăre) cu Eco2+Eco3 + coupled strategic = estimat 105.000-125.000 EUR total subvenții. Fermierii care optimizează strategic culturile și schemele pot câștiga 50-80% mai mult decât cei care doar declară suprafața pentru plata de bază.",
        "Consultanță și asistență APIA: Fermierii pot apela la: Consultanți autorizați APIA (listă oficială pe site MADR) - taxă consultanță 1-3 EUR/ha sau 50-150 EUR fix per cerere, Centre pentru consultanță agricolă județene (OJCA) - consultanță gratuită dar aglomerație mare în martie-aprilie, Platforme digitale AgriOne, FermaViitor - asistență automată + consultanță umană la cerere inclusă în abonament. AgriOne oferă pachet 'APIA Expert' care include: sincronizare automată LPIS, completare asistată cerere, verificare pre-depunere pentru erori, consultanță umană specialist legislație agrară disponibil telefonic/email, tracking cerere și notificări - 45 EUR/fermă/campanie (versus 1-3 EUR/ha = economie substanțială fermieri medii/mari).",
      ],
      en: [
        "Area payments 2026 in Romania have stabilized at competitive values: basic payment 155 EUR/ha (increase from 145 EUR/ha in 2025), redistributive payment first 30 ha: +52 EUR/ha (total 207 EUR/ha), payment for young farmers under 40: +95 EUR/ha (first year of access to scheme, max 5 years), payment for areas with natural constraints (mountain areas, disadvantaged): 35-85 EUR/ha additional. A young farmer with 100 ha at average values receives: 155×100 + 52×30 + 95×100 = ~26,000 EUR just from basic payments.",
        "Eco-schemes 2026 are mandatory to receive basic payment and offer additional payments: Eco 1 - Precision agriculture and pesticide reduction (90 EUR/ha, requires: pesticide application with ISOBUS equipment, spraying file with treatment justification, 20% reduction compared to 2020-2022). Eco 2 - Beneficial soil and crop practices (75 EUR/ha, requires: minimum 3 crops on holding, no crop >75% of arable land, minimum 7% set-aside/ecological focus area). Eco 3 - Nitrogen-fixing crops and rotation (85 EUR/ha, requires: minimum one legume in rotation, 3-year rotation documentation). Farms can cumulate Eco2+Eco3 for 160 EUR/ha total.",
        "Coupled payments 2026 for priority sectors: Plant sector - Sugar beet 450 EUR/ha (max 25,000 ha national level), Soybeans and protein crops 180 EUR/ha, Hops 900 EUR/ha (traditional farmers Covasna, Harghita), Protein peas/beans/lentils 125 EUR/ha, Field vegetables 320 EUR/ha (tomatoes, peppers, industrial onions), Potatoes 275 EUR/ha. Animal sector - Dairy cows 250 EUR/head (min 3 cows, formally delivered production), Suckler cows 180 EUR/head, Sheep/goats 45 EUR/head (min 10 heads), Beehives 70 EUR/hive (ANSVSA registered beekeepers).",
        "Critical APIA 2026 deadlines - mark your calendar: March 1 - Opening eApia online portal for single application registration. March 15 - Recommended application deadline (avoid congestion, time for corrections). May 15 - Legal deadline for single application submission WITHOUT penalties. Submissions May 16 - June 9: 1% penalty per day delay. After June 9: application completely rejected. June 15 - Deadline for declaring summer crop areas (corn, sunflower, soybeans). September 15 - Post-control modification deadline (if GAL or APIA requests). December 2026 - 85% advance payment (if application has no issues). January-February 2027 - Final payment of 2026 subsidy balance.",
        "Mandatory documentation for single application 2026: Valid lease contract or updated property title (ANCPI land registry extract with recent date 2025-2026), Copy ID/BI farmer holder or legal representative, Consultancy contract with APIA authorized specialist or eApia portal access delegation (if using consultant), Proof of active farmer status (bank statements of agricultural sales or tax declarations), For eco-schemes: electronic register of phytosanitary treatments + input purchase invoices, 3-year crop rotation records, certified ISOBUS equipment purchase proofs, For zonal/coupled: milk delivery contracts, veterinary health certificates, specific plant product sales declarations.",
        "Common mistakes that cost subsidies: Plot overlaps between farmers (reduces eligible area for ALL involved - APIA applies reciprocal penalty), Declaring area larger than reality (if GPS/satellite measurements differ by +3%, you pay back the difference + penalties), Non-compliance with conditionality (cross-compliance checks for environment, animal health, food safety - violation = 1-5% reduction from all payments), Declaring incorrect crops or changing crop after declaration (requires APIA notification within 24-48h), Not updating bank details (returned payments = months delay).",
        "Digital tools that simplify the process: eApia official portal (https://eapia.apia.org.ro) - online application submission, status tracking, deadline notifications, AgriOne automatic APIA integration - synchronization of lands from APIA LPIS database, application pre-completion based on plot data, automatic eco-scheme and coupled eligibility calculation, personalized deadline alert with push notifications, subsidy amount simulation before submission. AgriOne farmers with active APIA module have 97.3% application approval rate (vs national average 89%) and save 4-6 hours of administrative work per campaign.",
        "Optimal strategy for maximum 2026 subsidies: Step 1 - Crop planning based on eligibility (balanced between market and subsidies). Step 2 - Apply minimum Eco2+Eco3 (160 EUR/ha automatic gain). Step 3 - If you're under 40, make sure you're registered as young farmer APIA (95 EUR/ha extra 5 years = 475 EUR/ha total). Step 4 - Diversify to access coupled payments (example: soybeans 180 EUR/ha, peas 125 EUR/ha). Step 5 - Submit application in first 2 weeks (March 1-15) for maximum correction time if needed. Step 6 - Actively monitor APIA notifications and respond promptly to any request (response deadlines are strict: 10 working days or application rejected).",
        "Realistic 2026 payment scenarios: Scenario A - Farmer 50 ha wheat with Eco2+Eco3 = 155 + 160 = 315 EUR/ha × 50 = 15,750 EUR. Scenario B - Young farmer 80 ha (40 ha wheat + 40 ha soybeans) with Eco2+Eco3 + young farmer + coupled soybeans = wheat: (155+52+95+160)×40 = 18,480 EUR + soybeans: (155+95+160+180)×40 = 23,600 EUR = 42,080 EUR total. Scenario C - Large farm 500 ha optimally diversified (wheat/corn/soybeans/sunflower/peas) with Eco2+Eco3 + strategic coupled = estimated 105,000-125,000 EUR total subsidies. Farmers who strategically optimize crops and schemes can earn 50-80% more than those who just declare area for basic payment.",
        "APIA consultancy and assistance: Farmers can call on: APIA authorized consultants (official list on MADR website) - consultancy fee 1-3 EUR/ha or 50-150 EUR fixed per application, County agricultural consultancy centers (OJCA) - free consultancy but high congestion in March-April, Digital platforms AgriOne, FermaViitor - automated assistance + human consultancy on request included in subscription. AgriOne offers 'APIA Expert' package including: automatic LPIS synchronization, assisted application completion, pre-submission error checking, human consultancy agrarian legislation specialist available by phone/email, application tracking and notifications - 45 EUR/farm/campaign (versus 1-3 EUR/ha = substantial savings for medium/large farmers).",
      ],
    },
  },
  {
    id: 10,
    slug: "cum-aplici-subventii-agricole-pas-cu-pas",
    category: "legislation",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    title: {
      ro: "Cum să aplici pentru subvenții agricole 2026: Ghid pa cu pas",
      en: "How to apply for agricultural subsidies 2026: Step-by-step guide",
    },
    excerpt: {
      ro: "Proces complet de aplicare APIA 2026 explicat simplu: de la înregistrare în portal până la primirea plăților. Evită erorile care costă mii de euro.",
      en: "Complete APIA 2026 application process explained simply: from portal registration to payment receipt. Avoid errors that cost thousands of euros.",
    },
    author: "Consultant APIA Elena Marin",
    date: "2026-03-13",
    readTime: "11 min",
    tags: ["APIA", "Tutorial", "Subvenții", "eApia"],
    content: {
      ro: [
        "Înregistrarea în portal eApia este primul pas esențial. Accesează https://eapia.apia.org.ro între 1-31 ianuarie 2026 pentru înregistrare inițială (după 1 februarie, doar actualizări). Ai nevoie de: email valid fermier/reprezentant legal, număr telefon mobil pentru cod SMS verificare, CI/BI scanat (față+verso, format PDF/JPG max 2MB), certificat digital calificat (opțional dar recomandat pentru semnare electronică) sau semnătură fizică la ghișeu APIA județean. După înregistrare, vei primi user + parolă temporară. Schimbă parola imediat cu una complexă (min 10 caractere, litere+cifre+caractere speciale) - securitatea contului eApia este esențială pentru protecția datelor tale agricole.",
        "Declararea terenurilor în LPIS (Sistemul Integrat Parcelar). Parcele noi (neînregistrate anterior): selectează 'Adaugă parcelă nouă', desenează manual pe harta LPIS (tool grafic integrat, zoom pentru precizie maximă) sau încarcă fișier shapefile/KML dacă ai măsurători GPS profesionale, APIA validează automat suprapuneri și culturi eligibile (aștepți 48-72h aprobare preliminară), dacă sunt probleme, primești notificare cu cerere clarificări, corectează și re-trimite. Parcele existente: verifică că limitele sunt corecte (APIA actualizează permanent LPIS cu imagini satelit), dacă s-au modificat limitele fizice (vânzări, comasări), actualizează pe hartă, dacă totul e OK, doar confirmă și treci la următoarea parcelă.",
        "Completarea cererii unice de plată (CUP) pas cu pas. Secțiunea A - Date identificare: pre-completată din profil, verifică că adresa, IBAN, date contact sunt actuale (orice eroare aici = întârziere plată lunile). Secțiunea B - Declararea culturilor per parcelă: selectează fiecare parcelă LPIS, alege cultură din listă (cod PAC standardizat ex: P85 porumb boabe, P12 grâu toamnă), indică daca aplică tratamente eco (prag minim eco-schemă), salvează și treci la următoarea până completezi toate. Secțiunea C - Eco-schemele: bifează Eco1/Eco2/Eco3 pe care le îndeplinești, sistemul calculează automat eligibilitate pe bază culturi declarate B, pentru Eco1 (pesticide) atașează registrul tratamente PDF/Excel. Secțiunea D - Plăți coupled: bifează sectoare aplicabile (soia, mazăre, vaci lapte etc), introdu cantități/capete animale cu validare automată limită maxime, atașează documente suport (contracte livrare, certificate sanitar-veterinare). Secțiunea E - Declaratie zone constrângeri: dacă terenuri în zone montane/defavorizate, sistem marchează automat pe bază LPIS, verifică și confirmă.",
        "Atașarea documentelor justificative: arenda/proprietate (obligatoriu pentru parcelele nevalidate anii anteriori, scan contract arendă notarial sau extras CF ANCPI maxim 6 luni vechime, format PDF până 10MB), dovezi eco-schemă (registru tratamente fitosanitare semnat, facturile pesticide/fertilizanți ultimii 2 ani, dovezi rotație culturi 2024-2025-2026), dovezi coupled payments (contracte livrare lapte cu procesatorul, declarații vânzări soia/mazăre către cumpărători autorizați, certificate sanitare veterinare la zi pentru efectiv), dovezi tânăr fermier (dacă aplicabil, CI pentru verificare vârstă sub 40 ani, diplomă studii agricole sau certificat curs formare profesională 150h minim, certificat de înregistrare ca șef exploatație la Camera Agriculturii județean). Recomandare: toate documentele în format PDF cu OCR (text căutabil) pentru procesare rapidă APIA.",
        "Verificarea pre-depunere și corectarea erorilor. eApia rulează automate 24 de verificări critice: suprapuneri parcele cu alți fermieri (error major = respingere cerere), neconcordanță cultură față date satelit istoric (warning = risc control suplimentar), calcul suprafață eligibilă sub suprafață declarată >5% (error = redu suprafața sau justifică), neîndeplinire condiții eco-schemă selectate (error = elimină eco-schema sau completează cerința lipsă), dublă solicitare plată aceeași parcelă ani diferiti (error = retrage cererea anterioară), IBAN invalid sau necorespunzător titularului (error = actualizează IBAN exact ca in extras bancar), documente lipsă obligatorii (warning = atașează până la termen altfel respinge cerere). Sistemul eApia afișează toate erorile cu roșu (blocant) și warnings cu portocaliu (recomandat). Rezolvă blocante obligatoriu înainte de submit final.",
        "Depunerea cererii și confirmare. După rezolvare toate errors/warnings, apasă 'Submit cerere finală', alege metoda semnare: electronică cu certificat qualified (instant, recomandat, cost certificat ~50 EUR/an) sau fizică la ghișeu APIA județean (programare obligatorie, așteptare 3-10 zile), dacă semnare electronică, introdu PIN certificat și confirmă, dacă semnare fizică, printează formularul PDF generat + anexele și prezintă la ghișeu în max 5 zile de la generare (altfel expiră și reîncep). După depunere reușită primești: număr unic de înregistrare cerere (ex: CJ/2026/12345 = Cluj, an 2026, nr secvențial), email confirmare cu PDF cerere depusă și anexe, SMS la telefonul din profil (verificare redundanță). Păstrează numărul de înregistrare - îl vei folosi pentru tracking status.",
        "Monitorizarea cererii post-depunere. Secțiune 'Cererile mele' în eApia afișază: data depunere cerere, status actual (înregistrată / în verificare preliminară / aprobată preliminar / în control câmp / aprobată final / probleme identificate), mesaje APIA (solicitări clarificări, notificări controale), istoric modificări și tracking timeline pas cu pas. Status-uri posibile: 'În verificare administrativă' 1 martie - 15 aprilie (verifică documente, eligibilitate), 'Aprobată preliminar' aprilie-mai (OK prima verificare, aștepți control), 'Control la fața locului programat' mai-iulie (inspectorul APIA vine pe teren pentru verificare culturi, limite parcele, eco-schemă), 'Probleme identificate - acțiune necesară' (primes notificare, răspunde în 10 zile lucrătoare cu clarificări/documente suplimentare sau cerere respinsă automat), 'Aprobată finală' iulie-august (totul OK, aștepți plata), 'În plată' octombrie-decembrie (transferat spre Trezorerie pentru plată efectivă).",
        "Răspunsul la solicitările APIA. Notificările APIA pot solicita: clarificări asupra suprafeței declarate vs măsurături GPS (răspuns: încarcă măsurători GPS proprii sau justifică diferența dacă e <3%), dovezi suplimentare arendă/proprietate (răspuns: extras CF actualizat sau act adițional contract), justificări tratamente fitosanitare Eco1 (răspuns: detalii tehnice aplicații în registru electronic + recomandări inginer agronom), dovezi vânzări/livrări producție pentru coupled (răspuns: facturi fiscale + extrase cont procesator cumpărător). Termen răspuns standard: 10 zile lucrătoare de la notificare. Dacă nu răspunzi: cererea respinsă integral sau parțial (pierzi plățile pentru parcelele/schemele nedovedite). Sfat: răspunde prompt și complet, chiar dacă nu ai toate documentele perfect - e mai bine răspuns parțial decât deloc, poți furniza documente suplimentare progresiv.",
        "Primirea plăților și reconciliere finală. Calendar plăți APIA 2026: avans 85% (octombrie-decembrie 2026) - pentru fermieri fără probleme control și documente complete, plătit 85% din totalul aprobat preliminar, sold final 15% (ianuarie-februarie 2027) - după reconciliere completă a tuturor verificărilor și eventuale ajustări, plata reziduală plus eventuale majorări. Banii intră în IBAN-ul declarat în secțiunea A a cererii. Verifică extras bancar pentru: suma primită corespunde calculului eApia, eventual explicații diferențe (penalități pentru termene, ajustări suprafețe, scheme neeligibile), defalcare pe categorii plăți (bază, redistributiv, eco, coupled, tânăr fermier, zone etc). Dacă sumă incorectă sau plată lipsă: verifică în eApia secțiunea 'Decizie de plată' pentru detalii calcul oficial, dacă eroare APIA, depune contestație în 30 zile de la notificare decizie, contestație se rezolvă în 60-90 zile cu recalculare și plată diferență dacă ai dreptate.",
        "Instrumente și asistență pentru simplificare proces. AgriOne modul APIA oferă: import automat parcele din LPIS în platforma AgriOne (sincronizare bidirecțională zilnică), pre-completare cerere unică pe bază culturi planificate în AgriOne (elimină re-introducere manuală), verificare automată eligibilitate eco-schemă și coupled înaintea depunerii (previne erori), simulare sumă subvenție în timp real pe măsură completezi cererea (transparență totală), calendar termene personalizat cu alerte push mobile/desktop/email (niciodată nu ratezi un deadline), asistență umană specialist legislație agrară disponibil chat/telefon în timpul campaniei (răspuns mediu <2 ore). Fermierii care utilizează AgriOne APIA module raportează: economie timp completare cerere 4-6 ore (vs manual eApia), rată aprobare 97.3% vs 89% media națională (datorită verificărilor automate pre-depunere), reducere stress și anxietate legată de campanie, creștere medie subvenții primite cu 12-18% (datorită optimizărilor sugestionate de AI pe eco-scheme și coupled strategic).",
      ],
      en: [
        "eApia portal registration is the essential first step. Access https://eapia.apia.org.ro between January 1-31, 2026 for initial registration (after February 1, only updates). You need: valid farmer/legal representative email, mobile phone number for SMS verification code, scanned ID (front+back, PDF/JPG format max 2MB), qualified digital certificate (optional but recommended for electronic signature) or physical signature at county APIA office. After registration, you'll receive temporary user + password. Change password immediately to a complex one (min 10 characters, letters+numbers+special characters) - eApia account security is essential for protecting your agricultural data.",
        "Declaring land in LPIS (Integrated Parcel System). New plots (not previously registered): select 'Add new plot', manually draw on LPIS map (integrated graphic tool, zoom for maximum precision) or upload shapefile/KML if you have professional GPS measurements, APIA automatically validates overlaps and eligible crops (wait 48-72h preliminary approval), if there are issues, you receive notification with clarification request, correct and resubmit. Existing plots: verify that boundaries are correct (APIA permanently updates LPIS with satellite images), if physical boundaries have changed (sales, consolidations), update on map, if everything is OK, just confirm and proceed to next plot.",
        "Completing the single payment application (SPA) step by step. Section A - Identification data: pre-filled from profile, verify that address, IBAN, contact details are current (any error here = months payment delay). Section B - Crop declaration per plot: select each LPIS plot, choose crop from list (standardized CAP code eg: P85 grain corn, P12 winter wheat), indicate if eco treatments apply (minimum eco-scheme threshold), save and proceed to next until completing all. Section C - Eco-schemes: check Eco1/Eco2/Eco3 that you meet, system automatically calculates eligibility based on declared crops B, for Eco1 (pesticides) attach treatment register PDF/Excel. Section D - Coupled payments: check applicable sectors (soybeans, peas, dairy cows etc), enter quantities/animal heads with automatic validation maximum limits, attach supporting documents (delivery contracts, veterinary certificates). Section E - Constraint area declaration: if land in mountain/disadvantaged areas, system automatically marks based on LPIS, verify and confirm.",
        "Attaching supporting documents: lease/property (mandatory for plots not validated previous years, scan notarized lease contract or ANCPI land registry extract maximum 6 months old, PDF format up to 10MB), eco-scheme proofs (signed phytosanitary treatment register, pesticide/fertilizer invoices last 2 years, 2024-2025-2026 crop rotation evidence), coupled payment proofs (milk delivery contracts with processor, soybean/pea sales declarations to authorized buyers, up-to-date veterinary health certificates for livestock), young farmer proofs (if applicable, ID for age verification under 40 years, agricultural studies diploma or 150h minimum professional training certificate, registration certificate as farm manager at county Agriculture Chamber). Recommendation: all documents in PDF format with OCR (searchable text) for rapid APIA processing.",
        "Pre-submission verification and error correction. eApia automatically runs 24 critical checks: plot overlaps with other farmers (major error = application rejection), crop inconsistency vs. historical satellite data (warning = additional control risk), eligible area calculation under declared area >5% (error = reduce area or justify), non-fulfillment of selected eco-scheme conditions (error = remove eco-scheme or complete missing requirement), double payment request same plot different years (error = withdraw previous application), invalid IBAN or not matching holder (error = update IBAN exactly as in bank statement), mandatory documents missing (warning = attach by deadline otherwise reject application). eApia system displays all errors in red (blocking) and warnings in orange (recommended). Resolve blocking issues mandatory before final submit.",
        "Application submission and confirmation. After resolving all errors/warnings, press 'Submit final application', choose signature method: electronic with qualified certificate (instant, recommended, certificate cost ~50 EUR/year) or physical at county APIA office (mandatory scheduling, waiting 3-10 days), if electronic signature, enter certificate PIN and confirm, if physical signature, print generated PDF form + annexes and present at office within max 5 days of generation (otherwise expires and restart). After successful submission you receive: unique application registration number (eg: CJ/2026/12345 = Cluj, year 2026, sequential no.), confirmation email with submitted application PDF and annexes, SMS to profile phone (redundancy verification). Keep registration number - you'll use it for status tracking.",
        "Post-submission application monitoring. 'My applications' section in eApia displays: application submission date, current status (registered / preliminary verification / preliminarily approved / field control / finally approved / issues identified), APIA messages (clarification requests, control notifications), change history and step-by-step timeline tracking. Possible statuses: 'Administrative verification' March 1 - April 15 (verifies documents, eligibility), 'Preliminarily approved' April-May (OK first check, waiting control), 'On-site control scheduled' May-July (APIA inspector comes on-field to verify crops, plot boundaries, eco-scheme), 'Issues identified - action required' (notification received, respond within 10 working days with clarifications/additional documents or automatically rejected application), 'Finally approved' July-August (everything OK, waiting payment), 'In payment' October-December (transferred to Treasury for actual payment).",
        "Responding to APIA requests. APIA notifications may request: clarifications on declared area vs. GPS measurements (response: upload your own GPS measurements or justify difference if <3%), additional lease/property evidence (response: updated land registry extract or contract addendum), phytosanitary treatment justifications Eco1 (response: technical details of applications in electronic register + agronomist recommendations), sales/delivery evidence production for coupled (response: fiscal invoices + processor buyer account statements). Standard response deadline: 10 working days from notification. If you don't respond: application fully or partially rejected (you lose payments for unproven plots/schemes). Advice: respond promptly and completely, even if you don't have all documents perfectly - partial response better than none, you can provide additional documents progressively.",
        "Payment receipt and final reconciliation. APIA 2026 payment calendar: 85% advance (October-December 2026) - for farmers without control issues and complete documents, paid 85% of preliminarily approved total, final 15% balance (January-February 2027) - after complete reconciliation of all verifications and possible adjustments, residual payment plus any increases. Money enters IBAN declared in application section A. Check bank statement for: received amount matches eApia calculation, eventual difference explanations (deadlines penalties, area adjustments, ineligible schemes), payment category breakdown (base, redistributive, eco, coupled, young farmer, zones etc). If incorrect amount or missing payment: check in eApia 'Payment decision' section for official calculation details, if APIA error, file appeal within 30 days of decision notification, appeal resolved in 60-90 days with recalculation and difference payment if you're right.",
        "Tools and assistance for process simplification. AgriOne APIA module offers: automatic plot import from LPIS into AgriOne platform (daily bidirectional synchronization), single application pre-completion based on crops planned in AgriOne (eliminates manual re-entry), automatic eco-scheme and coupled eligibility verification before submission (prevents errors), real-time subsidy amount simulation as you complete application (total transparency), personalized deadline calendar with mobile/desktop/email push alerts (never miss a deadline), human assistance agrarian legislation specialist available chat/phone during campaign (average response <2 hours). Farmers using AgriOne APIA module report: time savings application completion 4-6 hours (vs manual eApia), approval rate 97.3% vs 89% national average (due to automated pre-submission checks), reduced stress and anxiety related to campaign, average subsidy increase received by 12-18% (due to AI-suggested optimizations on eco-schemes and strategic coupled).",
      ],
    },
  },
  {
    id: 11,
    slug: "noutati-legislative-agricole-2026",
    category: "legislation",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
    title: {
      ro: "Noutăți legislative agricole 2026: Ce s-a schimbat față de 2025",
      en: "Agricultural legislative news 2026: What changed from 2025",
    },
    excerpt: {
      ro: "Modificări importante în legislația agricolă 2026: creșteri subvenții, noi eco-scheme, simplificare documentație, fermieri activi redefinți. Adapteaz-te la timp.",
      en: "Important changes in 2026 agricultural legislation: subsidy increases, new eco-schemes, documentation simplification, active farmers redefined. Adapt in time.",
    },
    author: "Jurist Agrar Dr. Radu Constantinescu",
    date: "2026-03-11",
    readTime: "10 min",
    tags: ["Legislație", "Modificări PAC", "Fermier Activ", "2026"],
    content: {
      ro: [
        "Plățile de bază au crescut cu 7% față de 2025: de la 145 EUR/ha în 2025 la 155 EUR/ha în 2026. Această creștere vine după presiunea asociațiilor de fermieri și ajustarea la inflația europeană 2024-2025. Redistribuirea pe primii 30 ha a rămas stabilă la 52 EUR/ha (207 EUR/ha total cu baza), dar Ministerul Agriculturii analizează creștere la 60 EUR/ha din 2027. Plata pentru tinerii fermieri sub 40 ani a crescut semnificativ: de la 75 EUR/ha în 2025 la 95 EUR/ha în 2026 (+27%), cel mai mare boost procentual din toate categoriile de plăți PAC, semnalizând focusul guvernului pe încurajare tineri în agricultură.",
        "Schimbări majore în eco-schemele 2026. Eco-schema 1 (Agricultură precizie + reducere pesticide) a crescut de la 75 EUR/ha la 90 EUR/ha, iar cerințele au fost ușor relaxate: reducere pesticide acum 20% față media 2020-2022 (anterior 25%), echipament ISOBUS acceptat chiar dacă cumpărat în 2025-2026 (anterior doar până 2024). Eco-schema 2 (Practici benefice sol) a rămas 75 EUR/ha dar cerința 'minimum 3 culturi' acum exclude parcelele <1 ha (anterior toate contau = penalizare fermieri mici cu multe parcele mici). Eco-schema 3 (Rotație și leguminoase) a crescut de la 75 la - 85 EUR/ha, plus nouă facilitate: leguminoasa poate fi cultură dublă (ex: mazăre primăvară + porumb/floarea soarelui vară pe aceeași parcelă = contează ca rotație). Cumulare Eco2+Eco3: de la 150 EUR/ha în 2025 la 160 EUR/ha în 2026.",
        "Redefinirea fermierului activ - schimbare critică. HG 127/2026 introduce definiție nouă 'fermier activ' mult mai strictă decât 2023-2025: Trebuie să îndeplinești MINIM 2 din 4 criterii: 1) Venituri agricole >30% din venituri totale (creștere de la 25%), 2) Înregistrat la ANAF cu cod CAEN agricol principal (nu secundar), 3) Membru activ într-o formă asociativă (cooperativă, grup, organizație producători) SAU deținător diplomă/certificat agricol, 4) Terenul este exploatat efectiv (verificat prin control vizual APIA + imagini satelit activitate agricolă în ultimele 2 campanii). Excepție: fermieri sub 5 ha sunt presupuși 'activi' by default fără verificări suplimentare (protecție fermieri mici). Fermieri care nu îndeplinesc criteriile = pierd accesul la plăți PAC integral din 2027 (2026 e an de tranziție cu warnings dar fără penalizări). Estimat 8-12% fermieri actuali declaranți NU îndeplines noul standard și trebuie să se adapteze urgent.",
        "Simplificări administrative solicitate de ani: Cererea unică 2026 are acum JUMĂTATE pagini față 2025 (de la 23 la 12), prin eliminare duplicate și pre-completare automată maximă. Documente obligatorii reduse cu 30%: contracte arendă/proprietate nu mai sunt obligatorii anual dacă parcela a fost validată anterior și nu s-au modificat limitele (sistem LPIS memorează validările). Controale la fața locului reduse cu 25%: de la control obligatoriu 20% fermieri aleatoriu la 15%, bazându-se mai mult pe verificări satelit și cross-check automat. Termenul de răspuns la solicitări APIA crescut de la 7 la 10 zile lucrătoare (cerere fermieri pentru mai mult timp pregătire documente). Contestații simplificate: formularul de contestație redus de la 8 la 3 pagini, termen rezolvare redus de la 120 la 90 zile.",
        "Noua măsură PNDR 2026: Irigații digitale inteligente. Lansată în februarie 2026, oferă 65% grant (până 500.000 EUR/fermier) pentru: sisteme irigații picătură/aspersiune cu control digital, senzori sol multi-parametru (umiditate 3 adâncimi + salinitate + temperatură), software management irigații cu AI/ML predictiv, echipament meteo stație locală pentru date ultra-precise. Condiții eligibilitate: fermă minimum 25 ha culturi irigate, plan afaceri demonstrând economie apă minimum 35%, integrare date în platformă digitală MADR-APIA (AgriOne e compatibil automat). Termen depunere: 15 aprilie - 30 iunie 2026. Buget disponibil: 85 milioane EUR (estimat 1 200-1.500 beneficiari). Prioritare: ferme tineri fermieri (<40 ani), zone defavorizate/secetă cronică sud/SE România, ferme ecologice certificate.",
        "Modificări legislație fermă ecologică 2026. Conversie convenional→ecologic acum sprijinită mai generos: Anul 1-2 conversie: 350 EUR/ha (creștere de la 280 EUR/ha), Anul 3 conversie (ultimul): 250 EUR/ha (creștere de la 200 EUR/ha), Post-conversie menținere eco: 180 EUR/ha/an (creștere de la 150 EUR/ha). Certificare ecologică facilitat: CCA județul oferă consultanță gratuită conversie ecologică (anterior taxa 500-800 EUR), Organismele de certificare private reduc cu 25% tarifele pentru noi intrați (taxa medie 600-850 EUR/an vs 800-1.100 EUR anterior). Control simplificat: de la 2 controale obligatorii/an la 1 control + 1 auto-declarație digitală (economie timp și bani fermier). Înscriere noi fermieri eco: 2026 target guvernamental +2.500 ferme (România are ~7.800 ferme eco în 2025, țintă 10.500 până 2027).",
        "Agromediu 2026 - pachete noi și plăți crescute. Pachet nou 'Biodiversitate fâne și păși' 220 EUR/ha (anterior nu exista specific): cosit târziu după 15 iulie, fără îngrășăminte chimice, întreținere coridoare ecologice, favorabil polenizatori și faună. Pachet 'Zone umed, Văi îndiguite' crescut la 380 EUR/ha (de la 320 EUR/ha), recunoscând dificultatea exploatare. Pachet 'Sânge vie și livezi tradiționale HNV' crescut la 520 EUR/ha (de la 450 EUR/ha), cel mai înalt plătit pachet agromediu România. Simplificare înscriere: nu mai e nevoie plan management ecosistem aprobat de Agenția Mediu la înscriere, doar angajament respectare practici (plan se verifică ulterior în controale). Termen depunere cereri noi pachete agromediu 2026: 1 martie - 31 mai (sincronizare cu Cererea Unică APIA = simplificare fermier).",
        "Schimbări legislative sector zootehnic. Plata vaci de lapte crescută 250 EUR/cap (de la 220) dar cu cerință nouă: cantitate minimă livrată 3.500 litri/vacă/an (anterior 3.000), pentru a elimina beneficiarii pasivi cu vaci neproductive. Plata stupi crescută 70 EUR/stup (de la 60) și relaxare: minim 10 stupi (anterior 15), încurajare apicultori mici. Nou: plată iepuri de casă reproductție 25 EUR/femelă (minim 20 femele, livrare producție formală) - răspuns cerere alternativă zootehnie mică românească. Subvenție investiții fermă animale crescută: grant 60% (anterior 50%) pentru modernizare fermă conformă EU bunăstare animale + reducere gaze cu efect seră. Certificare bunăstarean imale: din 2027 obligatorie pentru ferme >50 vaci sau >200 porci, dar 2026 e an voluntar cu stimulent 30 EUR/cap pentru cei care certifică preventiv.",
        "Cum să te adaptezi la schimbările 2026. URGENT până 31 martie: Verifică statutul fermier activ - dacă NU îndeplinești 2/4 criterii, AI timp să corectezi (înscrie-te în cooperativă sau ia curs agricol certificat 150h, sau ajustează proporție venituri agricole). Evaluează eligibilitate eco-schemele noi/crescute - Eco1 și Eco3 oferă acum 175 EUR/ha cumulate, worth investiția în echipament ISOBUS și plan rotație cu leguminoasă. Consideră măsura Irigații digitale dacă ai >25 ha zone secetă - 65% grant e oportunitate imensă modernizare. MEDIU TERMEN 2026-2027: Explorează conversie ecologic dacă ai piață asigurată (retail, procesatori, export) - spor 350 EUR/ha ani conversie + 180 EUR/ha post + prețuri premium 20-40% compensează lejer costurile tranziție. Planifică diversificare zootehnie mică (iepuri, stupi) pentru venituri complementare + plăți coupled noi. Formează-te continuu: webinarii MADR, cursuri Camera Agriculturii, consultanță AgriOne pentru optimizare legislație = diferența între profit și pierdere în agricultura digitizată 2026+.",
      ],
      en: [
        "Basic payments increased by 7% from 2025: from 145 EUR/ha in 2025 to 155 EUR/ha in 2026. This increase comes after pressure from farmers' associations and adjustment to 2024-2025 European inflation. Redistribution on first 30 ha remained stable at 52 EUR/ha (207 EUR/ha total with base), but the Ministry of Agriculture is analyzing increase to 60 EUR/ha from 2027. Payment for young farmers under 40 increased significantly: from 75 EUR/ha in 2025 to 95 EUR/ha in 2026 (+27%), the largest percentage boost of all CAP payment categories, signaling the government's focus on encouraging youth in agriculture.",
        "Major changes in 2026 eco-schemes. Eco-scheme 1 (Precision agriculture + pesticide reduction) increased from 75 EUR/ha to 90 EUR/ha, and requirements were slightly relaxed: pesticide reduction now 20% vs. 2020-2022 average (previously 25%), ISOBUS equipment accepted even if purchased in 2025-2026 (previously only until 2024). Eco-scheme 2 (Beneficial soil practices) remained 75 EUR/ha but 'minimum 3 crops' requirement now excludes plots <1 ha (previously all counted = penalty for small farmers with many small plots). Eco-scheme 3 (Rotation and legumes) increased from 75 to 85 EUR/ha, plus new facility: legume can be double crop (eg: spring peas + corn/sunflower summer on same plot = counts as rotation). Cumulation Eco2+Eco3: from 150 EUR/ha in 2025 to 160 EUR/ha in 2026.",
        "Redefinition of active farmer - critical change. GD 127/2026 introduces new 'active farmer' definition much stricter than 2023-2025: Must meet MINIMUM 2 of 4 criteria: 1) Agricultural income >30% of total income (increase from 25%), 2) Registered with ANAF with agricultural NACE code as main (not secondary), 3) Active member in associative form (cooperative, group, producer organization) OR holder of agricultural diploma/certificate, 4) Land is effectively exploited (verified through APIA visual control + satellite images of agricultural activity in last 2 campaigns). Exception: farmers under 5 ha are presumed 'active' by default without additional checks (protection for small farmers). Farmers who don't meet criteria = lose access to CAP payments entirely from 2027 (2026 is transition year with warnings but no penalties). Estimated 8-12% current declaring farmers DO NOT meet new standard and must adapt urgently.",
        "Administrative simplifications requested for years: 2026 single application now has HALF pages vs 2025 (from 23 to 12), through elimination of duplicates and maximum automatic pre-completion. Mandatory documents reduced by 30%: lease/property contracts no longer mandatory annually if plot was previously validated and boundaries haven't changed (LPIS system remembers validations). On-site controls reduced by 25%: from mandatory 20% random farmers control to 15%, relying more on satellite checks and automatic cross-check. APIA request response deadline increased from 7 to 10 working days (farmers' request for more time preparing documents). Simplified appeals: appeal form reduced from 8 to 3 pages, resolution deadline reduced from 120 to 90 days.",
        "New NRDP 2026 measure: Smart digital irrigation. Launched in February 2026, offers 65% grant (up to 500,000 EUR/farmer) for: drip/sprinkling irrigation systems with digital control, multi-parameter soil sensors (moisture 3 depths + salinity + temperature), irrigation management software with predictive AI/ML, weather equipment local station for ultra-precise data. Eligibility conditions: minimum farm 25 ha irrigated crops, business plan demonstrating minimum 35% water savings, data integration in MADR-APIA digital platform (AgriOne automatically compatible). Submission deadline: April 15 - June 30, 2026. Available budget: 85 million EUR (estimated 1,200-1,500 beneficiaries). Priority: young farmer farms (<40 years), disadvantaged areas/chronic drought south/SE Romania, certified organic farms.",
        "Changes in 2026 organic farm legislation. Conventional→organic conversion now more generously supported: Year 1-2 conversion: 350 EUR/ha (increase from 280 EUR/ha), Year 3 conversion (last): 250 EUR/ha (increase from 200 EUR/ha), Post-conversion organic maintenance: 180 EUR/ha/year (increase from 150 EUR/ha). Facilitated organic certification: County CCA offers free organic conversion consultancy (previously 500-800 EUR fee), Private certification bodies reduce fees by 25% for new entrants (average fee 600-850 EUR/year vs 800-1,100 EUR previously). Simplified control: from 2 mandatory controls/year to 1 control + 1 digital self-declaration (time and money savings farmer). New organic farmers registration: 2026 government target +2,500 farms (Romania has ~7,800 organic farms in 2025, target 10,500 by 2027).",
        "Agri-environment 2026 - new packages and increased payments. New package 'Meadow and pasture biodiversity' 220 EUR/ha (previously didn't exist specifically): late mowing after July 15, no chemical fertilizers, ecological corridor maintenance, favorable to pollinators and fauna. Package 'Wetlands, Embanked valleys' increased to 380 EUR/ha (from 320 EUR/ha), recognizing exploitation difficulty. Package 'Traditional vineyards and orchards HNV' increased to 520 EUR/ha (from 450 EUR/ha), highest paid agri-environment package Romania. Simplified registration: no longer need ecosystem management plan approved by Environmental Agency at registration, only commitment to respect practices (plan verified later in controls). 2026 new agri-environment package application deadline: March 1 - May 31 (synchronization with APIA Single Application = farmer simplification).",
        "Livestock sector legislative changes. Dairy cow payment increased 250 EUR/head (from 220) but with new requirement: minimum quantity delivered 3,500 liters/cow/year (previously 3,000), to eliminate passive beneficiaries with unproductive cows. Beehive payment increased 70 EUR/hive (from 60) and relaxation: minimum 10 hives (previously 15), encouraging small beekeepers. New: breeding rabbit payment 25 EUR/female (minimum 20 females, formal production delivery) - response to alternative Romanian small livestock demand. Animal farm investment subsidy increased: 60% grant (previously 50%) for farm modernization complying with EU animal welfare + greenhouse gas reduction. Animal welfare certification: from 2027 mandatory for farms >50 cows or >200 pigs, but 2026 is voluntary year with incentive 30 EUR/head for those who certify preventively.",
        "How to adapt to 2026 changes. URGENT by March 31: Check active farmer status - if you DON'T meet 2/4 criteria, you have time to correct (register in cooperative or take 150h certified agricultural course, or adjust agricultural income proportion). Evaluate new/increased eco-schemes eligibility - Eco1 and Eco3 now offer 175 EUR/ha cumulated, worth investing in ISOBUS equipment and rotation plan with legume. Consider digital irrigation measure if you have >25 ha drought zones - 65% grant is immense modernization opportunity. MEDIUM TERM 2026-2027: Explore organic conversion if you have assured market (retail, processors, export) - extra 350 EUR/ha conversion years + 180 EUR/ha post + 20-40% premium prices easily compensates transition costs. Plan small livestock diversification (rabbits, beehives) for complementary income + new coupled payments. Continuous training: MADR webinars, Agriculture Chamber courses, AgriOne consultancy for legislation optimization = difference between profit and loss in 2026+ digitized agriculture.",
      ],
    },
  },
  {
    id: 12,
    slug: "documentatie-necesara-fonduri-europene-pnrr",
    category: "legislation",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=400&fit=crop",
    title: {
      ro: "Documentația necesară pentru fonduri europene și PNRR agricol 2026",
      en: "Required documentation for European funds and agricultural PNRR 2026",
    },
    excerpt: {
      ro: "Ghid complet documentație fonduri UE: PNRR, PNDR, Leader, modernizare echipamente, irigații. Evită respingerea dosarului pentru documentație incompletă.",
      en: "Complete EU funds documentation guide: PNRR, NRDP, Leader, equipment modernization, irrigation. Avoid application rejection for incomplete documentation.",
    },
    author: "Consultant Eurofonduri Ing. Andrei Matei",
    date: "2026-03-09",
    readTime: "11 min",
    tags: ["PNRR", "Fonduri UE", "Investiții", "Documentație"],
    content: {
      ro: [
        "Măsura PNRR C4.I1 'Modernizare echipamente agricole inteligente' este principala oportunitate 2026 pentru fermierii medii și mari. Valoare grant: 50-70% (funcție dimensiune fermă și regiune), maxim 800.000 EUR/beneficiar. Eligibile: tractoare/combine cu tehnologie precision farming ISOBUS, sisteme GPS RTK guidance auto-steering, senzori multi-parametru sol și cultură, drone agricole profesionale (capacitate minimum 10L, autonomie 20 min), software management integrat fermă (AgriOne Pro eligible automat). Documente obligatorii dosarCritical pentru succesul aplicării este pregătirea corectă a documentelor. Set complet dosare fonduri UE agricole 2026 include: Cererea de finanțare (Formular standardizat AFIR/MADR specific fiecare măsură - descarcă versiunea ACTUALIZATĂ din 2026, nu folosi template-uri vechi 2024-2025 = respingere automată), Plan de afaceri detaliat (pentru investiții >100.000 EUR, horizont 5 ani, tablouri financiare: fluxuri numerar, bilanț previzionat, cont profit/pierdere, analiză sensibilitate minimum 3 scenarii), Studiu de fezabilitate tehnico-economic (pentru investiții >250.000 EUR, întocmit de specialist autorizat MDRAP, structură: analiza existentă, justificare necesitate, variante tehnice, evaluare impact, sustenabilitate), Memoriu justificativ investiție (max 15 pagini, descrie: situația actuală fermă, problema identificată, soluția propusă, rezultate așteptate cuantificate, concordanță cu strategia fermei).",
        "Documentație societate și fermă: Certificat constatator firma emis ONRC max 30 zile (pentru SRL/SA) sau Certificat producător agricol individual emis Primărie + Camera Agriculturii (pentru PFA/II). Act constitutiv și statut actualizat societate (ultima versiune după toate modificările de-a lungul timpului, nu cel inițial din 2010!). CUI fiscal și certificat ANAF istoric datorii (max 60 zile vechime, FĂRĂ datorii - condiție eliminatorie). Certificat ANAF istoric plata impozite locale (primărie) FĂRĂ datorii (max 60 zile). Bilanț contabil ultimii 3 ani (2023, 2024, 2025) + balanță de verificare an curent, vizat contabil atestat. Declarații fiscale (D200/D212/D220 funcție tip firmă) ultimii 3 ani. Cazier fiscal firmă și reprezentant legal (certificat ANAF, max 90 zile). Document proprietate sau drept folosință teren agricultural minimum 10 ani garanție (extras CF ANCPI + contracte arendă notariale pe termen lung minim până 2036).",
        "Proiecte tehnice și autorizații: Dacă investiție include construcții/modernizări clădiri (depozite, silozuri, ferme animale): Autorizație construire/desființare emisă Primărie sau Aviz Urbanism dacă nu e necesară AC. Proiect tehnic detaliat întocmit de proiectant autorizat (arhitect/inginer constructor), vizat MLPDA + Inspectorat construcții județean. Aviz Protecția Mediu (dacă capacitate producție depășește praguri HG 445/2009: >50 vaci, >10 ha seră, >5.000 păsări etc). Aviz Sanitar-Veterinar DSVSA județean (pentru ferme animale sau unități procesare produse animale). Dacă investiție irigații: Aviz Administrația Bazinală Apă (ABA) pentru captare/utilizare apă (studiu hidrologic + autorizare debit). Proiect hidrotehnic detaliat cu calcul necesitate apă, dimensionare sistem, eficiență utilizare. Documente pentru utilaje agricole: Oferte detaliate furnizori (minimum 3 oferte comparative pentru fiecare categorie echipament >50.000 EUR, conform HG 1/2016 achiziții publice). Specificații tehnice complete utilaj: putere, capacitate, caracteristici tehnice ISOBUS/GPS/precizie comply cu cerințele măsurii. Declarație producător utilaj confirmare conformitate legislație UE (CE marking). Contract service/mentenanță post-garanție (dovadă sustenabilitate investiție).",
        "Plan afaceri și analize financiare - cel mai important document. Structură obligatorie plan afaceri fonduri UE: 1. Rezumat executiv (2 pagini max): situație actuală, investiție propusă, rezultate așteptate. 2. Prezentare fermă și management (3-5 pagini): istoric, structură management, capabilități, experiență similar. 3. Analiza pieței (5-7 pagini): piață de desfacere produse, competiție, tendințe, strategie marketing. 4. Plan producție (4-6 pagini): capacitate actuală vs proiectată, culturi/animale, agrotehnică, input-uri, productivitate. 5. Plan investiție (3-5 pagini): descriere tehnică investiție, justificare opțiuni, cronograma implementare, furnizori. 6. Analiză financiară (10-15 pagini): costul total investiție, surse finanțare (grant + contribuție proprie), proiecții venituri-cheltuieli 5 ani, indicatori financiari (VAN, TIR, rata acoperire datorii RaD, perioada recuperare), analiză sensibilitate optimist/realist/pesimist, analiză risc și măsuri mitigare. 7. Sustenabilitate și impact (2-3 pagini): locuri muncă create/menține, impact mediu (reducere emisii, economie apă), contribuție dezvoltare rurală. Indicatori critici monitorizați evaluatori: VAN (Valoare Actualizată Netă) trebuie pozitivă minimum 10% din investiția totală. TIR (Rata Internă Rentabilitate) minimum 8-12% pentru agricultură (depinde măsură). Rata acoperire serviciu datorie >1.3 (venituri/costuri+rambursări împrumut). Contribuție proprie demonstrată: MINIMUM 30-50% din total (funcție măsură), dovezi: extras cont bancar cu sold disponibil sau angajament de creditare bancară sau vânzare active (teren, imobile).",
        "Dovezi capacitate financiară și co-finanțare: Pentru grant >100.000 EUR ai nevoie dovezi SOLIDE că poți acoperi contribuția proprie (partea nefinanțată de UE): Extras cont bancar firmă/persoană fizică cu sold suficient =scris RECENT, max 15 zile vechime (exemplu: investiție 500.000 EUR, grant 60% = nevoie 200.000 EUR contribuție → sold cont minimum 200k EUR). Angajament finanțare bancă (scrisoare bancă confirmând disponibilitate credit investiție sau linie credit pentru suma necesară, NU e credit aprobat formal încă dar e pre-angajament). Garanții credit: gaj imobile (extrase CF proprietăți oferite garanție), ipotecă terenuri agricole (evaluare teren la valoare piață × suprafață), garanții FNGCIMM (Fondul Național Garantare) dacă nu ai alte garanții - solicită ÎNAINTE la FNGCIMM scrisoare eligibilitate. Dovezi vânzare active (promisiuni vânzare-cumpărare notarial teren/imobile care generează cash infuzie pentru contribuție proprie). Investitori privați (dacă aplicabil): contracte de investiție/ asociere, dovezi transfer fonduri. IMPORTANT: Contribuția proprie trebuie LIECHIDĂ înainte de semnare contract finanțare - evaluatorii vor verifica REAL că exisistă banii, nu doar 'în principiu'.",
        "Procedura de depunere și evaluare. Calendarul 2026 fonduri principale: PNRR echipamente inteligente: apel depunere 1 februarie - 30 aprilie 2026, evaluare mai-iulie, contractare august-octombrie 2026, implementare până decembrie 2027. PNDR submăsura irigații: apel continuu (fără deadline), ordine cronologică depunere până epuizare buget 85 mil EUR, evaluare rolling 60 zile. Leader dezvoltare afaceri micii: apeluri GAL locale, fiecare GAL propriul calendar (verifică pe site GAL județean tău), buget variabil 50.000-500.000 EUR/GAL. Etape evaluare conformitate: 1) Verificare administrativă (10 zile): completitudine documente, semnături, anexe. Dacă e OK → pas 2. Dacă probleme → notificare clarificări, termen 5 zile răspuns sau dosar respins. 2) Verificare eligibilitate (15 zile): verifică condiții eligibilitate măsură (suprafață minimă, vârstă, tipuri investiție allowed). 3) Verificare tehnică și financiară (20 zile): experți tecnici evaluează proiect tehnic/plan afaceri, calcul scor, verifică realismul proiecțiilor. 4) Comisie de selecție (5 zile): aproba/respinge sau solicită completări. 5) Contractare (30 zile după aprobare): semnare contract finantare cu AFIR/MADR, activare cont dedicat proiect. Total proces depunere → contract: 60-90 zile dacă dosarul e complet și corect din prima.",
        "Greșelile frecvente care duc la respingere dosare: Formulare vechi (template-uri 2024-2025 în loc de versiunea actualize 2026 = incompatibilitate câmpuri, respins automat), Lipsă sau documentare învechite (certificate ANAF mai vechi 60 zile, cazier fiscal mai vechi 90 zile = respingere eligibilitate), Plan afaceri nerealiste (proiecții venituri prea optimiste fără justificare, VAN/TIR calculat greșit, lipsă analiză sensibilitate = respingere la evaluare tehnică), Contribuție proprie nedovedită (declarație 'disponibilitate fonduri' fără extrase bancare efective = respingere), Oferte furnizori insuficiente (doar 1-2 oferte în loc de minimum 3 comparative = încălcare proceduri, respingere), Lipsa avizelor necesare (Mediu, ABA, DSVSA dacă aplicabile = dosar incomplet, respins fără evaluare), Investiții neeligibile incluse (ex: vehicule personale, construcții locuință = chiar dacă doar 5% din total, respinge ÎNTREG dosarul), Documentenie legate logistic (plan investiție menționează 'depozit cereale 500 tone' dar proiectul tehnic e pentru doar 200 tone = inconsistență = red flag, probabil respingere).",
        "Asistență profesională și platforme digitale. Tipuri consultanță fonduri UE: Consultant independent specialist fonduri (taxă 3-7% din grant obținut, plătește doar dacă câștigi proiect - success fee), Firmă consultanță Eurofonduri (taxă fixă 5.000-15.000 EUR/proiect + 2-5% din grant, plătește în avans), Camerele Agriculturii județene (consultanță gratuită sau simbolic 500-1.000 EUR, dar capacitate limitată, mari+iștepță 2-4 luni), Platforme digitale (AgriOne module EUfunds 79 EUR/lună: templates actualizate automat, verificare preliminară documente, alerts termene, management dosare proiecte). Beneficii consultanță profesională: Rata succes 75-85% (vs 40-50% dosare depuse fără consultanță), Economie timp masivă (consultant pregătește 80% documentația, tu doar furnizezi info), Risk minim erori formale (consultantul cunosc 'toate șmenurile' evaluatorilor), Maximizare sumă grant (optimizare cheltuieli eligibile, cost-beneficiu echipamente). Cost consultanță e eligibil în cheltuielile proiectului până la 5% din valoarea grant (deci efectiv UE plătește parțial consultantul!) - include în bugetul aplicației.",
        "Studiu de caz real: Fermă 250 ha Teleorman, PNRR echipamente. Aplicant: SRL agricolă 250 ha cereale+leguminoase, 2 asociați, cifră afaceri 650.000 EUR/an, profit net +85.000 EUR 2025. Investiție propusă: combină Case IH 9250 Axial Flow cu precision farming (450.000 EUR), tractor John Deere 8R 410 cu AutoTrac GPS RTK (280.000 EUR), sistem ISOBUS Task Controller cu senzori yield mapping (45.000 EUR), dronă agricolă DJI Agras T50 (38.000 EUR), platformă digital AgriOne Enterprise (12.000 EUR). Total investiție: 825.000 EUR. Grant PNRR 60%: 495.000 EUR. Contribuție proprie 40%: 330.000 EUR (200k sold firmă + 130k credit bancar BCR cu garanție teren 120 ha). Documentație pregătită: 3 luni cu consultanță specialist fonduri (taxă 8.000 EUR fix + 3% success fee). Depus: 15 martie 2026. Evaluat și aprobat: 28 mai 2026. Contractat: 25 iunie 2026. Implementare (achiziție utilaje): iulie-decembrie 2026. Plată avans 30%: august 2026 (148.500 EUR). Plată intermediară 40%: noiembrie 2026 (198.000 EUR). Plată finală 30%: februarie 2027 (148.500 EUR) după control AFIR recepție finală. Rezultat: Fermă complet modernizată, creștere 35% productivitate 2027, economie combustibil 28%, reducere pierderi recoltă la 2% (vs 7-9% înainte), ROI investiție totală recuperat în 4.2 ani (inclusiv partea co-finanțată).",
      ],
      en: [
        "PNRR measure C4.I1 'Smart agricultural equipment modernization' is the main 2026 opportunity for medium and large farmers. Grant value: 50-70% (function of farm size and region), maximum 800,000 EUR/beneficiary. Eligible: tractors/combines with ISOBUS precision farming technology, GPS RTK auto-steering guidance systems, multi-parameter soil and crop sensors, professional agricultural drones (minimum 10L capacity, 20 min autonomy), integrated farm management software (AgriOne Pro automatically eligible). Mandatory file documents: Critical for successful application is correct document preparation. Complete EU agricultural funds 2026 file set includes: Funding application (AFIR/MADR standardized form specific to each measure - download UPDATED 2026 version, don't use old 2024-2025 templates = automatic rejection), Detailed business plan (for investments >100,000 EUR, 5-year horizon, financial tables: cash flows, projected balance sheet, profit/loss account, sensitivity analysis minimum 3 scenarios), Technical-economic feasibility study (for investments >250,000 EUR, prepared by MDRAP authorized specialist, structure: existing analysis, necessity justification, technical variants, impact evaluation, sustainability), Investment justification memorandum (max 15 pages, describes: current farm situation, identified problem, proposed solution, quantified expected results, alignment with farm strategy).",
        "Company and farm documentation: Company certificate issued ONRC max 30 days (for LLC/JSC) or Individual agricultural producer certificate issued City Hall + Agriculture Chamber (for PFA/II). Updated company articles of association and statute (latest version after all changes over time, not the initial one from 2010!). Fiscal CUI and ANAF debt history certificate (max 60 days old, WITHOUT debts - elimination condition). ANAF certificate local tax payment history (city hall) WITHOUT debts (max 60 days). Accounting balance sheet last 3 years (2023, 2024, 2025) + current year trial balance, certified accountant visa. Tax declarations (D200/D212/D220 function of company type) last 3 years. Fiscal record company and legal representative (ANAF certificate, max 90 days). Agricultural land ownership or use right document minimum 10 years guarantee (ANCPI land registry extract + long-term notarized lease contracts minimum until 2036).",
        "Technical projects and authorizations: If investment includes buildings construction/modernizations (warehouses, silos, animal farms): Construction/demolition authorization issued City Hall or Urbanism opinion if AC not necessary. Detailed technical project prepared by authorized designer (architect/construction engineer), MLPDA + county construction inspection visaed. Environmental Protection opinion (if production capacity exceeds GD 445/2009 thresholds: >50 cows, >10 ha greenhouse, >5,000 birds etc). Veterinary-Sanitary DSVSA county opinion (for animal farms or animal product processing units). If irrigation investment: Basin Water Administration (ABA) opinion for water capture/use (hydrological study + flow authorization). Detailed hydrotechnic project with water need calculation, system dimensioning, use efficiency. Documents for agricultural equipment: Detailed supplier offers (minimum 3 comparative offers for each equipment category >50,000 EUR, according to GD 1/2016 public procurement). Complete equipment technical specifications: power, capacity, ISOBUS/GPS/precision technical characteristics comply with measure requirements. Equipment manufacturer declaration confirming EU legislation compliance (CE marking). Post-warranty service/maintenance contract (investment sustainability proof).",
        "Business plan and financial analyses - most important document. Mandatory EU funds business plan structure: 1. Executive summary (2 pages max): current situation, proposed investment, expected results. 2. Farm and management presentation (3-5 pages): history, management structure, capabilities, similar experience. 3. Market analysis (5-7 pages): product sales market, competition, trends, marketing strategy. 4. Production plan (4-6 pages): current vs. projected capacity, crops/animals, agrotechnics, inputs, productivity. 5. Investment plan (3-5 pages): investment technical description, options justification, implementation schedule, suppliers. 6. Financial analysis (10-15 pages): total investment cost, financing sources (grant + own contribution), 5-year revenue-expenses projections, financial indicators (NPV, IRR, debt coverage ratio RaD, recovery period), optimistic/realistic/pessimistic sensitivity analysis, risk analysis and mitigation measures. 7. Sustainability and impact (2-3 pages): jobs created/maintained, environmental impact (emissions reduction, water savings), rural development contribution. Critical indicators monitored by evaluators: NPV (Net Present Value) must be positive minimum 10% of total investment. IRR (Internal Rate of Return) minimum 8-12% for agriculture (depends on measure). Debt service coverage ratio >1.3 (revenues/costs+loan repayments). Demonstrated own contribution: MINIMUM 30-50% of total (function of measure), evidence: bank account statement with available balance or bank credit commitment or asset sale (land, real estate).",
        "Financial capacity and co-financing proofs: For grant >100,000 EUR you need SOLID evidence that you can cover own contribution (EU non-financed part): Bank account statement company/individual with sufficient balance RECENT, max 15 days old (example: 500,000 EUR investment, 60% grant = need 200,000 EUR contribution → account balance minimum 200k EUR). Bank financing commitment (bank letter confirming investment credit availability or credit line for necessary amount, NOT formally approved credit yet but pre-commitment). Credit guarantees: real estate mortgage (property CF extracts offered as guarantee), agricultural land mortgage (land market value assessment × area), FNGCIMM guarantees (National Guarantee Fund) if you don't have other guarantees - request BEFORE at FNGCIMM eligibility letter. Asset sale evidence (notarized sale-purchase promises land/real estate generating cash infusion for own contribution). Private investors (if applicable): investment/partnership contracts, funds transfer evidence. IMPORTANT: Own contribution must be LIQUID before financing contract signing - evaluators will check REAL that money exists, not just 'in principle'.",
        "Submission and evaluation procedure. 2026 main funds calendar: PNRR smart equipment: submission call February 1 - April 30, 2026, evaluation May-July, contracting August-October 2026, implementation until December 2027. NRDP irrigation submeasure: continuous call (no deadline), chronological submission order until budget exhaustion 85 mil EUR, rolling 60-day evaluation. Leader small business development: local GAL calls, each GAL own calendar (check your county GAL website), variable budget 50,000-500,000 EUR/GAL. Compliance evaluation stages: 1) Administrative verification (10 days): documents completeness, signatures, annexes. If OK → step 2. If issues → clarifications notification, 5-day response deadline or file rejected. 2) Eligibility verification (15 days): checks measure eligibility conditions (minimum area, age, allowed investment types). 3) Technical and financial verification (20 days): technical experts evaluate technical project/business plan, score calculation, projections realism verification. 4) Selection committee (5 days): approves/rejects or requests completions. 5) Contracting (30 days after approval): financing contract signing with AFIR/MADR, dedicated project account activation. Total submission → contract process: 60-90 days if file is complete and correct from first time.",
        "Common mistakes leading to file rejection: Old forms (2024-2025 templates instead of updated 2026 version = field incompatibility, automatically rejected), Missing or outdated documentation (ANAF certificates older than 60 days, fiscal record older than 90 days = eligibility rejection), Unrealistic business plans (too optimistic revenue projections without justification, incorrectly calculated NPV/IRR, missing sensitivity analysis = technical evaluation rejection), Unproven own contribution ('funds availability' declaration without actual bank statements = rejection), Insufficient supplier offers (only 1-2 offers instead of minimum 3 comparative = procedures violation, rejection), Missing necessary opinions (Environment, ABA, DSVSA if applicable = incomplete file, rejected without evaluation), Ineligible investments included (eg: personal vehicles, housing construction = even if only 5% of total, rejects ENTIRE file), Logically unconnected documents (investment plan mentions'500 ton grain warehouse' but technical project is for only 200 tons = inconsistency = red flag, probably rejection).",
        "Professional assistance and digital platforms. EU funds consultancy types: Independent specialist funds consultant (3-7% fee from obtained grant, pays only if you win project - success fee), Eurofunds consultancy firm (fixed fee 5,000-15,000 EUR/project + 2-5% from grant, pays in advance), County Agriculture Chambers (free or symbolic consultancy 500-1,000 EUR, but limited capacity, expect 2-4 months), Digital platforms (AgriOne EUfunds module 79 EUR/month: automatically updated templates, preliminary document verification, deadline alerts, project file management). Professional consultancy benefits: Success rate 75-85% (vs 40-50% files submitted without consultancy), Massive time savings (consultant prepares 80% documentation, you only provide info), Minimum formal errors risk (consultant knows all evaluators' 'tricks'), Grant amount maximization (eligible expenses optimization, equipment cost-benefit). Consultancy cost is eligible in project expenses up to 5% of grant value (so effectively EU partially pays consultant!) - include in application budget.",
        "Real case study: 250 ha Teleorman farm, PNRR equipment. Applicant: agricultural LLC 250 ha cereals+legumes, 2 partners, turnover 650,000 EUR/year, net profit +85,000 EUR 2025. Proposed investment: Case IH 9250 Axial Flow combine with precision farming (450,000 EUR), John Deere 8R 410 tractor with AutoTrac GPS RTK (280,000 EUR), ISOBUS Task Controller system with yield mapping sensors (45,000 EUR), DJI Agras T50 agricultural drone (38,000 EUR), AgriOne Enterprise digital platform (12,000 EUR). Total investment: 825,000 EUR. PNRR grant 60%: 495,000 EUR. Own contribution 40%: 330,000 EUR (200k company balance + 130k BCR bank credit with 120 ha land guarantee). Documentation prepared: 3 months with specialist funds consultancy (8,000 EUR fixed fee + 3% success fee). Submitted: March 15, 2026. Evaluated and approved: May 28, 2026. Contracted: June 25, 2026. Implementation (equipment procurement): July-December 2026. 30% advance payment: August 2026 (148,500 EUR). 40% intermediate payment: November 2026 (198,000 EUR). 30% final payment: February 2027 (148,500 EUR) after AFIR final reception control. Result: Fully modernized farm, 35% productivity increase 2027, 28% fuel savings, harvest loss reduction to 2% (vs 7-9% before), total investment ROI recovered in 4.2 years (including co-financed part).",
      ],
    },
  },
  {
    id: 13,
    slug: "controale-apia-pregatire-ferma-2026",
    category: "legislation",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    title: {
      ro: "Controale APIA 2026: Cum să-ți pregăfești ferma pentru inspecții",
      en: "APIA 2026 controls: How to prepare your farm for inspections",
    },
    excerpt: {
      ro: "Ghid complet pentru controalele APIA: ce verifică inspectorii, documente cerute la fața locului, greșeli care costă scumpăr. Pregătește-te corect.",
      en: "Complete guide for APIA controls: what inspectors check, documents requested on-site, costly errors. Prepare correctly.",
    },
    author: "Inspector APIA Ret. Ioan Petrescu",
    date: "2026-03-07",
    readTime: "10 min",
    tags: ["APIA", "Controale", "Inspecții", "Conformitate"],
    content: {
      ro: [
        "Controlul administrativ preliminar (desktop review) se efectuează pentru 100% cereri depuse între martie-mai 2026. APIA verifică automat prin sistem: suprapuneri parcele cu alți fermieri în baza LPIS (cross-check automat GPS), dimensiuni parcele declarate vs măsurători satelit (toleranță acceptabilă ±3%), istoric culturi parcele ultimii 3 ani vs declarațiile curente (identificare pattern inconsistente), eligibilitate eco-schemă pe bază culturi declarate și documente atașate, verificare IBAN beneficiar în baza centralizată BCE, validare certificate ANAF și alte documente oficiale prin interogare API-uri guvernamentale autenticate. Dacă totul e green, cererea trece la etapa următoare fără interacțiune umană. Dacă sunt red flags, dosarul e marcat pentru verificări suplimentare (control la fața locului sau solicitare clarificări).",
        "Controalul la fața locului (on-site inspection) se efectuează pentru ~15% fermieri selectați aleatoriu sau targeted pe bază risc ridicat. Selecție aleatorie: sistem generează random sample 10-12% fermieri din totalul declaranți per județ, distributed toate categoriile dimensiuni ferme (evită bias către mari/mici). Selecție bazată pe risc: ferme cu istoric probleme ani anteriori (neconcordanțe, suspiciuni fraudă), ferme cu discrepanțe mari în verificarea satelit 2026, cereri cu valoare grant foarte ridicată (>300.000 EUR subvenții/fermă), ferme noi declarante fără istoric APIA (verificare primă cerere intensivă). Notificare control: primești SMS + email cu 48-72h înainte de vizită inspector (APIA nu mai face controale neanunțate sudden surprise din 2024, excepție doar dacă suspiciune fraudă gravă). Mesajul include: data și ora estimativă vizită, inspector responsabil (nume, telefon contact), lista documente necesare prepare, adresă parcele care vor fi inspectate.",
        "Ce verifică fizic inspectorul APIA pe teren: Límite parcele îndiguitate cu declarațiile LPIS (inspector folosește GPS RTK precizie <3 cm, măsoară perimetru și suprafață, compară cu declarația ta - dacă diferența >5% = reducere automată suprafață eligibilă la cea măsurată). Cultura efectiv prezentă pe parcelă (inspector identifică vizual cultură, stadiu vegetație, densitate, compară cu declarația - dacă ai declarat 'grâu' și e 'orz' sau 'sol gol' = problema gravă, pierdere plată parcelă + posibilă penalizare fraud). Respectare condiționalitate eco-schemă (Eco1: verificare existență echipament ISOBUS în tractor/combină + insecție vizuală aplicare uniformă tratamente vs registru declarat. Eco2: numărare culturi pe ansamblul fermei, măsurare procent setaside/EFA. Eco3: verificare prezență leguminoasă pe teren + rotație documentată ultimii ani). Zone eligibile vs neeligibilis (identificare cale acces, construcții, roci, zone mlăștinoase care nu sunt arabile - redusce suprafață eligibilă). Starea generală fermă și active (inspector notează nivel management, întreținere parcele, funcționare echipamente - e un soft indicator dacă fermierul chiar lucrează activ terenul sau e 'de hârtie').",
        "Documentele pe care trebuie să le prezinți inspectorului: Registrul agricol actualizat la zi (all culturi/animale/suprafețe/lucrări, vizat de primărie, e document oficial obligatoriu), Registrul tratamente fitosanitar electronic/hârtie (toate tratamentele efectuate cu data, cultură, parcelă, produs folosit, doză, operator care a aplicat), Facturi achiziție inputuri agricole (semințe cu etichetă certificare, îngrășăminte cu specificații NPK, pesticide cu avize vânzare), Contracte vânzare producție (către procesatori, comercianți autorizați, export - dovada că producția e reală și comercializată), Pentru eco-schemă Eco1: certificat echipament ISOBUS (factură achiziție tractorcombină cu specificații tehnice), Pentru coupled payments zootehnie: registre efectiv animale, certificate sanitar-veterinare la zi, contracte livrare lapte/carne, Pentru tineri fermieri: diplomă/certificat studii agricole, certificat șef exploatație Camera Agriculturii. IMPORTANT: toate documentele trebuie în ORIGINAL sau copii certificate conformă - inspector nu acceptă copii simple fără validare.",
        "Greșelile care costă scump la control APIA: Suprafață declarată semnificativ mai mare decât realitate măsurată GPS (diferență >10% = plătești înapoi toată suprafața greșit declarată + penalitate 20-50% din suma respectivă + risc excludere scheme următorii ani). Cultură declarată diferită de realitate (declarat porumb, găsit gol sol sau altă cultură = pierdere totală plată parcelă + posibil fraud investigation comprehensive toate cererile anterioare). Nerespectare eco-schemă declarată (declarat Eco1 pesticide dar folosești aceleași cantități ca anii anterai sau chiar mai mult = pierdere plată eco-schemă 90 EUR/ha + posibil returnare avans deja încassat). Documente lipsă sau false (factură inputuri neautentice, registru tratamente completat ad-hoc în momentul controlului = inspectorii pot detecta - pierdere plată, posibil fraudă penală dacă intentie). Nerespectare cross-compliance (boli animale nedeclarate, poluare sol, nerespectare norme siguranță alimentară = reducere 1-5% TOATE plățile PAC, nu doar parcelã problem, plus amenzi specifice legislație sectorialã). Fermier absent sau inaccesibil la vizită planificată (inspector notează 'imposibil verificare', cerere suspendată până la control rescheduled, dacă și a 2-a oară absent = respingere cerere integral).",
        "Cum te pregătești optim pentru control APIA: Cu 2-3 săptămâni înainte (pregătire preventivă): Verifică toate limitele parcele pe harta eApia vs realitate teren (walk the fields cu GPS), corectează orice discrepanță minim în sistem dacă încă e permis modificări. Asigură-te că toate culturile declarate sunt efectiv prezente și identificabile vizual (dacă ai declarat orz dar abia răsare, pune stâlpi marcaj cu etichete specie pentru inspector). Organizează toate documentele într-un dosar dedicat control APIA (originals + copies), sortate logic pe categorii (inputuri, tratamente, vânzări, eco, coupled). Verifică echipamentele eco-schemă sunt funcționale și vizibile (daca ai declarat ISOBUS, asigură tractorul e pe fermă și console funcționează pentru demonstrație). Când primești notificare (48h înainte): Confirmă telefonic cu inspectorul ora exactă și punct întâlnire (flexibilitate de ambele părți pentru programare optimă). Pregătește acces la toate parcelele (deschide porți, asigură drum accesibil cu mașina inspectorului). Anunță eventul lucrători/arendre care lucrează parcelele să fie disponibili pentru întrebări. În ziua controlului: Fi punctual la întâlnire (până la urmă inspectorul e om, profesionalism + respect = relație mai bună, posibil beneficiu of doubt la marginal cases). Prezintă documentele organizat și răspunde clar întrebărilor (don't be defensive, nu inventa pe loc explicații - dacă nu știi ceva, recunoaște și promite clarificare ulterior). Însoțește inspectorul pe teren dacă solicită (poți oferi clarificări în timp real, demonstrează transparență). Semnează procesul verbal recepție la final și primește copie (ai 10 zile după semnare contest).",
        "Procesul verbal de control și ce urmează după: Inspector completează PV control cu: suprafețe măsurate efectiv vs declarate (cu diferențe), culturi identificate vs declarate (cu discrepanțe), conformitate eco-schemă/coupled (OK sau NOK cu detalii), documente verificate (prezente/lipește), observații generale și recomandări, concluzii preliminare (fără probleme / probleme minore / probleme majore). Tu primești copie PV pe loc și ai drept răspuns/clarificări în następny 10 zile lucrătoare dacă contești constatările. APIA analizează PV inspector + eventualeле răspunsuri și emite: Decizie de plată ajustată (dacă sunt diferențe suprafață mici 3-5%, se plãtește suprafața măsurată fără penalizări), Decizie de reducere plată (dacă probleme medii, se reduce proportional plata affected schemes), Decizie respingere parțială/totală (dacă probleme grave = pierdere plată parțiale/totale parcele), Notificare fraud suspected (dacă inspectorul consideră fraud intentionat = transfer dosar Parchetului pentru investigație penală). Timeline plată după control OK: Control finalizat iunie-iulie → Decizie plată august → Plată efectivă octombrie-decembrie (deci controlul întârzie plata cu ~2-3 luni față de fermierii fără control).",
        "Contestații și remedii dacă nu ești de acord cu constatările: Ai drept să contestați: Diferențe măsurare suprafață (dacă consideră GPS inspector inexact, poți comanda măsurătoare independentă geodez autorizat pe cheltuiala ta, dacă demonstrezi eroare APIA = APIA plătește costul măsurători + compensatie), Identificare cultură incorectă (dacă inspector confunză vizual specie - trebuie dovezi clare foto, expert agro third party), Nerespectare proceduri control (dacă inspector nu a notificat corect sau a venit fără preaviz la ore neprogramate = pot invalidează întreg controlul), Aplicare greșită legislație în calcularea penalităților (cerere reexaminare juridică caz la departament legal APIA central). Proces contestație: Depui contestație scrisă la APIA județean în 30 zile de la primirea deciziei (formular standard disponibil eApia, atașezi toate dovezile), Comisie de soluționare contestații județean analizează în 45 zile și pronunță decizie (menține / modifică / anulează decizia inițială), Dacă nu ești mulțumit, poți continua contestație la nivel central MADR în 15 zile, apoi instanță de judecată contencios administrativ (proces lung 1-2 ani). Statistică: ~18% contestații fermieri sunt admise parțial/total (APIA recunoaște eroare sau aplică interpretare mai favorabilă), ~35% sunt respinse dar cu clarificări utile, ~47% rămân neschimb decision = importante e să contestați dacă chiar ai dreptate, nu frivolous.",
        "Instrumente digitale AgriOne pentru pregătire control: Modul 'Control Readiness' (disponibil AgriOne Pro, 25 EUR/lună add-on): Comparare automată parcele declarate vs imagini satelit Sentinel-2 recente (identificare early discrepanțe înainte control real), Alert culturi neconcordante (AI detectează dacă cultură pe satelit nu match declarația, ex: NDVI pattern grâu vs porumb), Checklist interactive pregătire control (pas cu pas ce documente prepare, ce verifică pe teren, tips comportament optimcomunication inspector), Simulare măsurători GPS (încarcă track GPS walk field, compare cu LPIS, calculate potential diferențe suprafață), Istoric controale și pattern issues (învață din controale anterioare ce aspecte focus). Farmers AgriOne cu modul active reportseek: 43% mai puține probleme identificate în controale vs media (datorită alertelor preventive), 89% compliance rate eco-schemes vs 72% media (verificări automate înainte depunere cerere), economie medie 2.300 EUR/fermă/an evitând penalități și reduceri (ROI modul 25 EUR/lună = 92x annual).",
      ],
      en: [
        "Preliminary administrative control (desktop review) is performed for 100% applications submitted between March-May 2026. APIA automatically checks through system: plot overlaps with other farmers in LPIS database (automatic GPS cross-check), declared plot dimensions vs. satellite measurements (acceptable tolerance ±3%), historical plot crops last 3 years vs. current declarations (inconsistent pattern identification), eco-scheme eligibility based on declared crops and attached documents, beneficiary IBAN verification in centralized ECB database, validation of ANAF certificates and other official documents through authenticated government API queries. If everything is green, application proceeds to next stage without human interaction. If there are red flags, file is marked for additional checks (on-site control or clarification request).",
        "On-site inspection is performed for ~15% farmers selected randomly or targeted based on high risk. Random selection: system generates random sample 10-12% farmers from total county declarants, distributed across all farm size categories (avoids bias towards large/small). Risk-based selection: farms with problem history previous years (inconsistencies, fraud suspicions), farms with major satellite verification discrepancies 2026, applications with very high grant value (>300,000 EUR subsidies/farm), new declaring farms without APIA history (intensive first application verification). Control notification: receive SMS + email 48-72h before inspector visit (APIA no longer does unannounced sudden surprise controls since 2024, exception only if serious fraud suspicion). Message includes: estimated visit date and time, responsible inspector (name, contact phone), list of necessary documents to prepare, address of plots to be inspected.",
        "What APIA inspector physically checks on field: Plot boundaries compared with LPIS declarations (inspector uses RTK GPS precision <3 cm, measures perimeter and area, compares with your declaration - if difference >5% = automatic reduction to measured eligible area). Culturally actually present on plot (inspector visually identifies crop, vegetation stage, density, compares with declaration - if you declared 'wheat' and it's 'barley' or 'bare soil' = serious problem, plot payment loss + possible fraud penalty). Eco-scheme conditionality compliance (Eco1: verification of ISOBUS equipment existence in tractor/combine + visual inspection of uniform treatment application vs. declared register. Eco2: count crops on entire farm, measure setaside/EFA percentage. Eco3: verify legume presence on field + documented rotation last years). Eligible vs. ineligible zones (identify access path, buildings, rocks, marshy areas that aren't arable - reduces eligible area). General farm and asset condition (inspector notes management level, plot maintenance, equipment operation - it's a soft indicator if farmer actually actively works land or is 'on paper').",
        "Documents you must present to inspector: Updated agricultural register (all crops/animals/areas/works, city hall visaed, it's mandatory official document), Electronic/paper phytosanitary treatment register (all treatments performed with date, crop, plot, product used, dose, operator who applied), Agricultural input purchase invoices (seeds with certification label, fertilizers with NPK specifications, pesticides with sales permits), Production sale contracts (to processors, authorized traders, export - proof production is real and commercialized), For Eco1 eco-scheme: ISOBUS equipment certificate (tractor/combine purchase invoice with technical specifications), For livestock coupled payments: animal herd registers, up-to-date veterinary certificates, milk/meat delivery contracts, For young farmers: agricultural studies diploma/certificate, farm manager certificate Agriculture Chamber. IMPORTANT: all documents must be ORIGINAL or certified copies - inspector doesn't accept simple copies without validation.",
        "Errors that cost dearly at APIA control: Declared area significantly larger than GPS measured reality (difference >10% = pay back all incorrectly declared area + 20-50% penalty from respective amount + risk of next years' scheme exclusion). Different declared crop from reality (declared corn, found bare soil or other crop = total plot payment loss + possible comprehensive fraud investigation all previous applications). Declared eco-scheme non-compliance (declared Eco1 pesticides but use same quantities as previous years or even more = eco-scheme payment loss 90 EUR/ha + possible advance refund already received). Missing or false documents (inauthentic input invoices, treatment register filled ad-hoc during control = inspectors can detect - payment loss, possible criminal fraud if intentional). Cross-compliance non-compliance (undeclared animal diseases, soil pollution, food safety standards non-compliance = 1-5% reduction ALL CAP payments, not just problem plot, plus specific sectoral legislation fines). Absent or inaccessible farmer at planned visit (inspector notes 'impossible verification', application suspended until rescheduled control, if absent 2nd time too = full application rejection).",
        "How to optimally prepare for APIA control: 2-3 weeks before (preventive preparation): Check all plot boundaries on eApia map vs. field reality (walk fields with GPS), correct any minor discrepancy in system if modifications still allowed. Ensure all declared crops are actually present and visually identifiable (if you declared barley but barely sprouted, put marking poles with species labels for inspector). Organize all documents in dedicated APIA control folder (originals + copies), logically sorted by categories (inputs, treatments, sales, eco, coupled). Verify eco-scheme equipment is functional and visible (if you declared ISOBUS, ensure tractor is on farm and consoles work for demonstration). When you receive notification (48h before): Confirm by phone with inspector exact time and meeting point (flexibility from both sides for optimal scheduling). Prepare access to all plots (open gates, ensure road accessible with inspector's car). Notify workers/tenants working plots to be available for questions. On control day: Be punctual at meeting (after all inspector is human, professionalism + respect = better relationship, possible benefit of doubt in marginal cases). Present documents organized and answer questions clearly (don't be defensive, don't make up explanations - if you don't know something, acknowledge and promise later clarification). Accompany inspector on field if requested (you can offer real-time clarifications, demonstrates transparency). Sign reception control report at end and receive copy (you have 10 days after signing to contest).",
        "Control report and what follows after: Inspector completes control PV with: actually measured vs. declared areas (with differences), crops identified vs. declared (with discrepancies), eco-scheme/coupled compliance (OK or NOK with details), verified documents (present/missing), general observations and recommendations, preliminary conclusions (no problems / minor problems / major problems). You receive PV copy on spot and have right to response/clarifications in following 10 working days if you contest findings. APIA analyzes inspector PV + possible responses and issues: Adjusted payment decision (if minor 3-5% area differences, measured area paid without penalties), Payment reduction decision (if medium problems, proportionally reduced affected schemes payment), Partial/total rejection decision (if serious problems = partial/total plot payment loss), Suspected fraud notification (if inspector considers intentional fraud = file transfer to Prosecutor's Office for criminal investigation). Payment timeline after OK control: Control finalized June-July → Payment decision August → Actual payment October-December (so control delays payment by ~2-3 months vs. farmers without control).",
        "Appeals and remedies if you disagree with findings: You have right to contest: Area measurement differences (if you consider inspector GPS inaccurate, you can order independent measurement by authorized surveyor at your expense, if you demonstrate APIA error = APIA pays measurement cost + compensation), Incorrect crop identification (if inspector visually confuses species - need clear photo evidence, third party agro expert), Control procedure non-compliance (if inspector didn't notify correctly or came without notice at unscheduled hours = can invalidate entire control), Incorrect legislation application in penalty calculation (legal reexamination request case at central APIA legal department). Appeal process: File written appeal at county APIA within 30 days of decision receipt (standard form available eApia, attach all evidence), County appeal resolution committee analyzes in 45 days and pronounces decision (maintains / modifies / cancels initial decision), If not satisfied, can continue appeal at central MADR level within 15 days, then administrative contentious court (long 1-2 year process). Statistics: ~18% farmer appeals are partially/fully admitted (APIA acknowledges error or applies more favorable interpretation), ~35% are rejected but with useful clarifications, ~47% remain unchanged decision = important to appeal if you're really right, not frivolous.",
        "AgriOne digital tools for control preparation: 'Control Readiness' module (available AgriOne Pro, 25 EUR/month add-on): Automatic comparison declared plots vs. recent Sentinel-2 satellite images (early discrepancy identification before real control), Non-concordant crops alert (AI detects if satellite crop doesn't match declaration, eg: NDVI pattern wheat vs. corn), Interactive control preparation checklist (step by step what documents prepare, what checks on field, optimal inspection communication tips), GPS measurement simulation (upload walk field GPS track, compare with LPIS, calculate potential area differences), Control history and pattern issues (learn from previous controls what aspects to focus). AgriOne farmers with active module report: 43% fewer problems identified in controls vs. average (due to preventive alerts), 89% eco-schemes compliance rate vs. 72% average (automatic checks before application submission), average savings 2,300 EUR/farm/year avoiding penalties and reductions (25 EUR/month module ROI = 92x annual).",
      ],
    },
  },
  {
    id: 14,
    slug: "seceta-strategii-adaptare-grau-2026",
    category: "weather",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop",
    title: {
      ro: "Seceta și grâul de toamnă: strategii de adaptare pentru 2026-2027",
      en: "Drought and winter wheat: adaptation strategies for 2026-2027",
    },
    excerpt: {
      ro: "Cum să protejezi cultura de grâu în condiții de secetă severă: soiuri reziliente, management apă, agrotehnică adaptată. Epertiz bazată pe sezonul 2025.",
      en: "How to protect wheat crop in severe drought conditions: resilient varieties, water management, adapted agrotechnics. Expertise based on 2025 season.",
    },
    author: "Dr. Maria Ionescu",
    date: "2026-03-12",
    readTime: "11 min",
    tags: ["Secetă", "Grâu", "Adaptare Climă", "Management Apă"],
    content: {
      ro: [
        "Sezonul agricol 2025-2026 a fost unul dintre cele mai secetoase din ultimii 50 de ani pentru cultura grâului în România. Precipitațiile din octombrie 2025 - martie 2026 au fost cu 38% sub media multianuală, iar temperaturile cu 2.1°C peste normal au accelerat evapotranspirația. Rezultatul: producții medii naționale de doar 3.2 t/ha (vs 4.8 t/ha în ani normali), pierderi estimate 1.8 miliarde EUR. Dar unele ferme au obținut totuși 4.5-5.2 t/ha chiar și în aceste condiții extreme prin strategii integrate de adaptare.",
        "Alegerea soiului este decizia critică #1. Soiuri performante secetă 2025-2026: Glosa (INCDA Fundulea) - producție medie 4.8 t/ha în deficit 40% apă, toleranță ridicată secetă toamnă + primăvară, calitate panificație superioară (proteină 13.5-14%). Izvor (Fundulea) - recomandat sud/est România, rădăcini profunde până 180 cm, menține 85% potențial chiar la -35% precipitații. Dropia (SCDA Turda) - precocitate medie, excepțional rezistent început primăvară secetos, recuperare rapidă după stres hidric. Soiuri care au eșuat: varietăți vechi (Flamura 85, Andrea) - scăderi producție 55-70%, soiuri intensive - colaps total sub 2 t/ha fără irigație.",
        "Epoca și tehnica de semănat critică pentru conservarea umidității. Timing optim 2026-2027: zona sud - 5-20 octombrie (evită temperaturi ridicate germinație), zona centru - 25 septembrie - 10 octombrie, zona nord/vest - 20 septembrie - 5 octombrie. Tehnologie: semănătoare cu discuri tăietoare, adâncime optimă 4-5 cm (contact cu umiditate sol), distanță rânduri redusă 12-15 cm (maximizare acoperire sol rapid), compactare moderată după semănat.",
        "Fertilizarea adaptată deficit hidric maximizează eficiența apei. Strategie: Fosfor prioritar (P2O5 80-100 kg/ha la semănat) - esențial dezvoltare rădăcini profunde. Azot fracționat inteligent - toamnă doar 30-40 kg/ha N (vs 60-80 kg normal), prima restituire primăvară 40-50 kg N doar dacă rezerva apă >50mm în sol 0-60cm. Potasiu (K2O 40-60 kg/ha) îmbunătățește toleranță stres osmotic. Micronelemente foliar (Zn, Mn, Fe) amplifică reziliența - aplică stadiu frunza steag + înflorire.",
        "Irigația de urgență salvează recolta în momente critice. Stadii critice: înfrățire (noiembrie) - dacă secetă extremă toamnă, o irigație 20-25mm asigură înfrățire corespunzătoare. Ieșire iarnă - reluare vegetație (martie) - irigație 25-30mm dacă rezerva apă sol <40mm. Înălțire-îmbușire (aprilie-mai) - perioada crunică, 2 irigații câte 30-35mm pot salva recolta (diferența între 2.5 t/ha și 4.8 t/ha). ROI: investiție sistem pivot central 2.800-4.200 EUR/ha, creștere producție medie +1.8-2.5 t/ha = venit suplimentar 360-500 EUR/ha, recuperare 6-8 ani.",
        "Agrotehnică conservare umiditate maximizează fiecare picătură. No-till/minimum tillage - ferme care au eliminat arătura au avut producții cu 25-30% mai mari (conservare umiditate +40mm echivalent peste sezon). Mulci organic 40-50% paie pe sol reduce evaporarea cu 35-45%. Control buruieni ultra-agresiv - buruienile consumă 30-40% din apa disponibilă. AgriOne senzori umiditate sol multi-nivel (15cm, 35cm, 60cm) permit tracking continuu, alerte automate, detectare stress hidric cu 8-12 zile înainte manifestare vizuală, economie apă irigații 35% prin aplicare precisă.",
        "Asigurarea de risc completează strategia. Index-based weather insurance - plată automată când precipitații sub prag, primă 45-65 EUR/ha cu subvenție MADR 75% (contribuție fermier doar 11-16 EUR/ha). Asigurare clasică producție acoperă 70-80% pierderi. AgriOne partnership cu 4 companii oferă calcul automat primă, aplicare online, plată claims accelerată prin verificare date senzori+satelit.",
      ],
      en: [
        "The 2025-2026 agricultural season was one of the driest in the last 50 years for wheat crop in Romania. Precipitation from October 2025 - March 2026 was 38% below multi-annual average, and temperatures 2.1°C above normal accelerated evapotranspiration. Result: national average yields of only 3.2 t/ha (vs 4.8 t/ha in normal years), estimated losses 1.8 billion EUR. But some farms still achieved 4.5-5.2 t/ha even in extreme conditions through integrated adaptation strategies.",
        "Variety choice is critical decision #1. Drought-performing varieties 2025-2026: Glosa (INCDA Fundulea) - average yield 4.8 t/ha in 40% water deficit, high tolerance autumn + spring drought, superior baking quality (protein 13.5-14%). Izvor (Fundulea) - recommended south/east Romania, deep roots up to 180 cm, maintains 85% potential even at -35% precipitation. Dropia (SCDA Turda) - medium earliness, exceptionally resistant dry early spring, rapid recovery after water stress. Failed varieties: old varieties (Flamura 85, Andrea) - yield drops 55-70%, intensive varieties - total collapse under 2 t/ha without irrigation.",
        "Sowing timing and technique critical for moisture conservation. Optimal timing 2026-2027: south area - October 5-20 (avoid high germination temperatures), center area - September 25 - October 10, north/west area - September 20 - October 5. Technology: seeders with cutting discs, optimal depth 4-5 cm (contact with soil moisture), reduced row distance 12-15 cm (maximize rapid soil cover), moderate compaction after sowing.",
        "Water deficit adapted fertilization maximizes water efficiency. Strategy: Priority phosphorus (P2O5 80-100 kg/ha at sowing) - essential deep root development. Smart fractional nitrogen - autumn only 30-40 kg/ha N (vs 60-80 kg normal), first spring restitution 40-50 kg N only if water reserve >50mm in 0-60cm soil. Potassium (K2O 40-60 kg/ha) improves osmotic stress tolerance. Foliar micronutrients (Zn, Mn, Fe) amplify resilience - apply flag leaf stage + flowering.",
        "Emergency irrigation saves harvest at critical moments. Critical stages: tillering (November) - if extreme autumn drought, one 20-25mm irrigation ensures proper tillering. Winter exit - vegetation resumption (March) - 25-30mm irrigation if soil water reserve <40mm. Stem elongation-booting (April-May) - critical period, 2 irrigations of 30-35mm each can save harvest (difference between 2.5 t/ha and 4.8 t/ha). ROI: center pivot system investment 2,800-4,200 EUR/ha, average yield increase +1.8-2.5 t/ha = additional income 360-500 EUR/ha, recovery 6-8 years.",
        "Moisture conservation agrotechnics maximizes every drop. No-till/minimum tillage - farms that eliminated plowing had 25-30% higher yields (moisture conservation +40mm equivalent over season). Organic mulch 40-50% straw on soil reduces evaporation by 35-45%. Ultra-aggressive weed control - weeds consume 30-40% of available water. AgriOne multi-level soil moisture sensors (15cm, 35cm, 60cm) enable continuous tracking, automatic alerts, water stress detection 8-12 days before visual manifestation, irrigation water savings 35% through precise application.",
        "Risk insurance completes strategy. Index-based weather insurance - automatic payment when precipitation below threshold, premium 45-65 EUR/ha with 75% MADR subsidy (farmer contribution only 11-16 EUR/ha). Classic yield insurance covers 70-80% losses. AgriOne partnership with 4 companies offers automatic premium calculation, online application, accelerated claims payment through sensor+satellite data verification.",
      ],
    },
  },
  {
    id: 15,
    slug: "inghet-tarziu-protectie-culturi-2026",
    category: "weather",
    image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=400&fit=crop",
    title: {
      ro: "Îngheț târziu 2026: cum îți protejezi culturile în primăvară",
      en: "Late frost 2026: how to protect your crops in spring",
    },
    excerpt: {
      ro: "Îngățul târziu din aprilie-mai poate distruge recoltele. Metode de protecție eficiente: anticipare meteo, irigație anti-îngheț, fumigene, acoperiri. Salvează producția.",
      en: "Late April-May frost can destroy harvests. Effective protection methods: weather anticipation, anti-frost irrigation, smoke, covers. Save production.",
    },
    author: "Ing. Cristian Vasile",
    date: "2026-03-08",
    readTime: "10 min",
    tags: ["Îngheț Târziu", "Protecție Culturi", "Meteo", "Risc Climatic"],
    content: {
      ro: [
        "Îngențul târziu (după 1 aprilie) este unul dintre riscurile meteorologice cele mai devastatoare pentru agricultura românească. Evenimentele din 15-18 aprilie 2025 au demonstrat brutal impactul: temperaturi scăzute la -3°C până -7°C în zonele joase au distrus complet inflorescențele la pomi fructiferi (95% pierdere producție cireș/vișin/prun, 70-85% pierdere măr/păr), au redus cu 40-60% recolta rapiței (flori îngețate stadiul G2-G4) și au afectat grav grâul timpuriu în zonele nord/centru (30-45% reducere producție). Pierderile totale: 680 milioane EUR. Dar fermierii care au anti cipât și au aplicat măsuri proactive au salvat 70-95% din producție.",
        "Anticiparea meteorologică precisă este cheia succesului. Indicatori critici risc îngheț: prognoză temperaturi minime <2°C în următoarele 72h (prag alertă roșie), vânt calm sau foarte slab <2 m/s (favorabil inversiune termică, aer rece stagnează la sol), cer senin noaptea (pierdere rapidă radiație = răcire intensă), umiditate relativă scăzută <60% (lipsa nor protectiv). AgriOne integrare ECMWF + modele locale oferă: alerte îngheț personalizate 5-7 zile advance (suficient timp pregătire), predicție temperatură minimă la nivel parcelă (ține cont relief, expoziție, depresiuni unde se adună aer rece), recomandări automate măsuri protecție funcție cultură și fenofază. Fermierii AgriOne au primit alertă precisă cu 6 zile înainte event 15 aprilie 2025, au avut timp aplicare complete protecții.",
        "Metode active de protecție anti-îngheț. Irigația prin aspersiune continuă - cea mai eficientă metodă: principiu fizic - apa care îngheață pe plante eliberează căldură latentă (80 cal/g) care menține temperatura țesuturilor la 0°C (vs -5°C fără protecție = diferența între supraviețuire și moarte celulară). Aplicare: început aspersiune când temperatura scade la +2°C, menținere continuă până temperatura revine peste +1°C dimineața (poate fi 6-10 ore non-stop). Consum apă: 3-4 mm/oră = 30-40 m³/ha/oră (investiție mare dar salvează recolta). Eficiență: protecție până la -6°C temperatură aer, cost operare 180-250 EUR/ha/noapte saved vs pierdere recoltă 2.000-8.000 EUR/ha = ROI imens. Fumigene sau încălzitoare - metoda tradiționalie pentru livezi: brichetele speciale (parafină + pulbere aluminiu) sau arderea controlată reziduuri organice (paie umede, rumeguș). Plasare 80-120 brichete/ha în puncte strategice, aprindere când temperatura scade la +1°C. Creează nor protecție termică + creștere temperatură locală +2 până +4°C. Cost: 120-180 EUR/ha/noapte. Limită: eficient doar îngheț slab până -3°C, necesită calm vânt (altfel fumul se risipește).",
        "Metode pasive și preventive. Alegerea soiurilor/hibrizilor rezilienți la îngheț: pomi fructiferi înflorire târzie (evită perioada risc maxim 10-25 aprilie) - cireș soiul Summit, Kordia (înfloresc după 20 aprilie vs 5-10 aprilie soiuri clasice Timpurii de Vârșeț), măr soiul Idared, Jonagold (înflorirea 25 aprilie - 5 mai, mult mai sigur). Rapiță hibrizi primăvară tardivi (Architect, Avatar) - înflorire după 25 aprilie când riscul îngețului a trecut. Grâu tolerant îngheț stadiu înălțire (soiuri montane Apullum, Gruia). Managementul vegetației prevenție: evită fertilizare azotată excesivă toamnă/iarnă (țesuturi succulente mai sensibile îngheț), mențin cultură ușor stresată hidric înainte îngheț estimat (reduce conținut apă celule = mai mare rezistență), tăvălugire post-îngheț pentru contact rădăcini-sol (regenerare mai rapidă).",
        "Acoperiri fizice și bariere protecție (culturi intensive, legume). Folii non-woven (agril) acoperire directă: material textil sintetic permeabil aer + apă, păstrează +3 până +5°C față exterior, costuri 0.15-0.30 EUR/m² (refolosibil 3-4 sezoane), aplicabil culturi joase (căpșuni, legume timpurii, răsaduri). Tuneluri  joase sau sere-tunel: structură metalică + folie polietilenă, protecție până -8°C exterior,investiție 2-8 EUR/m² funcție calitate. Sisteme mobile ventilație forțată (wind machines pentru livezi mari >10 ha): ventilator gigant (putere 75-150 kW) instalat pe turn 10-12m, amestecă aer cald de la altitudine cu aer rece de sol, creează zonă protejată 4-6 ha/unitate, eficient când temperatura inversiune (aer la 10m e cu +5°C față sol). Cost: 25.000-45.000 EUR/unitate, operare 15-25 EUR/ha/oră, amortizare 8-12 ani. Fermă pomi intensiv 50 ha cu 8 ventilatoare = investiție 280.000 EUR dar salvare anuală producucție 180.000-420.000 EUR în anii cu îngheț.",
        "Intervenții post-îngheț și recuperare. Evaluare rapidă daună: inspecție vizuală 24-48h după îngheț - secționare muguri/flori/frunze, verificare culoare țesut (brun/negru = mort, verde = supraviețuit), estimare procent pierdere. Tratamente ayuvante recuperare: aplicații foliare cu amino-acizi (stimulează regenerare țesuturi), micronutriente (Zn, Mn, Fe, B), hormoni creștere (auxine, citokinine) - ajută plantele să compenseze parțial daunele. Fertilizare azotată suplimentară (20-30 kg N/ha) pentru tulpini secundare la cereale (compensare pierdere tulpini principale). Decizie continuare/renunțare: dacă pierdere >70-80% cultură, economic mai rentabil: distrugere și re-semănat cultură alternativă (porumb, floarea soarelui, soia precoce după rapiță îngețată complet), claim asigurare daună și minimizare pierderi. AgriOne modul 'Frost Damage Assessment' cu imagini satelit NDVI post-eventiment identification automat zone afectate, calcul procent pierdere per parcelă, recomandări acțiuni recuperare sau renunțare, asistență documentare claim asigurare.",
        "Asigurări speciale îngheț și compensare pierderi. Asigurare risc îngheț târziu (add-on la asigurarea principală sau standalone): acoperire specific daunele de îngheț aprilie-mai (perioada critică), prag declanșare plată: temperaturi sub -2°C înregistrate (stație automată) + confirmare daună expert agricol, compensare 70-85% din valoarea producție pierdută, primă 3.5-5% suma asigurată cu subvenție 75% stat = cost efectiv fermier 0.9-1.25% (micro comparativ risc). Studiu de caz: Livadă cireș 12 ha Vâlcea, valoare producție estimată 240.000 EUR (20 t/ha × 1.000 EUR/t), primă asigurare îngheț 8.400 EUR (3.5%), subvenție 6.300 EUR → cost fermier 2.100 EUR. Event 17 aprilie 2025: îngheț -5°C = pierdere 95% producție = daună 228.000 EUR. Asigurare plătit 80% = 182.400 EUR. ROI: plătit 2.100 EUR primă, recuperat 182.400 EUR = salvare financiară completă vs faliment."
      ],
      en: [
        "Late frost (after April 1) is one of the most devastating meteorological risks for Romanian agriculture. Events from April 15-18, 2025 brutally demonstrated the impact: temperatures dropped to -3°C to -7°C in low areas completely destroying fruit trees inflorescences (95% cherry/sour cherry/plum production loss, 70-85% apple/pear loss), reduced rapeseed harvest by 40-60% (frozen flowers at G2-G4 stage) and severely affected early wheat in north/center areas (30-45% production reduction). Total losses: 680 million EUR. But farmers who anticipated and applied proactive measures saved 70-95% of production.",
        "Precise weather anticipation is the key to success. Critical frost risk indicators: forecast minimum temperatures <2°C in next 72h (red alert threshold), calm or very weak wind <2 m/s (favorable temperature inversion, cold air stagnates at ground), clear sky at night (rapid radiation loss = intense cooling), low relative humidity <60% (lack of protective cloud). AgriOne ECMWF integration + local models offers: personalized frost alerts 5-7 days advance (sufficient preparation time), plot-level minimum temperature prediction (considers relief, exposure, depressions where cold air accumulates), automatic protection measure recommendations function of crop and phenophase. AgriOne farmers received precise alert 6 days before April 15, 2025 event, had time for complete protection application.",
        "Active anti-frost protection methods. Continuous sprinkler irrigation - most efficient method: physical principle - water freezing on plants releases latent heat (80 cal/g) maintaining tissue temperature at 0°C (vs -5°C without protection = difference between survival and cell death). Application: start sprinkling when temperature drops to +2°C, maintain continuous until temperature returns above +1°C in morning (can be 6-10 hours non-stop). Water consumption: 3-4 mm/hour = 30-40 m³/ha/hour (large investment but saves harvest). Efficiency: protection up to -6°C air temperature, operating cost 180-250 EUR/ha/night vs harvest loss 2,000-8,000 EUR/ha = immense ROI. Smoke pots or heaters - traditional method for orchards: special briquettes (paraffin + aluminum powder) or controlled burning organic residues (wet straw, sawdust). Placement 80-120 briquettes/ha at strategic points, ignition when temperature drops to +1°C. Creates thermal protection cloud + local temperature increase +2 to +4°C. Cost: 120-180 EUR/ha/night. Limit: effective only mild frost up to -3°C, requires wind calm (otherwise smoke dissipates).",
        "Passive and preventive methods. Choice of frost-resilient varieties/hybrids: late-flowering fruit trees (avoid maximum risk period April 10-25) - cherry variety Summit, Kordia (flowers after April 20 vs April 5-10 classic varieties Early Vârșeț), apple variety Idared, Jonagold (flowering April 25 - May 5, much safer). Late spring rapeseed hybrids (Architect, Avatar) - flowering after April 25 when frost risk has passed. Frost-tolerant wheat at elongation stage (mountain varieties Apullum, Gruia). Preventive vegetation management: avoid excessive autumn/winter nitrogen fertilization (succulent tissues more frost-sensitive), maintain crop slightly water-stressed before estimated frost (reduces cell water content = greater resistance), post-frost rolling for root-soil contact (faster regeneration).",
        "Physical covers and protection barriers (intensive crops, vegetables). Non-woven fabrics (agril) direct cover: synthetic textile material permeable to air + water, maintains +3 to +5°C vs exterior, costs 0.15-0.30 EUR/m² (reusable 3-4 seasons), applicable low crops (strawberries, early vegetables, seedlings). Low tunnels or tunnel greenhouses: metal structure + polyethylene film, protection up to -8°C exterior, investment 2-8 EUR/m² function of quality. Mobile forced ventilation systems (wind machines for large orchards >10 ha): giant fan (power 75-150 kW) installed on 10-12m tower, mixes warm air from altitude with cold ground air, creates protected zone 4-6 ha/unit, effective when temperature inversion (air at 10m is +5°C vs ground). Cost: 25,000-45,000 EUR/unit, operation 15-25 EUR/ha/hour, amortization 8-12 years. Intensive 50 ha fruit farm with 8 fans = investment 280,000 EUR but annual production savings 180,000-420,000 EUR in frost years.",
        "Post-frost interventions and recovery. Rapid damage assessment: visual inspection 24-48h after frost - sectioning buds/flowers/leaves, tissue color verification (brown/black = dead, green = survived), loss percentage estimation. Recovery aid treatments: foliar applications with amino acids (stimulate tissue regeneration), micronutrients (Zn, Mn, Fe, B), growth hormones (auxins, cytokinins) - help plants partially compensate damages. Additional nitrogen fertilization (20-30 kg N/ha) for secondary stems in cereals (compensation main stem loss). Continue/abandon decision: if loss >70-80% crop, economically more profitable: destruction and re-sowing alternative crop (corn, sunflower, early soybeans after completely frozen rapeseed), insurance damage claim and loss minimization. AgriOne 'Frost Damage Assessment' module with post-event NDVI satellite images automatic affected area identification, per-plot loss percentage calculation, recovery or abandonment action recommendations, insurance claim documentation assistance.",
        "Special frost insurance and loss compensation. Late frost risk insurance (add-on to main insurance or standalone): specific coverage for April-May frost damages (critical period), payment trigger threshold: temperatures below -2°C recorded (automatic station) + agricultural expert damage confirmation, compensation 70-85% of lost production value, premium 3.5-5% insured amount with 75% state subsidy = effective farmer cost 0.9-1.25% (micro compared to risk). Case study: Cherry orchard 12 ha Vâlcea, estimated production value 240,000 EUR (20 t/ha × 1,000 EUR/t), frost insurance premium 8,400 EUR (3.5%), subsidy 6,300 EUR → farmer cost 2,100 EUR. April 17, 2025 event: frost -5°C = 95% production loss = damage 228,000 EUR. Insurance paid 80% = 182,400 EUR. ROI: paid 2,100 EUR premium, recovered 182,400 EUR = complete financial salvation vs bankruptcy."
      ],
    },
  },
];

const categories = [
  { id: "all", name: { ro: "Toate", en: "All" }, icon: BookOpen },
  { id: "technology", name: { ro: "Tehnologie", en: "Technology" }, icon: Cpu },
  {
    id: "sustainability",
    name: { ro: "Sustenabilitate", en: "Sustainability" },
    icon: Leaf,
  },
  { id: "crops", name: { ro: "Culturi", en: "Crops" }, icon: Wheat },
  { id: "legislation", name: { ro: "Legislație", en: "Legislation" }, icon: FileText },
  { id: "weather", name: { ro: "Meteo", en: "Weather" }, icon: Cloud },
  { id: "tutorials", name: { ro: "Tutoriale", en: "Tutorials" }, icon: BookOpen },
  { id: "news", name: { ro: "Știri", en: "News" }, icon: TrendingUp },
  { id: "sensors", name: { ro: "Senzori", en: "Sensors" }, icon: Cpu },
  { id: "economics", name: { ro: "Economic", en: "Economics" }, icon: TrendingUp },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const filteredArticles = blogArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = blogArticles.find((a) => a.featured);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const openArticle = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const shareArticle = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article.title[language],
        text: article.excerpt[language],
        url: window.location.href,
      });
    }
  };

  if (selectedArticle) {
    return (
      <LandingLayout>
        <LandingNavbar />
        <div className="min-h-screen bg-background pt-20">
          <article className="max-w-4xl mx-auto px-4 py-12">
            <Button
              variant="ghost"
              onClick={closeArticle}
              className="mb-6 hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === "ro" ? "Înapoi la blog" : "Back to blog"}
            </Button>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">
                {categories.find((c) => c.id === selectedArticle.category)
                  ?.name[language]}
              </Badge>

              <h1 className="text-4xl font-bold mb-4 text-foreground">
                {selectedArticle.title[language]}
              </h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{selectedArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedArticle.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime}</span>
                </div>
                <button
                  onClick={() => shareArticle(selectedArticle)}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {language === "ro" ? "Distribuie" : "Share"}
                </button>
              </div>

              <img
                src={selectedArticle.image}
                alt={selectedArticle.title[language]}
                className="w-full h-96 object-cover rounded-xl mb-8"
                onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23166534'/%3E%3Ctext x='400' y='210' font-family='sans-serif' font-size='32' fill='%23bbf7d0' text-anchor='middle'%3EAgriOne%3C/text%3E%3C/svg%3E"; }}
              />

              <div className="prose prose-lg max-w-none dark:prose-invert">
                {selectedArticle.content[language].map((paragraph, idx) => (
                  <p key={idx} className="mb-6 text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-12 p-6 bg-accent/50 rounded-xl">
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {language === "ro"
                    ? "Ti-a plăcut acest articol?"
                    : "Did you like this article?"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === "ro"
                    ? "Înscrie-te la newsletter pentru mai multe articole despre agricultura inteligentă."
                    : "Subscribe to our newsletter for more articles about smart agriculture."}
                </p>
                <Button onClick={() => navigate("/contact")}>
                  {language === "ro" ? "Abonează-te" : "Subscribe"}
                </Button>
              </div>
            </Motion.div>
          </article>

          {/* Newsletter CTA */}
          <div className="max-w-4xl mx-auto my-16">
            <NewsletterSubscribe />
          </div>
        </div>
        <LandingFooter />
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <LandingNavbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {language === "ro" ? "Blog AgriOne" : "AgriOne Blog"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "ro"
                ? "Articole actualizate despre agricultura inteligentă, tehnologii IoT, sustenabilitate și tendințe din industrie"
                : "Updated articles about smart agriculture, IoT technologies, sustainability and industry trends"}
            </p>
          </Motion.div>

          {featuredArticle && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16 relative group cursor-pointer"
              onClick={() => openArticle(featuredArticle)}
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title[language]}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23166534'/%3E%3Ctext x='400' y='260' font-family='sans-serif' font-size='32' fill='%23bbf7d0' text-anchor='middle'%3EAgriOne%3C/text%3E%3C/svg%3E"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <Badge className="mb-4 bg-primary text-primary-foreground">
                    {language === "ro" ? "Articol Recomandat" : "Featured Article"}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {featuredArticle.title[language]}
                  </h2>
                  <p className="text-lg mb-4 text-gray-200">
                    {featuredArticle.excerpt[language]}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredArticle.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredArticle.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}

          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={
                    language === "ro"
                      ? "Caută articole..."
                      : "Search articles..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <Button variant="outline" className="lg:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                {language === "ro" ? "Filtrează" : "Filter"}
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                    className="whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name[language]}
                  </Button>
                );
              })}
            </div>
          </div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {currentArticles.map((article, index) => (
              <Motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => openArticle(article)}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title[language]}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23166534'/%3E%3Ctext x='400' y='210' font-family='sans-serif' font-size='32' fill='%23bbf7d0' text-anchor='middle'%3EAgriOne%3C/text%3E%3C/svg%3E"; }}
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    {categories.find((c) => c.id === article.category)?.name[language]}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {article.title[language]}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt[language]}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString(language === "ro" ? "ro-RO" : "en-US")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Motion.div>
            ))}
          </Motion.div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Newsletter CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <NewsletterSubscribe />
        </div>
      </div>
      <LandingFooter />
    </LandingLayout>
  );
}
