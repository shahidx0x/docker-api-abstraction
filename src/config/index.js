module.exports = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },
  docker: {
    host: process.env.DOCKER_HOST || 'localhost',
    port: process.env.DOCKER_PORT || '2375',
    apiVersion: process.env.DOCKER_API_VERSION || 'v1.43',
    socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : []
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};
