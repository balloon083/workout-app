const { verifyToken } = require('../utils/tokens');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    req.userId = verifyToken(token).userId;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = requireAuth;
