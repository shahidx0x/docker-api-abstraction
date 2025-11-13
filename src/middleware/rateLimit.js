const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware
 * Prevents API abuse by limiting requests per time window
 */
const rateLimitMiddleware = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      status: 429,
      retryAfter: 'Check Retry-After header'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for health check endpoint
  skip: (req) => req.path === '/health',
  // Use API key or IP for identification
  keyGenerator: (req) => {
    return req.headers['x-api-key'] || req.ip;
  }
});

module.exports = rateLimitMiddleware;
