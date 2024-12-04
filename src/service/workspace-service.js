import {validate} from "../validation/validation.js";
import {createTaskValidation, updateTaskValidation} from "../validation/task-validation.js";
import {prismaClient} from "../application/database.js";
import {emailValidation} from "../validation/user-validation.js";
import {ResponseError} from "../error/response-error.js";
import user from "nodemailer/lib/smtp-connection/index.js";

const create = async (user,request) => {
    const tasks = validate(createTaskValidation, request)
    return prismaClient.task.create({
        data: {
            name: tasks.name,
            color: tasks.color,
            isShared : true,
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

const addUser = async (request) => {
    const taskId = parseInt(request.params.taskId);
    const accessRights = parseInt(request.body.accessRights);

    const user = await prismaClient.user.findUnique({
        where: {
            email: request.body.email,
        },
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }


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
            user: { connect: { id: user.id } },
            task: { connect: { id: taskId } },
            accessRights: accessRights,
        },
        select: {
            userId: true,
            accessRights: true,
        },
    });

};


const update = async (user,request) => {
    const newData = validate(updateTaskValidation,request.body)
    const id = parseInt(request.params.taskId);

    const userWorkspace = await prismaClient.userWorkspace.findUnique({
        where:{
            userId_taskId: {
                userId: parseInt(request.params.userId),
                taskId: id,
        }
        },select :{
            accessRights: true,
        }
    })

    if (!userWorkspace) {
        throw new ResponseError(404, "UserWorkspace not found")
    }

    if (userWorkspace.accessRights !== 2) {
        throw new ResponseError(403, "U dont have access rights");
    }

    return prismaClient.task.update({
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

const get = async (user) => {
    const tasks = await prismaClient.task.findMany({
        where:{
            user:{
                id: user.id,
            },isShared : true,
        }
    })
    if (tasks.length === 0) {
        throw new ResponseError(404, "Task not found");
    }

    return tasks;
}

const deleteTaskWorkspace = async (request) => {
    const id = parseInt(request.params.taskId);
    const userId = parseInt(request.params.userId);
    const task = await prismaClient.task.findUnique({ where: { id: id } });
    if (!task) {
        throw new ResponseError(404, "Task not found");
    }

    const userWorkspace = await prismaClient.userWorkspace.findUnique({
        where: {
            userId_taskId: {
                taskId: id,
                userId: userId
            }
        }

    })

    if (!userWorkspace && task.createdBy !== userId) {
        throw new ResponseError(404, "UserWorkspace not found");
    }

    if(userWorkspace){
        if (userWorkspace.accessRights !== 2){
            throw new ResponseError(403, "u dont have access rights");
        }
    }else if (task.createdBy !== userId) {
        throw new ResponseError(403, "u dont have access rights");
    }

    await prismaClient.userWorkspace.deleteMany({
        where:{
            taskId : id,
        }
    })

    await prismaClient.task.delete({
        where : {
            id : id
        }
    })
}

const removeUser = async (request) => {
    const taskId = parseInt(request.params.taskId);
    const user = await prismaClient.user.findUnique({
        where: {
            email : request.body.email,
        }
    })
    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    await prismaClient.userWorkspace.delete({
        where: {
            userId_taskId : {
                taskId: taskId,
                userId : user.id
            }
        }
    })
}

export default {
    create, addUser , update, get, deleteTaskWorkspace, removeUser
}