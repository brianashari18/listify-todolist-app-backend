import {validate} from "../validation/validation.js";
import {createTaskValidation, updateTaskValidation} from "../validation/task-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";
import user from "nodemailer/lib/smtp-connection/index.js";

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


const update = async (user, request) => {
    const newData = validate(updateTaskValidation, request.body)
    const id = parseInt(request.params.taskId);

    // const userWorkspace = await prismaClient.userWorkspace.findUnique({
    //     where:{
    //         userId_taskId: {
    //             userId: parseInt(request.params.userId),
    //             taskId: id,
    //     }
    //     },select :{
    //         accessRights: true,
    //     }
    // })
    //

    const task = await prismaClient.task.findUnique({
        where: {
            id: id, OR: [
                {createdBy: user.id},
                {userWorkspaces: {some: {userId: parseInt(request.params.userId), accessRights: 2}}}
            ]
        },
        select: {
            id: true,
            name: true,
            color: true,
            userWorkspaces: {
                select: {
                    accessRights: true,
                }
            }
        }
    });

    if (!task) {
        throw new ResponseError(400, "U dont have access rights")
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
                        some: {userId: user.id, accessRights: {in: [1, 2]}},
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
    // const task = await prismaClient.task.findUnique({where: {id: id}});
    // if (!task) {
    //     throw new ResponseError(404, "Task not found");
    // }
    //
    // const userWorkspace = await prismaClient.userWorkspace.findUnique({
    //     where: {
    //         userId_taskId: {
    //             userId: parseInt(request.params.userId),
    //             taskId: id,
    //         }
    //     }, select: {
    //         accessRights: true,
    //     }
    // })
    //
    // if (!userWorkspace) {
    //     throw new ResponseError(404, "UserWorkspace not found");
    // }

    const task = await prismaClient.task.findUnique({
        where: {
            id: id, OR: [
                {createdBy: user.id},
                {userWorkspaces: {some: {userId: parseInt(request.params.userId), accessRights: 2}}}
            ]
        },
        select: {
            id: true,
            name: true,
            color: true,
            userWorkspaces: {
                select: {
                    accessRights: true,
                }
            }
        }
    });

    if (!task) {
        throw new ResponseError(400, "U dont have access rights");
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