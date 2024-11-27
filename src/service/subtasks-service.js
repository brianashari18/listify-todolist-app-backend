import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import {validate} from "../validation/validation.js";
import {createSubTaskValidation, updateSubTaskValidation} from "../validation/subtask-validation.js";
import {logger} from "../application/logging.js";

const create = async (request) => {
    const data = validate(createSubTaskValidation,request.body);
    const taskId = parseInt(request.params.taskId);
    const task = prismaClient.task.findUnique({
        where: {
            taskId: taskId,
        },select : {
            id: true,
        }
    })

    if (!task) {
        throw new ResponseError(404, "Task not found");
    }

    return prismaClient.subTask.create({
        data : {
            taskData : data.taskData,
            deadline : data.deadline,
            status : data.status,
            taskId: taskId,

        },
        select : {
            id: true,
            taskData : true,
            deadline : true,
            status : true,

        }
    })
}

const get = async (request) => {
    const taskId = parseInt(request.params.taskId);
    const subtasks = await prismaClient.subTask.findMany({
        where: {
            taskId: taskId,
        }
    })

    if (subtasks.length === 0) {
        throw new ResponseError(404, "subTask not found");
    }

    return subtasks;
}

const getByName = async (request) => {
    const search = request.body.search;

    const subtask = await prismaClient.subTask.findMany({
        where: {
            name: {
                contains: search,
                mode: 'insensitive'
            },
        }
    })

    if (subtask.length === 0) {
        throw new ResponseError(404, "subTask not found");
    }

    return subtask;
}

const update = async (request) => {
    const newData = validate(updateSubTaskValidation,request.body);
    const taskId = parseInt(request.params.taskId);
    const subTaskId = parseInt(request.params.subTaskId);
    const subTask = await prismaClient.subTask.findUnique({
        where: {
            taskId: taskId,
            id: subTaskId,
        }
    })

    if (!subTask) {
        throw new ResponseError(404, "subTask not found");
    }

    return prismaClient.subTask.update({
        where : {
            id: subTaskId,
        },data : {
            taskData : newData.taskData || subTask.taskData,
            deadline : newData.deadline || subTask.deadline,
            status : newData.status || subTask.status,
        },select : {
            taskData : true,
            deadline : true,
            status : true,
        }
    });
}

const deleteSubTask = async (request) => {
    logger.info(request.params.taskId);
    const taskId = parseInt(request.params.taskId);
    const subTaskId = parseInt(request.params.subTaskId);
    const subTask = await prismaClient.subTask.findUnique({
        where: {
            taskId: taskId,
            id: subTaskId,
        }
    })

    if (!subTask) {
        throw new ResponseError(404, "subTask not found");
    }

    await prismaClient.subTask.delete({
        where: {
            id: subTaskId,
        }
    })
}

export default {
    create,get, getByName, update, deleteSubTask
}