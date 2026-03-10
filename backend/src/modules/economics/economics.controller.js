const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { createTransactionSchema } = require("./economics.validation");
const service = require("./economics.service");
const { Op } = require("sequelize");
const { Transaction, Land, User } = require("../../models");

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
      if (req.user?.role === "ADMIN") {
        const where = {};
        if (landId) where.landId = landId;
        if (from || to) {
          where.occurredAt = {};
          if (from) where.occurredAt[Op.gte] = new Date(from);
          if (to) where.occurredAt[Op.lte] = new Date(to);
        }

        const rows = await Transaction.findAll({
          where,
          include: [
            { model: Land, attributes: ["id", "name"] },
              { model: User, attributes: ["id", "email", "username", "role"] },
          ],
          order: [["occurred_at", "DESC"]],
          limit: limit ? Number(limit) : 200,
        });

        const txs = rows.map((r) => {
          const json = r.toJSON ? r.toJSON() : r;
          const { Land: land, User: owner, ...rest } = json;
          return {
            ...rest,
            land: land ? { id: land.id, name: land.name } : undefined,
            owner: owner ? { id: owner.id, email: owner.email, username: owner.username, role: owner.role } : undefined,
          };
        });

        return res.json({ transactions: txs });
      }

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
      if (req.user?.role === "ADMIN") {
        const where = {};
        if (landId) where.landId = landId;
        if (from || to) {
          where.occurredAt = {};
          if (from) where.occurredAt[Op.gte] = new Date(from);
          if (to) where.occurredAt[Op.lte] = new Date(to);
        }

        const rows = await Transaction.findAll({
          where,
          order: [["occurred_at", "DESC"]],
          limit: 5000,
        });

        let revenue = 0;
        let expense = 0;

        for (const t of rows) {
          const json = t.toJSON ? t.toJSON() : t;
          const val = Number(json.amount);
          if (!Number.isFinite(val)) continue;
          if (json.type === "REVENUE") revenue += val;
          else expense += val;
        }

        return res.json({
          summary: {
            revenue: Number(revenue.toFixed(2)),
            expense: Number(expense.toFixed(2)),
            profit: Number((revenue - expense).toFixed(2)),
            count: rows.length,
          },
        });
      }

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
    if (req.user?.role === "ADMIN") {
      const tx = await Transaction.findByPk(req.params.id);
      if (!tx) throw new ApiError(404, "Transaction not found", null, "TRANSACTION_NOT_FOUND");
      await tx.destroy();
      return res.status(204).send();
    }

    await service.deleteTransaction(req.user.sub, req.params.id);
    return res.status(204).send();
  }),
];

module.exports = { add, list, summary, remove };