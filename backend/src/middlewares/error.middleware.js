const ApiError = require("../utils/ApiError");

function pickSequelizeDetails(err) {
  // Normalize Sequelize error shapes into something frontend-friendly.
  const items = Array.isArray(err?.errors) ? err.errors : [];
  if (!items.length) return null;

  return items.map((e) => ({
    message: e?.message,
    path: e?.path,
    validatorKey: e?.validatorKey,
    type: e?.type,
    value: e?.value,
  }));
}

module.exports = (err, req, res, next) => {
  let status = err instanceof ApiError ? err.status : 500;
  let message = err instanceof ApiError ? err.message : "Internal Server Error";
  let code = err instanceof ApiError ? err.code : null;
  let details = err?.details || null;

  // Sequelize -> consistent API errors
  const seName = err?.name;
  if (!(err instanceof ApiError) && seName) {
    if (seName === "SequelizeUniqueConstraintError") {
      status = 409;
      message = "Conflict";
      code = "DB_UNIQUE_CONSTRAINT";
      details = pickSequelizeDetails(err);
    } else if (seName === "SequelizeValidationError") {
      status = 400;
      message = "Validation error";
      code = "DB_VALIDATION_ERROR";
      details = pickSequelizeDetails(err);
    } else if (seName === "SequelizeForeignKeyConstraintError") {
      status = 409;
      message = "Conflict";
      code = "DB_FOREIGN_KEY_CONSTRAINT";
      details = {
        table: err?.table,
        fields: err?.fields || null,
        index: err?.index || null,
      };
    }
  }

  if (status === 500) console.error(err);

  res.status(status).json({
    error: message,
    code,
    details,
  });
};
