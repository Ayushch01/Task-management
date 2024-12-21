import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  keyGenerator: function (req) {
    return req["user"].userId || req.ip
  },
  handler: function (req, res, next) {
    res.status(429).json({
      message: "Too many requests, please try again later.",
    });
  },
});


export default limiter