const { z } = require("zod");

const validate = (schema) => async (req, res, next) => {
  try {
    // parse + sanitize data
    const data = await schema.parseAsync(req.body);

    // overwrite req.body with validated data
    req.body = data;

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: formattedErrors,
      });
    }

    next(error);
  }
};

module.exports = validate;