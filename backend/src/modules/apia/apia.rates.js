/**
 * APIA subsidy rates for Romania — 2024/2025 campaign.
 * Values are in EUR/ha unless stated otherwise.
 * Source: APIA / MADR published rates (approximate).
 */

const RATES = {
  year: 2025,
  eurToRon: 4.97,

  // SAPS — Schema de plată unică pe suprafață
  saps: {
    perHa: 100,
    label: "SAPS",
  },

  // Plata redistributivă — primele 30 ha
  redistributive: {
    perHa: 5,
    maxHa: 30,
    label: "Plata Redistributivă",
  },

  // Tânăr fermier — max 60 ha
  youngFarmer: {
    perHa: 50,
    maxHa: 60,
    label: "Tânăr Fermier",
  },

  // Eco-scheme-uri (per tip)
  ecoSchemes: {
    biodiversitate: {
      perHa: 42,
      label: "Eco: Biodiversitate",
      applicableTo: ["arabil"],
    },
    reducere_pesticide: {
      perHa: 28,
      label: "Eco: Reducere Pesticide",
      applicableTo: ["arabil", "livada", "vie", "legume"],
    },
    pajisti: {
      perHa: 75,
      label: "Eco: Pajiști și Fânețe",
      applicableTo: ["pasune", "faneata"],
    },
    conversia_eco: {
      perHa: 35,
      label: "Eco: Conversie Ecologică",
      applicableTo: ["arabil", "livada", "vie", "legume"],
    },
    rotatie_culturi: {
      perHa: 22,
      label: "Eco: Rotația Culturilor",
      applicableTo: ["arabil"],
    },
  },

  // Sprijin cuplat — per tip cultură (EUR/ha)
  coupledSupport: {
    Grau: { perHa: 2, label: "Sprijin Cuplat: Grâu" },
    Porumb: { perHa: 1.5, label: "Sprijin Cuplat: Porumb" },
    "Floarea-soarelui": { perHa: 87, label: "Sprijin Cuplat: Floarea-soarelui" },
    Rapita: { perHa: 1, label: "Sprijin Cuplat: Rapiță" },
    Orz: { perHa: 1, label: "Sprijin Cuplat: Orz" },
    Cartof: { perHa: 300, label: "Sprijin Cuplat: Cartof" },
    Legume: { perHa: 450, label: "Sprijin Cuplat: Legume" },
    Sfecla: { perHa: 1300, label: "Sprijin Cuplat: Sfeclă" },
  },

  // Categorii teren
  landCategories: [
    { value: "arabil", label: "Arabil" },
    { value: "pasune", label: "Pășune" },
    { value: "faneata", label: "Fâneață" },
    { value: "livada", label: "Livadă" },
    { value: "vie", label: "Vie" },
    { value: "legume", label: "Legume" },
  ],

  // Tipuri eco-scheme
  ecoSchemeTypes: [
    { value: "biodiversitate", label: "Biodiversitate" },
    { value: "reducere_pesticide", label: "Reducere Pesticide" },
    { value: "pajisti", label: "Pajiști și Fânețe" },
    { value: "conversia_eco", label: "Conversie Ecologică" },
    { value: "rotatie_culturi", label: "Rotația Culturilor" },
  ],
};

module.exports = RATES;
