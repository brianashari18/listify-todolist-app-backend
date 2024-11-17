import {prismaClient} from "../src/application/database.js";
import {app} from "../src/application/app.js";
import supertest from "supertest";

describe('POST /api/users', function () {

    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                id: 'test'
            }
        })
    })
    it('should can register new user', async () => {
        const result = await supertest(app)
            .post('/api/users')
            .send({
                id: 'test',
                email: 'test@test.com',
                password: 'rahasia',
                name: 'test'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe("test");
        expect(result.body.data.email).toBe("test@test.com");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    });
})
