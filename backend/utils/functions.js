const generateVerificationCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString()
}

const verifyCodeExpiration = () => {
    const now = new Date();
    const expirationDate = now.getTime() + (15 * 60 * 1000)
    return new Date(expirationDate)
}

module.exports = {
    generateVerificationCode,
    verifyCodeExpiration
}