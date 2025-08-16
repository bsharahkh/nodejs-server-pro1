const repo = require("./user.repository");

exports.getProfile = async (userId) => repo.getProfile(userId);

exports.subscribeToTier = async ({ userId, tierId, isAdmin }) => {
  const tier = await repo.readTier(tierId, !isAdmin);
  if (!tier) throw Object.assign(new Error("Tier not found"), { status: 404 });
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + tier.duration_days);
  await repo.createSubscription({ userId, tierId, startDate, endDate });
  return { message: "Subscribed successfully" };
};

exports.getMySubscriptions = async (userId) => repo.getMySubscriptions(userId);
exports.getMyAccessLog = async (userId) => repo.getMyAccessLog(userId);
