
import Joi from "joi";

const createTaskValidation = Joi.object({
    name: Joi.string().max(100).required(),
    color: Joi.string().max(50).required(),
})


export { createTaskValidation }