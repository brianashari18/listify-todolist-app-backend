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
            taskId: true
        }
    })
}

const get = async (request) => {
    const taskId = parseInt(request.params.taskId);
    const subtasks = await prismaClient.subTask.findMany({
        where: {
            taskId: taskId,
        },
        select : {
            id: true,
            taskData : true,
            deadline : true,
            status : true,
            taskId: true
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
        },
        select : {
            id: true,
            taskData : true,
            deadline : true,
            status : true,
            taskId: true
        }
    });
}

const deleteSubTask = async (request) => {
    logger.info(request.params.taskId);
    const taskId = parseInt(request.params.taskId);
    const subTaskId = parseInt(request.params.subTaskId);

    const subTask = await prismaClient.subTask.findUnique({
        where: {
            id: subTaskId,
        }
    });

    if (!subTask || subTask.taskId !== taskId) {
        throw new ResponseError(404, "subTask not found");
    }

    await prismaClient.trash.create({
        data: {
            taskId: subTask.taskId,
            subTaskId: subTask.id,
            taskData: subTask.taskData,
            deadline: subTask.deadline,
            status: subTask.status,
        }
    });

    await prismaClient.subTask.delete({
        where: {
            id: subTaskId,
        }
    });

    logger.info(`subTask with ID ${subTaskId} moved to trash`);
};

const restoreSubTask = async (request) => {
    const subTaskId = parseInt(request.params.subTaskId)

    logger.info('subtask id: ' + subTaskId);

    const trashData = await prismaClient.trash.findFirst({
        where: {
            subTaskId: subTaskId,
        }
    });

    if (!trashData) {
        throw new ResponseError(404, "Trash data not found");
    }

    const restoredSubTask = await prismaClient.subTask.create({
        data: {
            taskId: trashData.taskId,
            taskData: trashData.taskData,
            deadline: trashData.deadline,
            status: trashData.status,
        }
    });

    await prismaClient.trash.delete({
        where: {
            id: trashData.id,
        }
    });

    return restoredSubTask;
};

const deletePermanently = async (request) => {
    const subTaskId = parseInt(request.params.subTaskId);

    logger.info(subTaskId);

    const trashData = await prismaClient.trash.findFirst({
        where: {
            subTaskId: subTaskId,
        }, select: {
            id: true
        }
    });

    if (!trashData) {
        throw new ResponseError(404, "Trash data not found");
    }

    await prismaClient.trash.delete({
        where: {
            id: trashData.id,
        }
    });

    logger.info(`Subtask data with ID ${subTaskId} deleted permanently`);
};

const getTrashByUser = async (request) => {
    const userId = parseInt(request.user.id); // Ambil user ID dari token atau session

    // Ambil semua task ID yang dimiliki oleh user
    const userTasks = await prismaClient.task.findMany({
        where: {
            createdBy: userId,
        },
        select: {
            id: true, // Ambil hanya ID task
        }
    });

    if (userTasks.length === 0) {
        throw new ResponseError(404, "No tasks found for the user");
    }

    // Ekstrak task ID
    const taskIds = userTasks.map(task => task.id);

    // Ambil semua data trash yang sesuai dengan task ID tersebut
    const trashData = await prismaClient.trash.findMany({
        where: {
            taskId: { in: taskIds }, // Cocokkan task ID dengan daftar task user
        },
        select: {
            id: true,
            taskId: true,
            subTaskId: true,
            taskData: true,
            deadline: true,
            status: true,
            deletedAt: true,
        }
    });

    if (trashData.length === 0) {
        throw new ResponseError(404, "No trash data found for the user");
    }

    return trashData;
};



export default {
    create,
    get,
    getByName,
    update,
    deleteSubTask,
    restoreSubTask,
    deletePermanently,
    getTrashByUser
};
