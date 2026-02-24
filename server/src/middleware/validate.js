const ApiError = require('../utils/apiError');

// validate(schema) — wraps a Joi schema or similar validator
// Usage: router.post('/', validate(mySchema), controller.create)
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    throw new ApiError(400, message);
  }
  next();
};

module.exports = validate;
