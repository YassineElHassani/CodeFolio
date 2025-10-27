import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Rate limit for general API requests
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for authentication attempts
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom error handler for rate limit
export const rateLimitErrorHandler = (req: Request, res: Response) => {
  res.status(429).json({
    errors: [{
      message: 'Too many requests, please try again later.',
      extensions: {
        code: 'RATE_LIMIT_EXCEEDED'
      }
    }]
  });
};
