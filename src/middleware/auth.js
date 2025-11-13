const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Supports both JWT tokens and API keys
 */
const authMiddleware = (req, res, next) => {
  try {
    // Check for API Key in header
    const apiKey = req.headers['x-api-key'];
    const authHeader = req.headers['authorization'];

    // Option 1: API Key Authentication
    if (apiKey) {
      const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
      
      if (validApiKeys.includes(apiKey)) {
        req.authType = 'api-key';
        return next();
      } else {
        return res.status(401).json({
          error: {
            message: 'Invalid API key',
            status: 401
          }
        });
      }
    }

    // Option 2: JWT Token Authentication
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.authType = 'jwt';
        return next();
      } catch (jwtError) {
        return res.status(401).json({
          error: {
            message: 'Invalid or expired token',
            status: 401
          }
        });
      }
    }

    // No valid authentication provided
    return res.status(401).json({
      error: {
        message: 'Authentication required. Provide either X-API-Key header or Bearer token',
        status: 401
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: {
        message: 'Authentication error',
        status: 500
      }
    });
  }
};

module.exports = authMiddleware;
