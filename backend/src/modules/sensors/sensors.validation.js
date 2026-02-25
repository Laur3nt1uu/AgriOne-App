const { z } = require("zod");

const createSensorSchema = z.object({
  sensorCode: z
    .string()
    .min(3, "Codul senzorului trebuie să aibă cel puțin 3 caractere.")
    .max(80, "Codul senzorului este prea lung."),
  name: z
    .string()
    .min(1, "Numele nu poate fi gol.")
    .max(255, "Numele este prea lung.")
    .optional(),
});

const pairSchema = z.object({
  sensorCode: z
    .string()
    .min(3, "Codul senzorului trebuie să aibă cel puțin 3 caractere.")
    .max(80, "Codul senzorului este prea lung."),
  landId: z.string().uuid("Teren invalid."),
});

const unpairSchema = z.object({
  sensorCode: z
    .string()
    .min(3, "Codul senzorului trebuie să aibă cel puțin 3 caractere.")
    .max(80, "Codul senzorului este prea lung."),
});

module.exports = { createSensorSchema, pairSchema, unpairSchema };
