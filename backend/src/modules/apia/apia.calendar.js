/**
 * APIA Calendar events for Romania — yearly cycle.
 * Dates are representative; APIA may adjust yearly.
 */

function getCalendarEvents(year) {
  return [
    {
      id: "prep",
      date: `${year}-01-15`,
      endDate: `${year}-02-28`,
      titleRo: "Pregătire Documente",
      titleEn: "Document Preparation",
      descRo:
        "Pregătește documentele necesare pentru Cererea Unică: acte teren, contracte arendă, copie CI, extras cadastral.",
      descEn:
        "Prepare documents for the Single Application: land deeds, lease contracts, ID copy, cadastral extract.",
      priority: "MEDIUM",
      category: "PREPARATION",
    },
    {
      id: "open",
      date: `${year}-03-01`,
      titleRo: "Deschidere Depunere Cerere Unică",
      titleEn: "Single Application Submission Opens",
      descRo:
        "Se deschide perioada oficială de depunere a Cererii Unice de plată la centrele APIA.",
      descEn:
        "The official Single Application submission period opens at APIA centers.",
      priority: "HIGH",
      category: "SUBMISSION",
    },
    {
      id: "recommended",
      date: `${year}-04-15`,
      titleRo: "Termen Recomandat",
      titleEn: "Recommended Deadline",
      descRo:
        "Se recomandă depunerea până la această dată pentru a evita aglomerația și posibilele erori.",
      descEn:
        "Submission recommended by this date to avoid congestion and potential errors.",
      priority: "MEDIUM",
      category: "SUBMISSION",
    },
    {
      id: "deadline",
      date: `${year}-05-15`,
      titleRo: "Termen Limită Cerere Unică",
      titleEn: "Single Application Deadline",
      descRo:
        "Ultimul termen fără penalizări. După această dată se aplică penalizare de 1% pe zi lucrătoare de întârziere.",
      descEn:
        "Last deadline without penalties. After this, a 1% penalty per working day of delay applies.",
      priority: "HIGH",
      category: "SUBMISSION",
    },
    {
      id: "late",
      date: `${year}-06-01`,
      titleRo: "Termen cu Penalizări",
      titleEn: "Late Submission Period",
      descRo:
        "Depunere cu întârziere: penalizare 1% pe zi lucrătoare (maxim 25 zile calendaristice).",
      descEn:
        "Late submission: 1% penalty per working day (maximum 25 calendar days).",
      priority: "HIGH",
      category: "SUBMISSION",
    },
    {
      id: "final",
      date: `${year}-06-15`,
      titleRo: "Termen Absolut Final",
      titleEn: "Absolute Final Deadline",
      descRo:
        "Ultima zi posibilă de depunere a Cererii Unice. După aceasta nu mai e posibilă depunerea.",
      descEn:
        "Last possible day to submit the Single Application. No submission possible afterwards.",
      priority: "HIGH",
      category: "SUBMISSION",
    },
    {
      id: "controls",
      date: `${year}-07-01`,
      endDate: `${year}-08-31`,
      titleRo: "Controale pe Teren",
      titleEn: "Field Inspections",
      descRo:
        "APIA efectuează controale pe teren (minim 5% din cereri). Asigură-te că terenul corespunde declarației.",
      descEn:
        "APIA conducts field inspections (minimum 5% of applications). Ensure your land matches the declaration.",
      priority: "MEDIUM",
      category: "CONTROL",
    },
    {
      id: "advance",
      date: `${year}-10-16`,
      titleRo: "Plăți în Avans (70%)",
      titleEn: "Advance Payments (70%)",
      descRo:
        "Se efectuează plățile în avans: aproximativ 70% din suma totală cuvenită.",
      descEn:
        "Advance payments are made: approximately 70% of the total amount due.",
      priority: "HIGH",
      category: "PAYMENT",
    },
    {
      id: "final_pay",
      date: `${year}-12-01`,
      titleRo: "Plăți Finale",
      titleEn: "Final Payments",
      descRo:
        "Se finalizează plățile rămase (30%). Verifică sumele primite în contul bancar.",
      descEn:
        "Remaining payments (30%) are finalized. Check amounts received in bank account.",
      priority: "HIGH",
      category: "PAYMENT",
    },
    {
      id: "year_end",
      date: `${year}-12-31`,
      titleRo: "Închidere An Agricol",
      titleEn: "Agricultural Year Close",
      descRo:
        "Sfârșitul anului agricol APIA. Pregătește documentele pentru campania următoare.",
      descEn:
        "End of APIA agricultural year. Prepare documents for next campaign.",
      priority: "LOW",
      category: "PREPARATION",
    },
  ];
}

module.exports = { getCalendarEvents };
