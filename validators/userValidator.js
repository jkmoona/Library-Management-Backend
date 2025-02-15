const Joi = require("joi");

const createUserValidator = (req, res, next) => {
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

const borrowBookValidator = (req, res, next) => {
    const schema = Joi.object({
        book_id: Joi.number().integer().required().messages({
            "number.base": '"book_id" must be a number',
            "number.integer": '"book_id" must be an integer',
            "any.required": '"book_id" is a required field',
        }),
        user_id: Joi.number().integer().required().messages({
            "number.base": '"user_id" must be a number',
            "number.integer": '"user_id" must be an integer',
            "any.required": '"user_id" is a required field',
        }),
    });

    const { error } = schema.validate(req.params);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const returnBookValidator = (req, res, next) => {
    const schema = Joi.object({
        book_id: Joi.number().integer().required().messages({
            "number.base": '"book_id" must be a number',
            "number.integer": '"book_id" must be an integer',
            "any.required": '"book_id" is a required field',
        }),
        user_id: Joi.number().integer().required().messages({
            "number.base": '"user_id" must be a number',
            "number.integer": '"user_id" must be an integer',
            "any.required": '"user_id" is a required field',
        }),
        score: Joi.number().min(1).max(10).required().messages({
            "number.base": '"score" must be a number',
            "number.min": '"score" must be between 1 and 10',
            "number.max": '"score" must be between 1 and 10',
            "any.required": '"score" is a required field',
        }),
    });

    const { error } = schema.validate({
        ...req.params,
        ...req.body,
    });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    createUserValidator,
    borrowBookValidator,
    returnBookValidator,
};
