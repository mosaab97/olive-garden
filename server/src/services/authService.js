const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const ApiError = require('../utils/apiError');
const loadQuery = require('../utils/loadQuery');

const getUserByEmail = loadQuery('auth', 'getUserByEmail');
const createUser     = loadQuery('auth', 'createUser');

const signAccess  = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
const signRefresh = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

exports.register = async ({ email, password, first_name, last_name, phone }) => {
  const { rows: existing } = await db.query(getUserByEmail, [email]);
  if (existing[0]) throw new ApiError(409, 'Email already in use');

  const password_hash = await bcrypt.hash(password, 12);
  const { rows } = await db.query(createUser, [email, password_hash, first_name, last_name, phone]);
  const user = rows[0];

  const payload = { id: user.id, email: user.email, role: user.role };
  return {
    user,
    accessToken:  signAccess(payload),
    refreshToken: signRefresh(payload),
  };
};

exports.login = async ({ email, password }) => {
  const { rows } = await db.query(getUserByEmail, [email]);
  const user = rows[0];
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError(401, 'Invalid credentials');

  const payload = { id: user.id, email: user.email, role: user.role };
  return {
    user: { id: user.id, email: user.email, first_name: user.first_name, role: user.role },
    accessToken:  signAccess(payload),
    refreshToken: signRefresh(payload),
  };
};

exports.refresh = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(401, 'No refresh token');
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
  return { accessToken: signAccess(payload) };
};
