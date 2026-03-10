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

const calibrationSchema = z.object({
  tempOffsetC: z
    .number({ invalid_type_error: "Offset temperatura invalid." })
    .finite("Offset temperatura invalid.")
    .min(-20, "Offset temperatura prea mic.")
    .max(20, "Offset temperatura prea mare."),
  humidityOffsetPct: z
    .number({ invalid_type_error: "Offset umiditate invalid." })
    .finite("Offset umiditate invalid.")
    .min(-50, "Offset umiditate prea mic.")
    .max(50, "Offset umiditate prea mare."),
});

module.exports = { createSensorSchema, pairSchema, unpairSchema, calibrationSchema };
