const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Email invalid."),
  password: z
    .string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere.")
    .max(72, "Parola este prea lungă."),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

const loginSchema = z.object({
  email: z.string().email("Email invalid."),
  password: z
    .string()
    .min(1, "Parola este obligatorie.")
    .max(72, "Parola este prea lungă."),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalid."),
});

const resetPasswordSchema = z.object({
  token: z.string().min(20, "Token invalid."),
  password: z
    .string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere.")
    .max(72, "Parola este prea lungă."),
});

const updatePreferencesSchema = z.object({
  globalLocation: z
    .object({
      name: z.string().trim().max(255, "Numele locației este prea lung.").optional(),
      lat: z
        .number({ invalid_type_error: "Latitudine invalidă." })
        .finite("Latitudine invalidă.")
        .min(-90, "Latitudine invalidă.")
        .max(90, "Latitudine invalidă."),
      lng: z
        .number({ invalid_type_error: "Longitudine invalidă." })
        .finite("Longitudine invalidă.")
        .min(-180, "Longitudine invalidă.")
        .max(180, "Longitudine invalidă."),
    })
    .nullable()
    .optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePreferencesSchema,
};
