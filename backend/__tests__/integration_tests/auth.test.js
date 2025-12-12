const request = require('supertest');
const app = require('../../server');
const pg = require('../../config/testDb');

// Mock the email sending function to prevent actual emails during tests
jest.mock('../../utils/functions', () => ({
    ...jest.requireActual('../../utils/functions'),
    sendEmail: jest.fn().mockResolvedValue({ success: true, messageId: 'test-message-id' })
}));

describe('Authentication Integration Tests', () => {
    beforeAll(async () => {
        await pg.query('DELETE FROM users WHERE user_email LIKE \'%@test.com\'')
    });

    afterAll(async () => {
        await pg.query('DELETE FROM users WHERE user_email LIKE \'%@test.com\'');
        await pg.end();
    });

    describe('POST /auth/register', () => {
        test('should register a new user and send verification email',
            async () => {
                const response = await request(app)
                    .post('/auth/register')
                    .send({
                        email: 'newuser@test.com',
                        user: 'testuser',
                        pwd: 'Test123$@#',
                        phone: '111111111'
                    })
                    .expect(201);

                expect(response.body).toHaveProperty('success')
                expect(response.body.success).toBe('New user created!')
        })

    })

    describe('POST /auth/login', () => {
        test('should get back a 400 for no email or password', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
        
                })
                .expect(400)
        })
    })
})