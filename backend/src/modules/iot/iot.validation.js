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
  soilMoisturePct: numberField(
    "Umiditatea solului trebuie să fie număr.",
    z
      .number({ message: "Umiditatea solului trebuie să fie număr." })
      .min(0, "Umiditatea solului nu poate fi sub 0%.")
      .max(100, "Umiditatea solului nu poate depăși 100%.")
  ).optional(),
  recordedAt: z.string().datetime({ message: "Data/ora este invalidă." }).optional(), // ISO
});

const pairBoardSchema = z.object({
  landId: z.string().uuid("ID-ul terenului este invalid."),
  boardCode: z
    .string()
    .min(3, "Codul plăcii Arduino trebuie să aibă cel puțin 3 caractere.")
    .max(80, "Codul plăcii Arduino este prea lung."),
  name: z.string().max(255, "Numele este prea lung.").optional(),
});

const unpairBoardSchema = z
  .object({
    landId: z.string().uuid("ID-ul terenului este invalid.").optional(),
    boardCode: z.string().min(3).max(80).optional(),
  })
  .refine((v) => !!(v.landId || v.boardCode), {
    message: "Trimite landId sau boardCode.",
    path: ["landId"],
  });

module.exports = { ingestSchema, pairBoardSchema, unpairBoardSchema };
