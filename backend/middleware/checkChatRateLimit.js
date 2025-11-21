const { freeUserLimiter, paidUserLimiter, redis } = require('../config/rateLimiter');
const { findUser } = require('../model/sql')

const checkChatRateLimit = async (req, res, next) => {
    try {

        const email = req.user.email;
        const userId = req.user.id

        const cacheKey = `user:${userId}:isPaid`;
        let isPaid = await redis.get(cacheKey);

        if (isPaid === null) {

            const user = await pg.findUser(email);
            isPaid = user[0]?.paid_user || false;

            await redis.setex(cacheKey, 300, isPaid.toString());
        } else {
            // Redis returns string, convert to boolean
            isPaid = isPaid === 'true';
        }

        const limiter = isPaid ? paidUserLimiter : freeUserLimiter;

        const { success, remaining, reset } = await limiter.limit(userId);

        if (!success) {
            return res.status(429).json({
                msg: "Rate limit exceeded",
                remaining,
                reset
            });
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "server error" })
    }
}

module.exports = checkChatRateLimit 