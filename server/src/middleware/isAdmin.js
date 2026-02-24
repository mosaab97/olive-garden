const ApiError = require('../utils/apiError');

module.exports = (req, res, next) => {
  if (req.user?.role !== 'admin') throw new ApiError(403, 'Admin access required');
  next();
};
