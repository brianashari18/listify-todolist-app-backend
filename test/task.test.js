import {app} from "../src/application/app.js";
import supertest from "supertest";
import {createTestUser, removeTestUser, createTestTask, removeTestTasks} from "./test-util.js";

describe('Task API Unit Tests', () => {
    let userToken;
    let userId;

    beforeAll(async () => {
        await removeTestUser();
        await removeTestTasks();
        const user = await createTestUser();

        const loginResponse = await supertest(app)
            .post('/api/users/login')
            .send({
                email: 'test@test.com',
                password: 'test123456'
            });

        userToken = loginResponse.body.data.token;
        userId = user.id;
    });

    afterAll(async () => {
        await removeTestTasks();
        await removeTestUser();
    });

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const response = await supertest(app)
                .post('/api/tasks')
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Test Task',
                    color: 'red'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Test Task');
            expect(response.body.data.color).toBe('red');
        });

        it('should fail if task data is invalid', async () => {
            const response = await supertest(app)
                .post('/api/tasks')
                .set('Authorization', `${userToken}`)
                .send({
                    name: '',
                    color: ''
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/users/:userId/tasks', () => {
        beforeEach(async () => {
            await createTestTask(userId);
        });

        afterEach(async () => {
            await removeTestTasks();
        });

        it('should retrieve tasks for the current user', async () => {
            const response = await supertest(app)
                .get(`/api/users/${userId}/tasks`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should return 404 if no tasks are found', async () => {
            await removeTestTasks();

            const response = await supertest(app)
                .get(`/api/users/${userId}/tasks`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/users/:userId/tasks/:taskId', () => {
        it('should update a task', async () => {
            const taskResponse = await supertest(app)
                .post('/api/tasks')
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Task to Update',
                    color: 'blue'
                });

            const taskId = taskResponse.body.data.id;

            const response = await supertest(app)
                .patch(`/api/users/${userId}/tasks/${taskId}`)
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Updated Task',
                    color: 'green'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Task');
            expect(response.body.data.color).toBe('green');
        });

        it('should fail if task does not exist', async () => {
            const response = await supertest(app)
                .patch(`/api/users/${userId}/tasks/99999`)
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Non-existent Task',
                    color: 'green'
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('DELETE /api/users/:userId/tasks/:taskId', () => {
        it('should delete a task', async () => {
            const taskResponse = await supertest(app)
                .post('/api/tasks')
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Task to Delete',
                    color: 'yellow'
                });

            const taskId = taskResponse.body.data.id;

            const response = await supertest(app)
                .delete(`/api/users/${userId}/tasks/${taskId}`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toBe('task Deleted Successfully');
        });

        it('should fail if task does not exist', async () => {
            const response = await supertest(app)
                .delete(`/api/users/${userId}/tasks/99999`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/tasks/:taskId', () => {
        it('should add a task to a workspace', async () => {
            const taskResponse = await supertest(app)
                .post('/api/tasks')
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Workspace Task',
                    color: 'purple'
                });

            const taskId = taskResponse.body.data.id;

            const response = await supertest(app)
                .post(`/api/tasks/${taskId}`)
                .set('Authorization', `${userToken}`)
                .send({
                    email: 'test@test.com',
                    accessRights: 1
                });

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe('test@test.com');
            expect(response.body.data.accessRights).toBe(1);
        });

        it('should fail if user email does not exist', async () => {
            const taskResponse = await supertest(app)
                .post('/api/tasks')
                .set('Authorization', `${userToken}`)
                .send({
                    name: 'Workspace Task',
                    color: 'purple'
                });

            const taskId = taskResponse.body.data.id;

            const response = await supertest(app)
                .post(`/api/tasks/${taskId}`)
                .set('Authorization', `${userToken}`)
                .send({
                    email: 'nonexistent@test.com',
                    accessRights: 1
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });
});
