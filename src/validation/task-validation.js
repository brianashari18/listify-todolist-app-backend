
import Joi from "joi";

const createTaskValidation = Joi.object({
    name: Joi.string().max(100).required(),
    color: Joi.string().max(50).required(),
})


const updateTaskValidation = Joi.object({
    name: Joi.string().max(100).optional(),
    color: Joi.string().max(100).optional(),
})

export { createTaskValidation, updateTaskValidation }