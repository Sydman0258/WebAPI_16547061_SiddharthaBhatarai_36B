import request from 'supertest';
import app from '../../app';
import UserModel from '../../models/user.model';

describe('Auth API Integration Tests', () => {

    const testUser = {
        fullname: 'Test',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'customer',
        phoneNumber: '9800000000'
    };

    let token: string;

    beforeAll(async () => {
        // Clean test user before running tests
        await UserModel.deleteOne({ email: testUser.email });
        await UserModel.deleteOne({ email: 'another@example.com' });
        await UserModel.deleteOne({ email: 'invalidrole@example.com' });
    });

    afterAll(async () => {
        // Clean test users after tests
        await UserModel.deleteOne({ email: testUser.email });
        await UserModel.deleteOne({ email: 'another@example.com' });
        await UserModel.deleteOne({ email: 'invalidrole@example.com' });
    });

    describe('POST /api/v1/customer/register', () => {

        test('should validate missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/customer/register')
                .send({
                    fullname: testUser.fullname,
                    email: testUser.email,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should register new user', async () => {
            const res = await request(app)
                .post('/api/v1/customer/register')
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Customer Created');
        });

        test('should not register duplicate email', async () => {
            const res = await request(app)
                .post('/api/v1/customer/register')
                .send(testUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should not register duplicate username', async () => {
            const duplicateUser = {
                ...testUser,
                email: 'another@example.com'
            };

            const res = await request(app)
                .post('/api/v1/customer/register')
                .send(duplicateUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should reject invalid role', async () => {
            const invalidUser = {
                ...testUser,
                email: 'invalidrole@example.com',
                username: 'invalidroleuser',
                role: 'admin'
            };

            const res = await request(app)
                .post('/api/v1/customer/register')
                .send(invalidUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should reject invalid email format', async () => {
            const invalidUser = {
                ...testUser,
                email: 'invalid-email',
                username: 'invalidemailuser'
            };

            const res = await request(app)
                .post('/api/v1/customer/register')
                .send(invalidUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/v1/customer/login', () => {

        test('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/customer/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();

            token = res.body.data.token;
        });

        test('should fail with invalid email', async () => {
            const res = await request(app)
                .post('/api/v1/customer/login')
                .send({
                    email: 'wrong@example.com',
                    password: testUser.password,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should fail with wrong password', async () => {
            const res = await request(app)
                .post('/api/v1/customer/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should validate missing password', async () => {
            const res = await request(app)
                .post('/api/v1/customer/login')
                .send({
                    email: testUser.email,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('should validate missing email', async () => {
            const res = await request(app)
                .post('/api/v1/customer/login')
                .send({
                    password: testUser.password,
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/customer/getProfile', () => {

        test('should deny access without token', async () => {
            const res = await request(app)
                .get('/api/v1/customer/getProfile');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test('should get profile with valid token', async () => {
            const res = await request(app)
                .get('/api/v1/customer/getProfile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
        });
    });
});