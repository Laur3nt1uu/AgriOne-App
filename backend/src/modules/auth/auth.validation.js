const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Email invalid."),
  username: z
    .string()
    .trim()
    .min(3, "Username-ul trebuie să aibă cel puțin 3 caractere.")
    .max(30, "Username-ul este prea lung.")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username invalid. Folosește litere/cifre și . _ -")
    .optional(),
  name: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(100, "Numele este prea lung.")
    .optional(),
  password: z
    .string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere.")
    .max(72, "Parola este prea lungă."),
});

const loginSchema = z.object({
  email: z.string().email("Email invalid."),
  password: z
    .string()
    .min(1, "Parola este obligatorie.")
    .max(72, "Parola este prea lungă."),
});

const googleLoginSchema = z.object({
  credential: z.string().min(10, "Credential Google invalid."),
  user: z
    .object({
      email: z.string().email().optional(),
      name: z.string().optional(),
      picture: z.string().url().optional(),
    })
    .optional(),
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

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Parola curentă este obligatorie.")
    .max(72, "Parola curentă este prea lungă."),
  newPassword: z
    .string()
    .min(6, "Parola nouă trebuie să aibă cel puțin 6 caractere.")
    .max(72, "Parola nouă este prea lungă."),
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

const changePlanSchema = z.object({
  plan: z.enum(["STARTER", "PRO", "ENTERPRISE"], {
    errorMap: () => ({ message: "Plan invalid." }),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePreferencesSchema,
  changePasswordSchema,
  changePlanSchema,
};
