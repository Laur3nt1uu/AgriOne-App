const { Op } = require("sequelize");
const ApiError = require("../../utils/ApiError");
const models = require("../../models");
const sequelize = models.sequelize;
let Transaction = models.Transaction || sequelize?.models?.Transaction;
let Land = models.Land || sequelize?.models?.Land;

if (!Transaction && sequelize) {
  const TransactionModel = require("../../models/transaction.model");
  Transaction = TransactionModel(sequelize);
}

if (!Land && sequelize) {
  const LandModel = require("../../models/land.model");
  Land = LandModel(sequelize);
}

async function addTransaction(ownerId, payload) {
  if (!Transaction) throw new ApiError(500, "Transaction model not initialized", null, "TRANSACTION_MODEL_NOT_INITIALIZED");
  if (!Land) throw new ApiError(500, "Land model not initialized", null, "LAND_MODEL_NOT_INITIALIZED");
  if (payload.landId) {
    const land = await Land.findOne({ where: { id: payload.landId, ownerId } });
    if (!land) throw new ApiError(404, "Land not found", null, "LAND_NOT_FOUND");
  }

  return Transaction.create({
    ownerId,
    landId: payload.landId ?? null,
    type: payload.type,
    category: payload.category,
    description: payload.description ?? null,
    amount: payload.amount,
    occurredAt: new Date(payload.occurredAt),
  });
}

async function listTransactions(ownerId, { landId, from, to, limit = 100 }) {
  try {
    const where = { ownerId };

    if (landId) where.landId = landId;
    if (from || to) {
      where.occurredAt = {};
      if (from) where.occurredAt[Op.gte] = new Date(from);
      if (to) where.occurredAt[Op.lte] = new Date(to);
    }

    return await Transaction.findAll({
      where,
      order: [["occurred_at", "DESC"]],
      limit,
    });
  } catch (e) {
    console.error("Economics list failed:", e?.message || e);
    return [];
  }
}

async function summary(ownerId, { landId, from, to }) {
  const txs = await listTransactions(ownerId, { landId, from, to, limit: 5000 });

  let revenue = 0;
  let expense = 0;

  for (const t of txs) {
    const val = Number(t.amount);
    if (t.type === "REVENUE") revenue += val;
    else expense += val;
  }

  return {
    revenue: Number(revenue.toFixed(2)),
    expense: Number(expense.toFixed(2)),
    profit: Number((revenue - expense).toFixed(2)),
    count: txs.length,
  };
}

async function deleteTransaction(ownerId, id) {
  const tx = await Transaction.findOne({ where: { id, ownerId } });
  if (!tx) throw new ApiError(404, "Transaction not found", null, "TRANSACTION_NOT_FOUND");
  await tx.destroy();
}

module.exports = { addTransaction, listTransactions, summary, deleteTransaction };