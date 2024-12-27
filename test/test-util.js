import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.userWorkspace.deleteMany({});
    await prismaClient.task.deleteMany({});
    await prismaClient.subTask.deleteMany({});
    await prismaClient.trash.deleteMany({});
    await prismaClient.user.deleteMany({
        where: {
            username: { in: ['test', 'test2'] },
        },
    });
};

export const createTestUser = async () => {
    const user = await prismaClient.user.create({
        data: {
            username: 'test',
            password: await bcrypt.hash("test123456", 10),
            email: 'test@test.com',
            token: 'test',
        },
    });
    console.log('Test user created:', user);
    return user;
};

export const createTestUser2 = async () => {
    const user = await prismaClient.user.create({
        data: {
            username: 'test2',
            password: await bcrypt.hash("test123456", 10),
            email: 'test@test2.com',
            token: 'test',
        },
    });
    console.log('Test user 2 created:', user);
    return user;
};

export const createTestTask = async (userId, name = 'Test Task', color = 'blue', isShared = true) => {
    const task = await prismaClient.task.create({
        data: {
            name: name,
            color: color,
            isShared: isShared,
            createdBy: userId,
        },
    });

    await prismaClient.userWorkspace.create({
        data: {
            email: 'test@test.com',
            taskId: task.id,
            accessRights: 2,
        },
    });

    console.log('Test task created:', task);
    return task;
};

export const removeTestTasks = async () => {
    await prismaClient.task.deleteMany({});
    await prismaClient.trash.deleteMany({});
};

export const createTestSubtask = async (taskId) => {
    const subtask = await prismaClient.subTask.create({
        data: {
            taskData: 'Test Subtask',
            deadline: '2024-12-31T00:00:00.000Z',
            status: 'pending',
            taskId: taskId,
        },
    });
    console.log('Test subtask created:', subtask);
    return subtask;
};

export const removeTestSubtasks = async () => {
    await prismaClient.subTask.deleteMany({});
    await prismaClient.trash.deleteMany({});
};

export const addUserToWorkspace = async (email, taskId, accessRights = 1) => {
    const workspace = await prismaClient.userWorkspace.create({
        data: {
            email: email,
            taskId: taskId,
            accessRights: accessRights,
        },
    });
    console.log('User added to workspace:', workspace);
    return workspace;
};

export const removeWorkspaceUsers = async () => {
    await prismaClient.userWorkspace.deleteMany({});
};

