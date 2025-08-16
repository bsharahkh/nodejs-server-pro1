module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || undefined;
  return res.status(status).json({ message, details });
};

