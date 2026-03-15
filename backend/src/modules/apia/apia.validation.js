const { z } = require("zod");

const LAND_CATEGORIES = [
  "arabil",
  "pasune",
  "faneata",
  "livada",
  "vie",
  "legume",
];

const ECO_SCHEME_TYPES = [
  "biodiversitate",
  "reducere_pesticide",
  "pajisti",
  "conversia_eco",
  "rotatie_culturi",
];

const createApiaParcelSchema = z.object({
  landId: z.string().uuid(),
  tarlaNumber: z.string().max(50).optional().nullable(),
  parcelNumber: z.string().max(50).optional().nullable(),
  sirutaCode: z.string().max(20).optional().nullable(),
  cadastralNumber: z.string().max(100).optional().nullable(),
  landCategory: z.enum(LAND_CATEGORIES).default("arabil"),
  apiaAreaHa: z.number().positive().max(99999999),
  isEcoScheme: z.boolean().default(false),
  ecoSchemeType: z.enum(ECO_SCHEME_TYPES).optional().nullable(),
  youngFarmer: z.boolean().default(false),
  notes: z.string().max(2000).optional().nullable(),
});

const updateApiaParcelSchema = createApiaParcelSchema.partial().omit({ landId: true });

module.exports = {
  createApiaParcelSchema,
  updateApiaParcelSchema,
  LAND_CATEGORIES,
  ECO_SCHEME_TYPES,
};
