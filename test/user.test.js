
import {app} from "../src/application/app.js";
import supertest from "supertest";
import {createTestUser, removeTestUser} from "./test-util.js";
import {logger} from "../src/application/logging.js";

describe('POST /api/users', function () {

    afterEach(async () => {
        await removeTestUser()
    })
    it('should can register new user', async () => {
        const result = await supertest(app)
            .post('/api/users')
            .send({
                username: 'test',
                email: 'test@test.com',
                password: 'test',

            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.email).toBe("test@test.com");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                email: '',
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already registered', async () => {
        let result = await supertest(app)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'test',
                email: 'test@test.com',
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.email).toBe("test@test.com");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(app)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'test',
                email: 'test@test.com',
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if Email already registered', async () => {
        let result = await supertest(app)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'test',
                email: 'test@test.com',
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.email).toBe("test@test.com");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(app)
            .post('/api/users')
            .send({
                username: 'test1',
                password: 'test',
                email: 'test@test.com',
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    describe('POST /api/users/login', function () {
        beforeEach(async () => {
            await createTestUser();
        });

        afterEach(async () => {
            await removeTestUser();
        });

        it('should can login', async () => {
            const result = await supertest(app)
                .post('/api/users/login')
                .send({
                    email : 'test@test.com',
                    password: 'test',
                });

            logger.info(result.body);

            expect(result.status).toBe(200);
            expect(result.body.data.token).toBeDefined();
            expect(result.body.data.token).not.toBe("test");
        });

        it('should reject login if request is invalid', async () => {
            const result = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: "",
                    password: ""
                });

            logger.info(result.body);

            expect(result.status).toBe(400);
            expect(result.body.errors).toBeDefined();
        });

        it('should reject login if password is wrong', async () => {
            const result = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: "test",
                    password: "salah"
                });

            logger.info(result.body);

            expect(result.status).toBe(401);
            expect(result.body.errors).toBeDefined();
        });

        it('should reject login if email is wrong', async () => {
            const result = await supertest(app)
                .post('/api/users/login')
                .send({
                    email: "salah",
                    password: "salah"
                });

            logger.info(result.body);

            expect(result.status).toBe(401);
            expect(result.body.errors).toBeDefined();
        });
    });

    describe('GET /api/users/current', function () {
        beforeEach(async () => {
            await createTestUser();
        });

        afterEach(async () => {
            await removeTestUser();
        });

        it('should can get current user', async () => {
            const result = await supertest(app)
                .get('/api/users/current')
                .set('Authorization', 'test');

            expect(result.status).toBe(200);
            expect(result.body.data.username).toBe('test');
        });

        it('should reject if token is invalid', async () => {
            const result = await supertest(app)
                .get('/api/users/current')
                .set('Authorization', 'salah');

            expect(result.status).toBe(401);
            expect(result.body.errors).toBeDefined();
        });
    })

})

