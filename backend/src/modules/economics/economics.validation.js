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

const createTransactionSchema = z.object({
  landId: z.string().uuid("Teren invalid.").optional().nullable(), // optional per land
  type: z.enum(["EXPENSE", "REVENUE"], { message: "Tip tranzacție invalid." }),
  category: z
    .string()
    .min(2, "Categoria trebuie să aibă cel puțin 2 caractere.")
    .max(60, "Categoria este prea lungă."),
  description: z.string().max(255, "Descrierea este prea lungă.").optional().nullable(),
  amount: numberField(
    "Suma trebuie să fie număr.",
    z
      .number({ message: "Suma trebuie să fie număr." })
      .positive("Suma trebuie să fie mai mare decât 0.")
  ),
  occurredAt: z.string().datetime({ message: "Data/ora este invalidă." }), // ISO
});

module.exports = { createTransactionSchema };