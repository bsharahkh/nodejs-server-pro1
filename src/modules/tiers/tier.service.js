const repo = require("./tier.repository");
const { buildPagination } = require("../../utils/pagination");

exports.create = (data) => repo.createTier(data);
exports.update = (id, data) => repo.updateTier(id, data);
exports.remove = (id) => repo.deleteTier(id);
exports.list = async ({ page, pageSize, name, order }) => {
  const { limit, offset } = buildPagination(page, pageSize);
  return repo.listTiers({ name, order, limit, offset });
};
exports.upsertAccess = (data) => repo.upsertTierAccess(data);
exports.getSubsAdmin = async (query) => {
  const { limit, offset } = require("../../utils/pagination").buildPagination(
    query.page,
    query.pageSize
  );
  return repo.getUserSubscriptionsAdmin({
    email: query.email,
    tier: query.tier,
    user_id: query.user_id,
    limit,
    offset,
    order: query.order || "desc",
  });
};
exports.getLogsAdmin = async (query) => {
  const { limit, offset } = require("../../utils/pagination").buildPagination(
    query.page,
    query.pageSize
  );
  return repo.getAccessLogsAdmin({
    email: query.email,
    book: query.book,
    user_id: query.user_id,
    limit,
    offset,
    order: query.order || "desc",
  });
};
