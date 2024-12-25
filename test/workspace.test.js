import {app} from "../src/application/app.js";
import supertest from "supertest";
import {
    createTestUser,
    createTestUser2,
    createTestTask,
    removeTestUser,
    removeTestTasks,
    removeWorkspaceUsers,
    addUserToWorkspace
} from "./test-util.js";

let userToken;
let userToken2;
let userId;
let userId2;
let taskId;

describe('Workspace API Integration Tests', () => {
    beforeAll(async () => {
        // Cleanup before tests
        await removeTestUser();
        await removeTestTasks();
        await removeWorkspaceUsers();

        // Create test users
        const user1 = await createTestUser();
        const user2 = await createTestUser2();
        userId = user1.id;
        userId2 = user2.id;

        // Login users
        const loginResponse1 = await supertest(app)
            .post('/api/users/login')
            .send({
                email: 'test@test.com',
                password: 'test123456'
            });

        const loginResponse2 = await supertest(app)
            .post('/api/users/login')
            .send({
                email: 'test@test2.com',
                password: 'test123456'
            });

        userToken = loginResponse1.body.data.token;
        userToken2 = loginResponse2.body.data.token;

        // Create a test task
        const task = await createTestTask(userId);
        taskId = task.id;

        // Add user2 to the workspace
        await addUserToWorkspace('test@test2.com', taskId, 1);
    });

    afterAll(async () => {
        // Cleanup after tests
        await removeWorkspaceUsers();
        await removeTestTasks();
        await removeTestUser();
    });

    describe('POST /api/workspace/tasks', () => {
        it('should create a new task and share it', async () => {
            const response = await supertest(app)
                .post('/api/workspace/tasks')
                .set('Authorization', userToken)
                .send({
                    name: 'Test Workspace Task',
                    color: 'green'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Test Workspace Task');
            expect(response.body.data.color).toBe('green');
        });
    });

    describe('POST /api/workspace/:taskId', () => {
        it('should add a user to a workspace and set access rights', async () => {
            const response = await supertest(app)
                .post(`/api/workspace/${taskId}`)
                .set('Authorization', userToken)
                .send({
                    email: 'test@test2.com',
                    accessRights: 1
                });

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe('test@test2.com');
            expect(response.body.data.accessRights).toBe(1);
        });
    });

    describe('PATCH /api/workspace/:userId/tasks/:taskId', () => {
        it('should update task details in the workspace', async () => {
            const response = await supertest(app)
                .patch(`/api/workspace/${userId}/tasks/${taskId}`)
                .set('Authorization', userToken2)
                .send({
                    name: 'Updated Task Name',
                    color: 'purple'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Task Name');
            expect(response.body.data.color).toBe('purple');
        });
    });

    describe('GET /api/workspace/:userId/tasks', () => {
        it('should retrieve all tasks for a user', async () => {
            const response = await supertest(app)
                .get(`/api/workspace/${userId}/tasks`)
                .set('Authorization', userToken);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('DELETE /api/workspace/:userId/tasks/:taskId', () => {
        it('should delete a task from the workspace', async () => {
            const response = await supertest(app)
                .delete(`/api/workspace/${userId}/tasks/${taskId}`)
                .set('Authorization', userToken);

            expect(response.status).toBe(200);
            expect(response.body.data).toBe('task Deleted Successfully');
        });
    });

    describe('DELETE /api/workspace/:userId/tasks/:taskId/remove', () => {
        it('should remove a user from the workspace', async () => {
            const response = await supertest(app)
                .delete(`/api/workspace/${userId}/tasks/${taskId}/remove`)
                .set('Authorization', userToken)
                .send({
                    email: 'test@test2.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.data).toBe('user Removed Successfully');
        });
    });

    describe('GET /api/workspace/:userId/tasks/:taskId', () => {
        it('should retrieve all users with access to a workspace', async () => {
            const response = await supertest(app)
                .get(`/api/workspace/${userId}/tasks/${taskId}`)
                .set('Authorization', userToken);

            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });
});
