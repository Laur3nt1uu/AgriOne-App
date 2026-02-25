const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { createTransactionSchema } = require("./economics.validation");
const service = require("./economics.service");

const add = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, "Validation error", parsed.error.flatten(), "VALIDATION_ERROR");
    try {
      const tx = await service.addTransaction(req.user.sub, parsed.data);
      res.status(201).json({ transaction: tx });
    } catch (e) {
      console.error("Economics add failed:", e?.message || e);
      throw new ApiError(503, "Economics unavailable. Did you run DB migrations?", null, "ECONOMICS_UNAVAILABLE");
    }
  }),
];

const list = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { landId, from, to, limit } = req.query;
    try {
      const txs = await service.listTransactions(req.user.sub, {
        landId,
        from,
        to,
        limit: limit ? Number(limit) : 100,
      });
      res.json({ transactions: txs });
    } catch (e) {
      console.error("Economics list failed in controller:", e?.message || e);
      res.json({ transactions: [] });
    }
  }),
];

const summary = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { landId, from, to } = req.query;
    try {
      const s = await service.summary(req.user.sub, { landId, from, to });
      res.json({ summary: s });
    } catch (e) {
      console.error("Economics summary failed in controller:", e?.message || e);
      res.json({ summary: { revenue: 0, expense: 0, profit: 0, count: 0 } });
    }
  }),
];

const remove = [
  requireAuth,
  asyncHandler(async (req, res) => {
    await service.deleteTransaction(req.user.sub, req.params.id);
    res.status(204).send();
  }),
];

module.exports = { add, list, summary, remove };