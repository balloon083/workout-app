const jwt = require('jsonwebtoken');

const TOKEN_TTL = '30d';

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

/** Returns the decoded payload, or throws if the token is invalid or expired. */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
