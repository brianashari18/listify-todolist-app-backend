import {prismaClient} from "../application/database.js";
import {createTaskValidation, updateTaskValidation} from "../validation/task-validation.js";
import {validate} from "../validation/validation.js";
import {ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";


const create = async (user,request) => {
    const tasks = validate(createTaskValidation, request)

    logger.info("TEST: " + tasks.name);
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
            name: true,
            color: true,
        }
    })
}

const get = async (user) => {

    const tasks = await prismaClient.task.findMany({
        where:{
            user:{
            id: user.id,
            },isShared : false,
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

const addTaskToWorkspace = async (request) => {
    const taskId = parseInt(request.params.taskId);
    const accessRights = parseInt(request.body.accessRights);
    const user = await prismaClient.user.findUnique(
        { where: {
                email : request.body.email,
            }
        });
    if (!user) {
        throw new ResponseError(404,"user not found");
    }

    await prismaClient.task.update({
        where: {
            id: taskId,
        },data : {
            isShared: true,
        }
    })

    return prismaClient.userWorkspace.upsert({
        where: {
            userId_taskId: {
                userId: user.id,
                taskId: taskId,
            },
        },
        update: {
            accessRights: accessRights,
        },
        create: {
            taskId: taskId,
            userId: user.id,
            accessRights: accessRights,
        },
        select: {
            userId: true,
            accessRights: true,
        },
    });
}


export default {
    create,
    get,
    update,
    deleteTask,
    addTaskToWorkspace
}
