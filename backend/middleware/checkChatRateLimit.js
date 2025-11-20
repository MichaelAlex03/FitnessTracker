const { freeUserLimiter, paidUserLimiter } = require('../config/rateLimiter');

const checkChatRateLimit = async (req, res, next) => {
    try {
        console.log(req.user)
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ "message": "Unauthorized" });

        const limiter = req.user.isPaid ? paidUserLimiter : freeUserLimiter;

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