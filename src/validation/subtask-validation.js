import Joi from "joi";

const createSubTaskValidation = Joi.object({
    taskData: Joi.string().max(255).required(),
    deadline: Joi.any().required(),
    status: Joi.string().required(),
})

const updateSubTaskValidation = Joi.object({
    taskData: Joi.string().max(255).required(),
    deadline: Joi.any().optional(),
    status: Joi.string().optional(),
})

export {
    createSubTaskValidation,updateSubTaskValidation
};