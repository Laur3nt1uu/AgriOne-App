function getWelcomeEmail(language = "ro", unsubscribeToken) {
  const content = {
    ro: {
      subject: "Bine ai venit la Newsletter-ul AgriOne! 🌾",
      heading: "Bine ai venit la AgriOne!",
      intro: "Mulțumim că te-ai abonat la newsletter-ul nostru!",
      body1:
        "Vom ține legătura cu tine prin email pentru a-ți oferi cele mai noi informații despre:",
      features: [
        "🌱 Tehnologii agricole inovatoare și AI în agricultură",
        "📋 Legislație APIA, subvenții și termene importante",
        "🌤️ Prognoze meteo și impactul asupra culturilor",
        "📱 Tutoriale AgriOne și funcționalități noi",
        "📰 Știri și tendințe din industria agricolă românească",
      ],
      body2:
        "AgriOne este platforma ta completă pentru monitorizare inteligentă a terenurilor agricole. Ne dorim să te ajutăm să obții recolte mai bune prin tehnologie modernă.",
      cta: "Vizitează platforma",
      footer:
        "Dacă nu mai dorești să primești emailuri de la noi, poți să te dezabonezi oricând.",
      unsubscribe: "Dezabonare",
      thanks: "Cu respect,<br/>Echipa AgriOne",
    },
    en: {
      subject: "Welcome to AgriOne Newsletter! 🌾",
      heading: "Welcome to AgriOne!",
      intro: "Thank you for subscribing to our newsletter!",
      body1:
        "We'll keep in touch via email to bring you the latest information about:",
      features: [
        "🌱 Innovative agricultural technologies and AI in farming",
        "📋 APIA legislation, subsidies, and important deadlines",
        "🌤️ Weather forecasts and their impact on crops",
        "📱 AgriOne tutorials and new features",
        "📰 News and trends from the Romanian agricultural industry",
      ],
      body2:
        "AgriOne is your complete platform for intelligent farm monitoring. We want to help you achieve better harvests through modern technology.",
      cta: "Visit platform",
      footer: "If you no longer wish to receive emails from us, you can unsubscribe at any time.",
      unsubscribe: "Unsubscribe",
      thanks: "Best regards,<br/>The AgriOne Team",
    },
  };

  const t = content[language] || content.ro;
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
      padding: 8px 0;
      font-size: 15px;
      color: #374151;
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
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background-color: #059669;
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
    .footer a:hover {
      text-decoration: underline;
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
      <div class="logo">🌾</div>
      <h1>${t.heading}</h1>
    </div>
    <div class="content">
      <p><strong>${t.intro}</strong></p>
      <p>${t.body1}</p>
      <ul class="features">
        ${t.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <p>${t.body2}</p>
      <center>
        <a href="${appUrl}" class="cta-button">${t.cta}</a>
      </center>
    </div>
    <div class="footer">
      <p>${t.thanks}</p>
      <p>${t.footer}</p>
      <p><a href="${unsubscribeUrl}">${t.unsubscribe}</a></p>
      <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
        © ${new Date().getFullYear()} AgriOne. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
${t.heading}

${t.intro}

${t.body1}

${t.features.map((f) => f.replace(/[🌱📋🌤️📱📰]/g, "•")).join("\n")}

${t.body2}

${t.cta}: ${appUrl}

---
${t.footer}
${t.unsubscribe}: ${unsubscribeUrl}

© ${new Date().getFullYear()} AgriOne
`;

  return {
    subject: t.subject,
    html,
    text: text.trim(),
  };
}

module.exports = {
  getWelcomeEmail,
};
