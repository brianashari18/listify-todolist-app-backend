import {prismaClient} from "../application/database.js";
import {createTaskValidation} from "../validation/task-validation.js";
import {validate} from "../validation/validation.js";
import {ResponseError} from "../error/response-error.js";


const create = async (user,request) => {
    const tasks = validate(createTaskValidation, request)
    await prismaClient.task.create({
        data: {
            name: tasks.name,
            color: tasks.color,
            user: {
            connect: {
                username: user.username,
                }
            }
        }
    })
}

const get = async (user) => {
    const tasks = await prismaClient.task.findMany({
        where:{
            user:{
            username: user.username,
            }
        }
    })
    if (tasks.length === 0) {
        throw new ResponseError(404, "Task not found");
    }

    return tasks;
}

export default {
    create,
    get,
}
