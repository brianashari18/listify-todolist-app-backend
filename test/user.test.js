import { createTestUser, removeTestUser } from "./test-util.js";
import supertest from "supertest";
import { app } from "../src/application/app.js";

describe('User API Unit Tests', () => {
    beforeEach(async () => {
        await removeTestUser();
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    describe('POST /api/users/register', () => {
        it('should successfully register a new user', async () => {
            const response = await supertest(app)
                .post('/api/users/register')
                .send({
                    username: 'newUser',
                    email: 'newuser@test.com',
                    password: 'password',
                    confirmPassword: 'password'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.username).toBe('newUser');
            expect(response.body.data.email).toBe('newuser@test.com');
        });

        it('should fail if passwords do not match', async () => {
            const response = await supertest(app)
                .post('/api/users/register')
                .send({
                    username: 'newUser',
                    email: 'newuser@test.com',
                    password: 'password1',
                    confirmPassword: 'password2'
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should fail if email already exists', async () => {
            const response = await supertest(app)
                .post('/api/users/register')
                .send({
                    username: 'test',
                    email: 'test@test.com',
                    password: 'password',
                    confirmPassword: 'password'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/users/login', () => {
        it('should successfully login a user', async () => {
            const response = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test123456'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.token).toBeDefined();
        });

        it('should fail with incorrect password', async () => {
            const response = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongPassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });

        it('should fail with non-existent email', async () => {
            const response = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'test123456'
                });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/users/forgot-password', () => {
        it('should send OTP for valid email', async () => {
            const response = await supertest(app)
                .post('/api/users/forgot-password')
                .send({
                    email: 'test@test.com'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('OTP has been sent');
        });

        it('should fail for non-existent email', async () => {
            const response = await supertest(app)
                .post('/api/users/forgot-password')
                .send({
                    email: 'nonexistent@test.com'
                });

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('POST /api/users/reset-password', () => {
        it('should successfully reset password', async () => {
            const response = await supertest(app)
                .post('/api/users/reset-password')
                .send({
                    email: 'test@test.com',
                    newPassword: 'newPassword',
                    confirmPassword: 'newPassword'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Reset Successfully');
        });

        it('should fail if passwords do not match', async () => {
            const response = await supertest(app)
                .post('/api/users/reset-password')
                .send({
                    email: 'test@test.com',
                    newPassword: 'newPassword1',
                    confirmPassword: 'newPassword2'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('GET /api/users/current', () => {
        it('should return current user data for valid token', async () => {
            const loginResponse = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test123456'
                });

            const token = loginResponse.body.data.token;

            const response = await supertest(app)
                .get('/api/users/current')
                .set('Authorization', `${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.username).toBe('test');
        });

        it('should fail for invalid token', async () => {
            const response = await supertest(app)
                .get('/api/users/current')
                .set('Authorization', 'Bearer invalidToken');

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('PATCH /api/users/current (Change Password)', () => {
        it('should successfully change the user password', async () => {
            const loginResponse = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test123456'
                });

            const token = loginResponse.body.data.token;

            const response = await supertest(app)
                .patch('/api/users/current')
                .set('Authorization', `${token}`)
                .send({
                    password: 'newPassword',
                    confirmPassword: 'newPassword'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('OK');
        });

        it('should fail if passwords do not match', async () => {
            const loginResponse = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test123456'
                });

            const token = loginResponse.body.data.token;

            const response = await supertest(app)
                .patch('/api/users/current')
                .set('Authorization', `${token}`)
                .send({
                    password: 'newPassword1',
                    confirmPassword: 'newPassword2'
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should fail for unauthorized user', async () => {
            const response = await supertest(app)
                .patch('/api/users/current')
                .send({
                    password: 'newPassword',
                    confirmPassword: 'newPassword'
                });

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
        });
    });

    describe('PATCH /api/users/current/userId (Change Username)', () => {
        it('should successfully change the username', async () => {
            const loginResponse = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test123456'
                });

            const token = loginResponse.body.data.token;

            const response = await supertest(app)
                .patch('/api/users/current/userId')
                .set('Authorization', `${token}`)
                .send({
                    username: 'newUsername'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('OK');
            expect(response.body.data.username).toBe('newUsername');
        });

        it('should fail if username is invalid', async () => {
            const loginResponse = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: 'test@test.com',
                    password: 'test123456'
                });

            const token = loginResponse.body.data.token;

            const response = await supertest(app)
                .patch('/api/users/current/userId')
                .set('Authorization', `${token}`)
                .send({
                    username: '' // Invalid username
                });

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });
    });
});
