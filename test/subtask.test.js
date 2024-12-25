import { app } from "../src/application/app.js";
import supertest from "supertest";
import {
    createTestUser,
    removeTestUser,
    createTestTask,
    removeTestTasks,
    createTestSubtask,
    removeTestSubtasks,
} from "./test-util.js";

let userToken;
let userId;
let taskId;
let subTaskId;

describe("Subtask API Unit Tests", () => {
    beforeAll(async () => {
        await removeTestUser();
        await removeTestTasks();
        await removeTestSubtasks();
        const user = await createTestUser();
        userId = user.id;

        const loginResponse = await supertest(app)
            .post("/api/users/login")
            .send({
                email: "test@test.com",
                password: "test123456",
            });

        userToken = loginResponse.body.data.token;

        const task = await createTestTask(userId);
        taskId = task.id;

        const subtask = await createTestSubtask(taskId)
        subTaskId = subtask.id
    });

    afterAll(async () => {
        await removeTestSubtasks();
        await removeTestTasks();
        await removeTestUser();
    });

    describe("POST /api/tasks/:taskId/subtask", () => {
        it("should create a new subtask", async () => {
            const response = await supertest(app)
                .post(`/api/tasks/${taskId}/subtask`)
                .set("Authorization", `${userToken}`)
                .send({
                    taskData: "Test Subtask",
                    deadline: "2024-12-31",
                    status: "pending",
                });

            expect(response.status).toBe(200);
            expect(response.body.data.taskData).toBe("Test Subtask");
            expect(response.body.data.deadline).toBe("2024-12-31T00:00:00.000Z");
            expect(response.body.data.status).toBe("pending");

            subTaskId = response.body.data.id;
        });
    });

    describe("GET /api/tasks/:taskId/subtask", () => {
        it("should retrieve all subtasks for a task", async () => {
            const response = await supertest(app)
                .get(`/api/tasks/${taskId}/subtask`)
                .set("Authorization", `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/users/subtask", () => {
        it("should retrieve subtasks by name", async () => {
            const response = await supertest(app)
                .get(`/api/users/subtask`)
                .set("Authorization", `${userToken}`)
                .send({
                    search: "Test Subtask",
                });

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("PATCH /api/tasks/:taskId/:subTaskId", () => {
        it("should update a subtask", async () => {
            const response = await supertest(app)
                .patch(`/api/tasks/${taskId}/${subTaskId}`)
                .set("Authorization", `${userToken}`)
                .send({
                    taskData: "Updated Subtask",
                    status: "completed",
                });

            expect(response.status).toBe(200);
            expect(response.body.data.taskData).toBe("Updated Subtask");
            expect(response.body.data.status).toBe("completed");
        });
    });

    describe("DELETE /api/tasks/:taskId/:subTaskId", () => {
        it("should move a subtask to trash", async () => {
            const response = await supertest(app)
                .delete(`/api/tasks/${taskId}/${subTaskId}`)
                .set("Authorization", `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("SubTask Moved to Trash Successfully");
        });
    });

    describe("POST /api/trash/:subTaskId/restore", () => {
        it("should restore a subtask from trash", async () => {
            const response = await supertest(app)
                .post(`/api/trash/${subTaskId}/restore`)
                .set("Authorization", `${userToken}`);

            expect(response.status).toBe(200);
        });
    });

    describe("DELETE /api/trash/:subTaskId", () => {
        it("should permanently delete a subtask from trash", async () => {
            const subTask = await supertest(app)
                .delete(`/api/tasks/${taskId}/${subTaskId}`)
                .set("Authorization", `${userToken}`);

            const response = await supertest(app)
                .delete(`/api/trash/${subTaskId}`)
                .set("Authorization", `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("subTask Deleted Permanently Successfully");
        });
    });

    describe("GET /api/trash", () => {
        it("should retrieve all trash data for the user", async () => {
            const subTask = await supertest(app)
                .delete(`/api/tasks/${taskId}/${subTaskId}`)
                .set("Authorization", `${userToken}`);

            const response = await supertest(app)
                .get(`/api/trash`)
                .set("Authorization", `${userToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });
});
