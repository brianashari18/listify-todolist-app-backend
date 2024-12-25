import {app} from "../src/application/app.js";
import supertest from "supertest";
import {createTestUser, removeTestUser, createTestTask, removeTestTasks, createTestSubtask, removeTestSubtasks} from "./test-util.js";

let userToken;
let userId;
let taskId;

describe('Subtask API Unit Tests', () => {
    beforeAll(async () => {
        await removeTestUser();
        await removeTestTasks();
        await removeTestSubtasks();
        const user = await createTestUser();
        userId = user.id;

        const loginResponse = await supertest(app)
            .post('/api/users/login')
            .send({
                email: 'test@test.com',
                password: 'test123456'
            });

        userToken = loginResponse.body.data.token;

        const task = await createTestTask(userId);
        taskId = task.id;
    });

    afterAll(async () => {
        await removeTestSubtasks();
        await removeTestTasks();
        await removeTestUser();
    });

    describe('POST /api/tasks/:taskId/subtask', () => {
        it('should create a new subtask', async () => {
            const response = await supertest(app)
                .post(`/api/tasks/${taskId}/subtask`)
                .set('Authorization', `${userToken}`)
                .send({
                    taskData: 'Test Subtask',
                    deadline: '2024-12-31',
                    status: 'pending'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.taskData).toBe('Test Subtask');
            expect(response.body.data.deadline).toBe('2024-12-31T00:00:00.000Z');
            expect(response.body.data.status).toBe('pending');
        });

        it('should fail if subtask data is invalid', async () => {
            const response = await supertest(app)
                .post(`/api/tasks/${taskId}/subtask`)
                .set('Authorization', `${userToken}`)
                .send({
                    taskData: '',
                    deadline: '',
                    status: ''
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/tasks/:taskId/subtask', () => {
        beforeEach(async () => {
            await createTestSubtask(taskId);
        });

        afterEach(async () => {
            await removeTestSubtasks();
        });

        it('should retrieve subtasks for a task', async () => {
            const response = await supertest(app)
                .get(`/api/tasks/${taskId}/subtask`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should return 404 if no subtasks are found', async () => {
            const newTask = await createTestTask(userId);
            const response = await supertest(app)
                .get(`/api/tasks/${newTask.id}/subtask`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/tasks/:taskId/:subTaskId', () => {
        let subTaskId;

        beforeEach(async () => {
            const subtaskResponse = await createTestSubtask(taskId);
            subTaskId = subtaskResponse.id;
        });

        it('should update a subtask', async () => {
            const response = await supertest(app)
                .patch(`/api/tasks/${taskId}/${subTaskId}`)
                .set('Authorization', `${userToken}`)
                .send({
                    taskData: 'Updated Subtask',
                    status: 'completed'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.taskData).toBe('Updated Subtask');
            expect(response.body.data.status).toBe('completed');
        });

        it('should fail if subtask does not exist', async () => {
            const response = await supertest(app)
                .patch(`/api/tasks/${taskId}/99999`)
                .set('Authorization', `${userToken}`)
                .send({
                    taskData: 'Non-existent Subtask'
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('DELETE /api/tasks/:taskId/:subTaskId', () => {
        let subTaskId;

        beforeEach(async () => {
            const subtaskResponse = await createTestSubtask(taskId);
            subTaskId = subtaskResponse.id;
        });

        it('should delete a subtask', async () => {
            const response = await supertest(app)
                .delete(`/api/tasks/${taskId}/${subTaskId}`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('SubTask Deleted Successfully');
        });

        it('should fail if subtask does not exist', async () => {
            const response = await supertest(app)
                .delete(`/api/tasks/${taskId}/99999`)
                .set('Authorization', `${userToken}`);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });
});
