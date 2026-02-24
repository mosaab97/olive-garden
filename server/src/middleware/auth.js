const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new ApiError(401, 'No token provided');

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws JsonWebTokenError if invalid
  req.user = decoded; // { id, email, role }
  next();
});
