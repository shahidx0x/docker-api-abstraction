# Docker API Abstraction Layer

A secure Express.js API abstraction layer for Docker API with built-in authentication and rate limiting.

## Features

- 🔒 **Authentication**: Support for both JWT tokens and API keys
- ⚡ **Rate Limiting**: Configurable request rate limits per IP/API key
- 🐳 **Complete Docker API Coverage**: 
  - Container management (list, create, start, stop, restart, remove)
  - Image operations (list, pull, remove, search)
  - Volume management (list, create, remove)
  - Network operations (list, create, remove, connect/disconnect containers)
  - System information and monitoring
- 🛡️ **Security**: Helmet.js, CORS support
- 📝 **Logging**: Morgan request logging
- 🚀 **Easy Configuration**: Environment-based configuration

## Prerequisites

- Node.js (v14 or higher)
- Docker daemon running on your VPS
- Docker API exposed (typically on port 2375)

## Installation

1. Clone the repository:
```bash
git clone git@github.com:shahidx0x/docker-api-abstraction.git
cd docker-api-abstraction
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3000
NODE_ENV=production

# Docker Configuration
DOCKER_HOST=localhost
DOCKER_PORT=2375
DOCKER_API_VERSION=v1.43

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h
API_KEYS=key1,key2,key3

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Usage

### Start the server:

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

### Authentication

The API supports two authentication methods:

#### 1. API Key Authentication
Add the `X-API-Key` header to your requests:

```bash
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/docker/containers
```

#### 2. JWT Token Authentication
Add the `Authorization` header with Bearer token:

```bash
curl -H "Authorization: Bearer your-jwt-token" http://localhost:3000/api/docker/containers
```

## API Endpoints

### System Information

- `GET /health` - Health check (no auth required)
- `GET /api/docker/ping` - Ping Docker daemon
- `GET /api/docker/version` - Get Docker version
- `GET /api/docker/info` - Get system information
- `GET /api/docker/system/df` - Get disk usage

### Containers

- `GET /api/docker/containers` - List containers (query: `?all=true`)
- `GET /api/docker/containers/:id` - Get container details
- `POST /api/docker/containers/create` - Create container
- `POST /api/docker/containers/:id/start` - Start container
- `POST /api/docker/containers/:id/stop` - Stop container (query: `?timeout=10`)
- `POST /api/docker/containers/:id/restart` - Restart container
- `DELETE /api/docker/containers/:id` - Remove container (query: `?force=true&volumes=true`)
- `GET /api/docker/containers/:id/logs` - Get container logs
- `GET /api/docker/containers/:id/stats` - Get container stats

### Images

- `GET /api/docker/images` - List images (query: `?all=true`)
- `GET /api/docker/images/:name` - Get image details
- `POST /api/docker/images/pull` - Pull image (body: `{image, tag}`)
- `DELETE /api/docker/images/:name` - Remove image (query: `?force=true`)
- `GET /api/docker/images/search/:term` - Search images

### Volumes

- `GET /api/docker/volumes` - List volumes
- `GET /api/docker/volumes/:name` - Get volume details
- `POST /api/docker/volumes/create` - Create volume
- `DELETE /api/docker/volumes/:name` - Remove volume (query: `?force=true`)

### Networks

- `GET /api/docker/networks` - List networks
- `GET /api/docker/networks/:id` - Get network details
- `POST /api/docker/networks/create` - Create network
- `DELETE /api/docker/networks/:id` - Remove network
- `POST /api/docker/networks/:id/connect` - Connect container (body: `{containerId}`)
- `POST /api/docker/networks/:id/disconnect` - Disconnect container (body: `{containerId, force}`)

## Examples

### List all containers:
```bash
curl -H "X-API-Key: your-api-key" \
  "http://localhost:3000/api/docker/containers?all=true"
```

### Create and start a container:
```bash
# Create
curl -X POST -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "Image": "nginx:latest",
    "name": "my-nginx"
  }' \
  http://localhost:3000/api/docker/containers/create

# Start (use container ID from create response)
curl -X POST -H "X-API-Key: your-api-key" \
  http://localhost:3000/api/docker/containers/my-nginx/start
```

### Pull an image:
```bash
curl -X POST -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"image": "nginx", "tag": "latest"}' \
  http://localhost:3000/api/docker/images/pull
```

## Security Considerations

1. **Always use HTTPS in production**
2. **Change default JWT_SECRET** to a strong random value
3. **Use strong API keys** and rotate them regularly
4. **Configure rate limits** based on your needs
5. **Secure Docker daemon** - don't expose it publicly without proper security
6. **Use environment variables** for sensitive configuration

## Docker Daemon Configuration

To expose Docker API on your VPS:

### Option 1: TCP Socket (for remote access)
Edit `/etc/docker/daemon.json`:
```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```

### Option 2: Unix Socket (local only, more secure)
```env
DOCKER_SOCKET_PATH=/var/run/docker.sock
```

⚠️ **Warning**: Exposing Docker API without TLS is insecure. Consider using TLS or keeping it localhost-only.

## Rate Limiting

The API includes rate limiting to prevent abuse:
- Default: 100 requests per 15 minutes per IP/API key
- Configurable via environment variables
- Health check endpoint is excluded from rate limiting

## Error Handling

All errors return JSON with the following format:
```json
{
  "error": {
    "message": "Error description",
    "status": 500
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Author

shahidx0x

## Support

For issues and questions, please open an issue on GitHub.
