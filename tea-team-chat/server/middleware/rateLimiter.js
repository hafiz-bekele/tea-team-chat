/**
 * In-memory sliding-window rate limiter for sensitive endpoints
 * (e.g. login, register, password resets)
 */

const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes default
  maxRequests = 10,           // Max 10 attempts per window
  message = 'Too many requests from this IP. Please try again later.'
} = {}) => {
  const ipHits = new Map();

  // Periodically clean up expired entries to avoid memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipHits.entries()) {
      if (now > data.resetTime) {
        ipHits.delete(ip);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    // Determine client IP
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.connection?.remoteAddress || 'unknown-ip';
    const now = Date.now();

    const record = ipHits.get(clientIp);

    if (!record || now > record.resetTime) {
      // Create new window
      ipHits.set(clientIp, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        status: 'error',
        code: 429,
        message,
        retryAfter: `${retryAfterSeconds} seconds`
      });
    }

    // Increment count
    record.count += 1;
    next();
  };
};

module.exports = {
  createRateLimiter,
  authLimiter: createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 15,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
  }),
  apiLimiter: createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 60,
    message: 'Too many API requests. Please slow down.'
  })
};
