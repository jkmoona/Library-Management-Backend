const Joi = require("joi");

const createBookValidator = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required().messages({
            "string.empty": '"name" cannot be an empty field',
            "string.min": '"name" should have a minimum length of 3 characters',
            "any.required": '"name" is a required field',
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { createBookValidator };
