import Joi from "joi";

const registerUserValidation = Joi.object({
    id: Joi.string().max(191).required(),
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required()
});

export {
    registerUserValidation
}