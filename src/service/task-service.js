import {prismaClient} from "../application/database.js";
import {createTaskValidation, updateTaskValidation} from "../validation/task-validation.js";
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
                id : user.id,
                }
            }
        },select : {
            id: true,
        }
    })
}

const get = async (user) => {
    const tasks = await prismaClient.task.findMany({
        where:{
            user:{
            id: user.id,
            }
        }
    })
    if (tasks.length === 0) {
        throw new ResponseError(404, "Task not found");
    }

    return tasks;
}

const update = async (request) => {
        const newData = validate(updateTaskValidation,request.body)
        const id = parseInt(request.params.taskId);

        const task = await prismaClient.task.findUnique({ where: { id } });
        if (!task) {
            throw new ResponseError(404, "Task not found")
        }

        return  prismaClient.task.update({
            where: { id },
            data: {
                name: newData.name || task.name,
                color: newData.color || task.color
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
