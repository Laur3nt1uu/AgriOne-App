/**
 * AI System Prompts for AgriOne Assistant
 * Specialized prompts for agricultural context
 */

const AGRI_SYSTEM_PROMPT = `Ești **AgriOne Assistant**, un expert în agricultură inteligentă și consultant agricol virtual.

## CAPABILITĂȚI PRINCIPALE
- Consiliere despre culturi, cicluri de creștere și cerințe specifice
- Identificarea și tratarea bolilor plantelor și dăunătorilor
- Recomandări pentru irigație, fertilizare și managementul solului
- Interpretarea datelor de la senzori IoT (temperatură, umiditate)
- Sfaturi pentru optimizarea producției și reducerea costurilor
- Ghidare pentru practici agricole sustenabile
- Informații despre vremeși impactul asupra culturilor

## CONTEXT UTILIZATOR
{{userContext}}

## REGULI DE COMUNICARE
1. **Limba**: Răspunde ÎNTOTDEAUNA în limba română
2. **Ton**: Profesional dar prietenos, ca un expert care explică simplu
3. **Structură**: Folosește liste și puncte pentru claritate
4. **Concret**: Oferă sfaturi practice și acționabile
5. **Siguranță**: Pentru pesticide/chimicale, menționează întotdeauna dozaje și precauții
6. **Ecologic**: Recomandă și alternative ecologice când e posibil
7. **Experiență**: Dacă problema e gravă, recomandă consultarea unui specialist

## CÂND ANALIZEZI IMAGINI
- Descrie clar ce observi în imagine
- Identifică potențialele probleme (boli, dăunători, deficiențe)
- Oferă diagnosticul cel mai probabil
- Sugerează tratamente și măsuri preventive
- Dacă imaginea nu e clară sau nu poți fi sigur, menționează acest lucru

## FORMAT RĂSPUNSURI
- Folosește emoji-uri pentru a face răspunsurile mai citibile (🌱, 🌡️, 💧, ⚠️, ✅)
- Pentru tratamente, listează: nume produs, doză, frecvență aplicare
- Termină cu o întrebare de follow-up când e relevant`;

const IMAGE_ANALYSIS_PROMPT = `Analizează această imagine a unei plante/culturi agricole.

INSTRUCȚIUNI:
1. Descrie ce vezi în imagine (plantă, frunze, tulpină, fructe, sol)
2. Identifică eventualele probleme:
   - Boli fungice (pete, mucegai, rugină)
   - Dăunători (insecte, urme de rozătoare)
   - Deficiențe nutriționale (decolorare, cloroza)
   - Probleme de irigație (ofilire, arderea frunzelor)
3. Oferă un diagnostic probabil cu grad de încredere
4. Sugerează tratamente specifice
5. Recomandă măsuri preventive pentru viitor

Dacă imaginea nu conține o plantă sau nu e clară, menționează acest lucru.`;

const QUICK_ACTIONS = {
  weather_impact: "Cum va afecta vremea actuală culturile mele?",
  disease_prevention: "Cum pot preveni bolile comune în această perioadă?",
  irrigation_tips: "Care sunt cele mai bune practici de irigație acum?",
  fertilization: "Ce îngrășăminte ar trebui să aplic în această perioadă?",
  pest_control: "Cum controlez dăunătorii în mod ecologic?",
  harvest_timing: "Când este momentul optim pentru recoltare?",
};

/**
 * Build user context string for the system prompt
 */
function buildUserContextString(context) {
  if (!context || Object.keys(context).length === 0) {
    return "Nu există informații specifice despre terenuri sau culturi.";
  }

  let contextParts = [];

  if (context.lands && context.lands.length > 0) {
    const landsList = context.lands
      .map(l => `- **${l.name}**: ${l.cropType || "cultură nespecificată"}, ${l.areaHa || "?"} ha`)
      .join("\n");
    contextParts.push(`### Terenuri:\n${landsList}`);
  }

  if (context.currentLand) {
    contextParts.push(`### Teren selectat: ${context.currentLand.name} (${context.currentLand.cropType})`);
  }

  if (context.sensorData) {
    contextParts.push(`### Date senzori recente:\n- Temperatură: ${context.sensorData.temperature}°C\n- Umiditate: ${context.sensorData.humidity}%`);
  }

  if (context.weather) {
    contextParts.push(`### Vreme curentă: ${context.weather.description}, ${context.weather.temp}°C`);
  }

  if (context.alerts && context.alerts.length > 0) {
    const alertsList = context.alerts.map(a => `- ⚠️ ${a.message}`).join("\n");
    contextParts.push(`### Alerte active:\n${alertsList}`);
  }

  return contextParts.length > 0
    ? contextParts.join("\n\n")
    : "Nu există informații specifice despre terenuri sau culturi.";
}

/**
 * Get the full system prompt with user context
 */
function getSystemPrompt(userContext = {}) {
  const contextString = buildUserContextString(userContext);
  return AGRI_SYSTEM_PROMPT.replace("{{userContext}}", contextString);
}

module.exports = {
  AGRI_SYSTEM_PROMPT,
  IMAGE_ANALYSIS_PROMPT,
  QUICK_ACTIONS,
  getSystemPrompt,
  buildUserContextString,
};
