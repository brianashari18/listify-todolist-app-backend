import {validate} from "../validation/validation.js";
import {createTaskValidation, updateTaskValidation} from "../validation/task-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

const create = async (user, request) => {
    const tasks = validate(createTaskValidation, request)
    return prismaClient.task.create({
        data: {
            name: tasks.name,
            color: tasks.color,
            isShared: true,
            user: {
                connect: {
                    id: user.id,
                }
            }
        }, select: {
            id: true,
            name: true,
            color: true,
        }
    })
}

const addUser = async (request) => {
    const taskId = parseInt(request.params.taskId);
    const accessRights = parseInt(request.body.accessRights);
    const user = await prismaClient.user.findUnique(
        {
            where: {
                email: request.body.email,
            }
        });
    if (!user) {
        throw new ResponseError(404, "User not found");
    }


    const task = await prismaClient.task.findUnique(
        {
            where: {
                id: taskId,
            }
        }
    )

    if (task.createdBy === user.id) {
        throw new ResponseError(400, "user is an owner");
    }

    return prismaClient.userWorkspace.upsert({
        where: {
            email_taskId: {
                email: user.email,
                taskId: taskId,
            },
        },
        update: {
            accessRights: accessRights,
        },
        create: {
            user: { connect: { email: user.email } },
            task: { connect: { id: taskId } },
            accessRights: accessRights,
        },
        select: {
            email: true,
            accessRights: true,
        },
    });

};


const update = async (user, request) => {
    const newData = validate(updateTaskValidation, request.body)
    const id = parseInt(request.params.taskId);

    const userWorkspace = await prismaClient.userWorkspace.findUnique({
        where:{
            email_taskId: {
                email: user.email,
                taskId: id,
        }
        }
    })

    const task = await prismaClient.task.findUnique({
        where: {
            id : userWorkspace.taskId
        }
    })

    if (!userWorkspace && task.createdBy !== user.id) {
        throw new ResponseError(404, "UserWorkspace not found");
    }

    if(userWorkspace){
        if (!task){
            throw new ResponseError(400, "u dont have access rights");
        }
    }else if (task.createdBy !== user.id) {
        throw new ResponseError(403, "u dont have access rights")
    }

    return prismaClient.task.update({
        where: {id},
        data: {
            name: newData.name || task.name,
            color: newData.color || task.color
        }, select: {
            id: true,
            name: true,
            color: true,
        }
    });
};

const get = async (user) => {
    const tasks = await prismaClient.task.findMany({
        where: {
            OR: [
                {createdBy: user.id, isShared: true},
                {
                    userWorkspaces: {
                        some: {email: user.email, accessRights: {in: [1, 2]}},
                    },
                },
            ],
        },
    });

    if (tasks.length === 0) {
        throw new ResponseError(404, "Task not found");
    }

    return tasks;
}

const deleteTaskWorkspace = async (user, request) => {
    const id = parseInt(request.params.taskId);
    const task = await prismaClient.task.findUnique({ where: { id: id } });
    if (!task) {
        throw new ResponseError(404, "Task not found");
    }

    const userWorkspace = await prismaClient.userWorkspace.findUnique({
        where: {
           email_taskId: {
                taskId: id,
                email : request.user.email,
            }
        }

    })

    if (!userWorkspace && task.createdBy !== request.user.id) {
        throw new ResponseError(404, "UserWorkspace not found");
    }

    if(userWorkspace){
        if (userWorkspace.accessRights !== 2){
            throw new ResponseError(403, "u dont have access rights");
        }
    }else if (task.createdBy !== request.user.id) {
        throw new ResponseError(403, "u dont have access rights");
    }

    await prismaClient.userWorkspace.deleteMany({
        where: {
            taskId: id,
        }
    })

    await prismaClient.task.delete({
        where: {
            id: id
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
            email_taskId: {
                taskId: taskId,
                email : user.email
            }
        }
    })
}

const getUserWithAccess = async (request) => {
    const workspace = await prismaClient.userWorkspace.findMany({
        where :{
            taskId : parseInt(request.params.taskId)
        },select : {
            email : true,
            accessRights :true,
        }
    })
    const createdBy = await prismaClient.task.findUnique({
        where: {
            id : parseInt(request.params.taskId)
        },select : {
            createdBy: true
        }
    })
        workspace.push( await prismaClient.user.findUnique({
        where: {
            id : createdBy.createdBy
        },select : {
            email : true,
        }
    }))

    //index terakhir owner
    return workspace;
}

export default {
    create, addUser , update, get, deleteTaskWorkspace, removeUser, getUserWithAccess
}