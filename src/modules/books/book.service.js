const repo = require("./book.repository");
const { buildPagination } = require("../../utils/pagination");

exports.listBooks = async ({ page, pageSize, name, order, isAdmin }) => {
  const { limit, offset } = buildPagination(page, pageSize);
  return repo.listBooks({
    active: isAdmin ? undefined : true,
    name,
    order,
    limit,
    offset,
  });
};

exports.createBook = (data) => repo.createBook(data);
exports.updateBook = (id, data) => repo.updateBook(id, data);
exports.deleteBook = (id) => repo.deleteBook(id);

exports.listBookDetails = ({ bookId, isAdmin }) =>
  repo.listBookDetails({ bookId, onlyActive: !isAdmin });

exports.readBookDetailWithAccess = async ({
  userId,
  bookDetailId,
  isAdmin,
}) => {
  // Check unlock policy
  const rows = await repo.getUnlockRows({ userId, bookDetailId, isAdmin });
  if (!rows.length && !isAdmin)
    throw Object.assign(new Error("Access denied"), { status: 403 });
  const blocked = rows.some((r) => {
    const unlock = new Date(r.start_date);
    unlock.setMinutes(unlock.getMinutes() + r.unlock_delay_minutes);
    return unlock > new Date();
  });
  if (blocked && !isAdmin)
    throw Object.assign(new Error("Book not unlocked yet"), { status: 403 });
  const detail = await repo.getBookDetail(bookDetailId, !isAdmin);
  if (!detail) throw Object.assign(new Error("Not found"), { status: 404 });
  await repo.insertAccessLog({ userId, bookDetailId });
  return detail;
};

exports.createBookDetail = (data) => repo.createBookDetail(data);
exports.updateBookDetail = (id, data) => repo.updateBookDetail(id, data);
exports.deleteBookDetail = (id) => repo.deleteBookDetail(id);
