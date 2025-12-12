const jwt = require('jsonwebtoken');
const verifyJWT = require('../../middleware/verifyJWT');

describe('verifyJWT middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} }
        res = {
            sendStatus: jest.fn().mockReturnThis()
        }
        next = jest.fn()
        process.env.ACCESS_TOKEN_SECRET = 'test-secret';
    });

    test('should return 401 if no authorization header', () => {
        verifyJWT(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled()
    });

    test('should return 403 for inavlid token', () => {
        verifyJWT({ headers: { 'authorization': 'Bearer invalid-token' } }, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(403)
        expect(next).not.toHaveBeenCalled()
    })
})