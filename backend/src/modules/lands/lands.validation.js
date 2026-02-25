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

const geoJsonPolygon = z.object({
  type: z.literal("Polygon"),
  coordinates: z
    .array(
      z.array(
        z.tuple([
          numberField("Coordonata lng trebuie să fie număr."),
          numberField("Coordonata lat trebuie să fie număr."),
        ])
      )
    )
    .min(1, "Geometria trebuie să conțină cel puțin un inel de coordonate."),
});

const createLandSchema = z.object({
  name: z
    .string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere.")
    .max(255, "Numele este prea lung."),
  cropType: z
    .string()
    .min(2, "Tipul culturii trebuie să aibă cel puțin 2 caractere.")
    .max(100, "Tipul culturii este prea lung."),
  areaHa: numberField(
    "Suprafața (ha) trebuie să fie număr.",
    z
      .number({ message: "Suprafața (ha) trebuie să fie număr." })
      .positive("Suprafața trebuie să fie mai mare decât 0.")
  ),
  centroid: z.object({
    lat: numberField(
      "Latitudinea trebuie să fie număr.",
      z
        .number({ message: "Latitudinea trebuie să fie număr." })
        .min(-90, "Latitudinea minimă este -90.")
        .max(90, "Latitudinea maximă este 90.")
    ),
    lng: numberField(
      "Longitudinea trebuie să fie număr.",
      z
        .number({ message: "Longitudinea trebuie să fie număr." })
        .min(-180, "Longitudinea minimă este -180.")
        .max(180, "Longitudinea maximă este 180.")
    ),
  }),
  geometry: geoJsonPolygon,
});

const updateLandSchema = createLandSchema.partial();

module.exports = { createLandSchema, updateLandSchema };
