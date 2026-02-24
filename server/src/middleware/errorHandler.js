const ApiError = require('../utils/apiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({ message: 'Duplicate entry — a record with this value already exists' });
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ message: 'Referenced record does not exist' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({ message: 'Internal server error' });
};
