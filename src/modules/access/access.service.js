const repo = require("./access.repository");
const { buildPagination } = require("../../utils/pagination");

exports.listAvailableBooks = async ({
  userId,
  isAdmin,
  page,
  pageSize,
  order,
  name,
}) => {
  const tierIds = await repo.getUserTierIdsActive({ userId, isAdmin });
  if (!tierIds.length)
    return { totalItems: 0, page: 1, pageSize: pageSize || 10, items: [] };
  const { limit, offset } = buildPagination(page || 1, pageSize || 10);
  return repo.listAvailableBooks({
    tierIds,
    name,
    isAdmin,
    limit,
    offset,
    order,
  });
};
