module.exports = (role) => (req, res, next) => {
  const roles = req.user?.roles || [];
  if (!roles.includes(role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

