const { Ratelimit } = require("@upstash/ratelimit");
const { Redis } = require("@upstash/redis")

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const freeUserLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(10, "24 h")
})

const paidUserLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(1000, "12 h")
})

module.exports = { freeUserLimiter, paidUserLimiter, redis };