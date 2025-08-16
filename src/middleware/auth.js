const jwt = require('jsonwebtoken');
const { JWT } = require('../config');

module.exports = function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authorization token missing' });
  try {
    req.user = jwt.verify(token, JWT.secret);
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

