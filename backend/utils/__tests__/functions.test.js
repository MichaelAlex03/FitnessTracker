const { generateVerificationCode, verifyCodeExpiration } = require('../functions');

describe('generateVerificationCode', () => {
    test('should return an 8 digit string', () => {
        const code = generateVerificationCode();
        expect(code).toHaveLength(8)
    })
})

describe('verifyCodeExpiration', () => {
    test('should return a expiration date', () => {
        const expirationDate = verifyCodeExpiration();
        const now = new Date().getTime() + (15 * 60 * 1000)
        expect(expirationDate.getTime()).toBe(now)
    })
})