import {prismaClient} from "../application/database.js";
import {createTaskValidation} from "../validation/task-validation.js";
import {validate} from "../validation/validation.js";
import {ResponseError} from "../error/response-error.js";


const create = async (user,request) => {
    const tasks = validate(createTaskValidation, request)
    return  prismaClient.task.create({
        data: {
            name: tasks.name,
            color: tasks.color,
            user: {
            connect: {
                username: user.username,
                }
            }
        },select : {
            id: tasks.id,
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

const update = async (request) => {
        const id = parseInt(request.params.taskId);

        const task = await prismaClient.task.findUnique({ where: { id } });
        if (!task) {
            throw new ResponseError(404, "Task not found")
        }

        return  prismaClient.task.update({
            where: { id },
            data: {
                name: request.body.name || task.name,
                color: request.body.color || task.color
            },select :{
                id: true,
                name : true,
                color : true,
            }
        });
};

const deleteTask = async (request) => {
    const id = parseInt(request.params.taskId);

    const task = await prismaClient.task.findUnique({ where: { id: id } });
    if (!task) {
        throw new ResponseError(404, "Task not found");
    }

    await prismaClient.task.delete({
        where: {
            id: id,
        }
    })
}


export default {
    create,
    get,
    update,
    deleteTask
}
