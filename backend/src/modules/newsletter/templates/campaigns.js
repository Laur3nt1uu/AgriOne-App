/**
 * Predefined newsletter campaign templates.
 * Each exports `getCampaignEmail(language, unsubscribeToken)` → { subject, html, text }
 */

const campaigns = {
  newFeatures: {
    id: "new_features",
    icon: "🚀",
    ro: {
      name: "Funcționalități Noi",
      description: "Anunță utilizatorii despre funcționalități noi ale platformei.",
      subject: "Ce e nou pe AgriOne? 🚀 Descoperă ultimele funcționalități",
      heading: "Funcționalități Noi pe AgriOne",
      intro: "Am adăugat noi instrumente pentru a-ți face munca mai ușoară!",
      body: "Echipa AgriOne lucrează constant pentru a aduce îmbunătățiri platformei. Iată ce am pregătit recent:",
      features: [
        "📊 Dashboard îmbunătățit cu grafice interactive noi",
        "🔔 Sistem de alerte mai inteligent cu praguri personalizabile",
        "🗺️ Hărți actualizate cu vizualizare parcele APIA",
        "💰 Modul financiar cu rapoarte detaliate de cheltuieli și venituri",
        "🤖 Recomandări AI bazate pe datele senzorilor tăi",
      ],
      cta: "Explorează acum",
      closing: "Îți mulțumim că faci parte din comunitatea AgriOne!",
    },
    en: {
      name: "New Features",
      description: "Announce new platform features to users.",
      subject: "What's new on AgriOne? 🚀 Discover the latest features",
      heading: "New Features on AgriOne",
      intro: "We've added new tools to make your work easier!",
      body: "The AgriOne team is constantly working to bring improvements to the platform. Here's what we've prepared recently:",
      features: [
        "📊 Improved dashboard with new interactive charts",
        "🔔 Smarter alert system with customizable thresholds",
        "🗺️ Updated maps with APIA parcel visualization",
        "💰 Financial module with detailed expense and income reports",
        "🤖 AI recommendations based on your sensor data",
      ],
      cta: "Explore now",
      closing: "Thank you for being part of the AgriOne community!",
    },
  },

  seasonalTips: {
    id: "seasonal_tips",
    icon: "🌱",
    ro: {
      name: "Sfaturi Sezoniere",
      description: "Sfaturi agricole practice pentru sezonul curent.",
      subject: "Sfaturi agricole pentru sezonul curent 🌱",
      heading: "Sfaturi Sezoniere AgriOne",
      intro: "Pregătește-ți terenurile pentru un sezon de succes!",
      body: "Bazat pe datele colectate de la fermierii din comunitatea noastră, iată cele mai importante recomandări:",
      features: [
        "🌡️ Monitorizează temperatura solului — semănatul la temperaturi optime crește randamentul cu 15-20%",
        "💧 Verifică umiditatea zilnic — irigarea corectă previne pierderile de recoltă",
        "🧪 Analizează solul înainte de fertilizare — economisești bani și protejezi mediul",
        "📅 Respectă calendarul APIA — termenele limită sunt esențiale pentru subvenții",
        "📱 Configurează alerte pe AgriOne — primești notificări când parametrii ies din limite",
      ],
      cta: "Verifică terenurile tale",
      closing: "O recoltă bună începe cu decizii informate. AgriOne te ajută în fiecare pas.",
    },
    en: {
      name: "Seasonal Tips",
      description: "Practical farming tips for the current season.",
      subject: "Farming tips for the current season 🌱",
      heading: "AgriOne Seasonal Tips",
      intro: "Prepare your fields for a successful season!",
      body: "Based on data collected from farmers in our community, here are the most important recommendations:",
      features: [
        "🌡️ Monitor soil temperature — sowing at optimal temps increases yield by 15-20%",
        "💧 Check moisture daily — proper irrigation prevents crop losses",
        "🧪 Analyze soil before fertilizing — saves money and protects the environment",
        "📅 Follow the APIA calendar — deadlines are essential for subsidies",
        "📱 Set up alerts on AgriOne — get notified when parameters go out of range",
      ],
      cta: "Check your lands",
      closing: "A good harvest starts with informed decisions. AgriOne helps you every step of the way.",
    },
  },

  weatherAlert: {
    id: "weather_alert",
    icon: "⛈️",
    ro: {
      name: "Alertă Meteo",
      description: "Avertizare meteo importantă pentru fermieri.",
      subject: "⛈️ Alertă Meteo — Protejează-ți culturile!",
      heading: "Alertă Meteo Importantă",
      intro: "Conform prognozelor, se anunță condiții meteorologice extreme.",
      body: "Te sfătuim să verifici următoarele pentru a proteja culturile și echipamentele:",
      features: [
        "🌡️ Verifică pragurile de temperatură setate pe senzori",
        "💧 Asigură-te că sistemul de irigare e pregătit",
        "🛡️ Protejează echipamentele IoT de intemperii",
        "📊 Consultă graficele de trend pentru a anticipa impactul",
        "📱 Activează toate alertele de pe AgriOne",
      ],
      cta: "Verifică dashboard-ul",
      closing: "Analizează datele în timp real pe AgriOne și ia măsuri preventive.",
    },
    en: {
      name: "Weather Alert",
      description: "Important weather warning for farmers.",
      subject: "⛈️ Weather Alert — Protect your crops!",
      heading: "Important Weather Alert",
      intro: "According to forecasts, extreme weather conditions are expected.",
      body: "We recommend checking the following to protect your crops and equipment:",
      features: [
        "🌡️ Verify temperature thresholds on your sensors",
        "💧 Ensure your irrigation system is ready",
        "🛡️ Protect IoT equipment from harsh weather",
        "📊 Check trend charts to anticipate the impact",
        "📱 Enable all alerts on AgriOne",
      ],
      cta: "Check your dashboard",
      closing: "Monitor real-time data on AgriOne and take preventive action.",
    },
  },

  platformUpdate: {
    id: "platform_update",
    icon: "🔧",
    ro: {
      name: "Actualizare Platformă",
      description: "Informare despre mentenanță sau actualizări de sistem.",
      subject: "🔧 AgriOne — Actualizare de Platformă",
      heading: "Actualizare Platformă AgriOne",
      intro: "Am efectuat îmbunătățiri pentru o experiență mai bună.",
      body: "Iată ce s-a schimbat:",
      features: [
        "⚡ Performanță îmbunătățită — pagini care se încarcă mai rapid",
        "🔒 Actualizări de securitate — datele tale sunt și mai protejate",
        "🐛 Rezolvarea bug-urilor raportate de comunitate",
        "📱 Interfață optimizată pentru dispozitive mobile",
        "🔄 Sincronizare mai rapidă a datelor de la senzori",
      ],
      cta: "Încearcă acum",
      closing: "Feedback-ul tău ne ajută să facem AgriOne mai bun. Mulțumim!",
    },
    en: {
      name: "Platform Update",
      description: "Information about maintenance or system updates.",
      subject: "🔧 AgriOne — Platform Update",
      heading: "AgriOne Platform Update",
      intro: "We've made improvements for a better experience.",
      body: "Here's what changed:",
      features: [
        "⚡ Improved performance — faster page loads",
        "🔒 Security updates — your data is even more protected",
        "🐛 Bug fixes reported by the community",
        "📱 Optimized interface for mobile devices",
        "🔄 Faster sensor data synchronization",
      ],
      cta: "Try it now",
      closing: "Your feedback helps us make AgriOne better. Thank you!",
    },
  },
};

/**
 * Generate a campaign email for the given template.
 * @param {string} campaignKey - one of the keys in `campaigns`
 * @param {string} language - "ro" or "en"
 * @param {string} unsubscribeToken - per-subscriber token
 * @returns {{ subject: string, html: string, text: string }}
 */
function getCampaignEmail(campaignKey, language = "ro", unsubscribeToken) {
  const campaign = campaigns[campaignKey];
  if (!campaign) throw new Error(`Unknown campaign template: ${campaignKey}`);

  const t = campaign[language] || campaign.ro;
  const appUrl = process.env.APP_PUBLIC_URL || "http://localhost:5173";
  const unsubscribeUrl = unsubscribeToken
    ? `${appUrl}/newsletter/unsubscribe/${unsubscribeToken}`
    : "#";

  const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 16px;
      font-size: 16px;
      color: #4b5563;
    }
    .features {
      list-style: none;
      padding: 0;
      margin: 24px 0;
    }
    .features li {
      padding: 10px 0;
      font-size: 15px;
      color: #374151;
      border-bottom: 1px solid #f3f4f6;
    }
    .features li:last-child {
      border-bottom: none;
    }
    .cta-button {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 32px;
      background-color: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #10b981;
      text-decoration: none;
    }
    .logo {
      font-size: 36px;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${campaign.icon}</div>
      <h1>${t.heading}</h1>
    </div>
    <div class="content">
      <p><strong>${t.intro}</strong></p>
      <p>${t.body}</p>
      <ul class="features">
        ${t.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>
      <p>${t.closing}</p>
      <center>
        <a href="${appUrl}" class="cta-button">${t.cta}</a>
      </center>
    </div>
    <div class="footer">
      <p>${language === "ro" ? "Cu respect," : "Best regards,"}<br/>${language === "ro" ? "Echipa AgriOne" : "The AgriOne Team"}</p>
      <p>${language === "ro" ? "Nu mai doriți să primiți emailuri? " : "Don't want to receive emails? "}<a href="${unsubscribeUrl}">${language === "ro" ? "Dezabonare" : "Unsubscribe"}</a></p>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        &copy; ${new Date().getFullYear()} AgriOne. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
${t.heading}

${t.intro}

${t.body}

${t.features.map((f) => f.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, "•")).join("\n")}

${t.closing}

${t.cta}: ${appUrl}

---
${language === "ro" ? "Dezabonare" : "Unsubscribe"}: ${unsubscribeUrl}

© ${new Date().getFullYear()} AgriOne
`;

  return { subject: t.subject, html, text: text.trim() };
}

/**
 * Get available campaign templates with metadata for the admin UI.
 * @param {string} language
 */
function getAvailableCampaigns(language = "ro") {
  return Object.entries(campaigns).map(([key, c]) => {
    const t = c[language] || c.ro;
    return {
      key,
      id: c.id,
      icon: c.icon,
      name: t.name,
      description: t.description,
      subject: t.subject,
    };
  });
}

module.exports = { getCampaignEmail, getAvailableCampaigns };
