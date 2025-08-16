exports.buildPagination = (page = 1, pageSize = 50) => {
  const p = Math.max(parseInt(page, 10) || 1, 1);
  const s = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 1000);
  return { limit: s, offset: (p - 1) * s, page: p, pageSize: s };
};
