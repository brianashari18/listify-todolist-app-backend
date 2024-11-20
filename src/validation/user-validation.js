import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
    username: Joi.string().max(191).required(),
    password: Joi.string().max(100).required()
});

const emailValidation = Joi.object({
    email: Joi.string().max(100).required(),
})

const getUserValidation = Joi.string().max(100).required();


export {
    registerUserValidation,
    loginUserValidation,
    emailValidation,
    getUserValidation,
}