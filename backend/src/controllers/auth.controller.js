const authService = require('../services/auth.service');
const HttpError = require('../utils/HttpError');

function readCredentials(body) {
  const { email, password } = body ?? {};
  if (!email || !password) {
    throw HttpError.badRequest('Email and password are required');
  }
  return { email, password };
}

async function signup(req, res) {
  const { email, password } = readCredentials(req.body);
  const result = await authService.register(email, password);
  res.status(201).json(result);
}

async function login(req, res) {
  const { email, password } = readCredentials(req.body);
  const result = await authService.login(email, password);
  res.json(result);
}

module.exports = { signup, login };
