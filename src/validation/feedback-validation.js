import Joi from "joi";

export const createFeedbackValidation = Joi.object({
    feedback: Joi.string().max(255).required(),
    subject: Joi.string().max(100).required(),
    email: Joi.string().max(100).required(),
})

