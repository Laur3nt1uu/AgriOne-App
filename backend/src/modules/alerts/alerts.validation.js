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

const upsertRuleSchema = z.object({
  landId: z.string().uuid("Teren invalid."),
  enabled: z.boolean().optional(),

  tempMin: numberField(
    "Temperatura minimă trebuie să fie număr.",
    z
      .number({ message: "Temperatura minimă trebuie să fie număr." })
      .min(-50, "Temperatura minimă este prea mică.")
      .max(100, "Temperatura minimă este prea mare.")
  )
    .optional()
    .nullable(),
  tempMax: numberField(
    "Temperatura maximă trebuie să fie număr.",
    z
      .number({ message: "Temperatura maximă trebuie să fie număr." })
      .min(-50, "Temperatura maximă este prea mică.")
      .max(100, "Temperatura maximă este prea mare.")
  )
    .optional()
    .nullable(),

  humMin: numberField(
    "Umiditatea minimă trebuie să fie număr.",
    z
      .number({ message: "Umiditatea minimă trebuie să fie număr." })
      .min(0, "Umiditatea minimă nu poate fi sub 0%.")
      .max(100, "Umiditatea minimă nu poate depăși 100%.")
  )
    .optional()
    .nullable(),
  humMax: numberField(
    "Umiditatea maximă trebuie să fie număr.",
    z
      .number({ message: "Umiditatea maximă trebuie să fie număr." })
      .min(0, "Umiditatea maximă nu poate fi sub 0%.")
      .max(100, "Umiditatea maximă nu poate depăși 100%.")
  )
    .optional()
    .nullable(),
});

module.exports = { upsertRuleSchema };