const bcrypt = require('bcrypt');
const { pool } = require('../config/db');
const HttpError = require('../utils/HttpError');
const { signToken } = require('../utils/tokens');

const SALT_ROUNDS = 10;

async function register(email, password) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw HttpError.conflict('An account with that email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
    [email, passwordHash]
  );

  const user = rows[0];
  return { user, token: signToken(user.id) };
}

async function login(email, password) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );
  const user = rows[0];

  // Same message for unknown email and wrong password so we don't leak which accounts exist.
  const valid = user && (await bcrypt.compare(password, user.password_hash));
  if (!valid) {
    throw HttpError.unauthorized('Invalid email or password');
  }

  return { user: { id: user.id, email: user.email }, token: signToken(user.id) };
}

module.exports = { register, login };
