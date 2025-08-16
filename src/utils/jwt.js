const jwt = require('jsonwebtoken');
const { JWT } = require('../config');
exports.sign = (payload, options = {}) => jwt.sign(payload, JWT.secret, { expiresIn: JWT.expiresIn, ...options });

