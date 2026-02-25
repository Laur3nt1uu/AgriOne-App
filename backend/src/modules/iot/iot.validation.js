const { z } = require("zod");

const preprocessToNumber = (v) => {
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : v;
  }
  return v;
};

const numberField = (msg, schema) =>
  z.preprocess(preprocessToNumber, schema || z.number({ message: msg }));

const ingestSchema = z.object({
  sensorCode: z
    .string()
    .min(3, "Codul senzorului trebuie să aibă cel puțin 3 caractere.")
    .max(80, "Codul senzorului este prea lung."),
  temperatureC: numberField(
    "Temperatura trebuie să fie număr.",
    z
      .number({ message: "Temperatura trebuie să fie număr." })
      .min(-50, "Temperatura este prea mică.")
      .max(100, "Temperatura este prea mare.")
  ),
  humidityPct: numberField(
    "Umiditatea trebuie să fie număr.",
    z
      .number({ message: "Umiditatea trebuie să fie număr." })
      .min(0, "Umiditatea nu poate fi sub 0%.")
      .max(100, "Umiditatea nu poate depăși 100%.")
  ),
  recordedAt: z.string().datetime({ message: "Data/ora este invalidă." }).optional(), // ISO
});

module.exports = { ingestSchema };
