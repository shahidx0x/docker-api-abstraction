# Docker API Abstraction - Comprehensive Endpoint Coverage

## Total Endpoints Implemented: 100+

### System Endpoints (6)
- `GET /api/docker/ping` - Check Docker daemon availability
- `GET /api/docker/version` - Get Docker version information
- `GET /api/docker/info` - Get system-wide information
- `GET /api/docker/system/df` - Get data usage information
- `GET /api/docker/events` - Monitor Docker events
- `POST /api/docker/auth` - Authenticate with registry

### Container Endpoints (27)
- `GET /api/docker/containers/json` - List containers
- `POST /api/docker/containers/create` - Create a new container
- `GET /api/docker/containers/:id/json` - Inspect a container
- `GET /api/docker/containers/:id/top` - List processes running inside container
- `GET /api/docker/containers/:id/logs` - Get container logs
- `GET /api/docker/containers/:id/changes` - Get changes on container filesystem
- `GET /api/docker/containers/:id/export` - Export container as tarball
- `GET /api/docker/containers/:id/stats` - Get container resource usage statistics
- `POST /api/docker/containers/:id/resize` - Resize container TTY
- `POST /api/docker/containers/:id/start` - Start a container
- `POST /api/docker/containers/:id/stop` - Stop a container
- `POST /api/docker/containers/:id/restart` - Restart a container
- `POST /api/docker/containers/:id/kill` - Kill a container
- `POST /api/docker/containers/:id/update` - Update container configuration
- `POST /api/docker/containers/:id/rename` - Rename a container
- `POST /api/docker/containers/:id/pause` - Pause a container
- `POST /api/docker/containers/:id/unpause` - Unpause a container
- `POST /api/docker/containers/:id/attach` - Attach to a container
- `POST /api/docker/containers/:id/wait` - Wait for container to stop
- `DELETE /api/docker/containers/:id` - Remove a container
- `HEAD /api/docker/containers/:id/archive` - Get archive info from container
- `GET /api/docker/containers/:id/archive` - Get archive from container
- `PUT /api/docker/containers/:id/archive` - Upload archive to container
- `POST /api/docker/containers/prune` - Delete stopped containers
- `POST /api/docker/containers/:id/exec` - Create an exec instance
- `POST /api/docker/exec/:id/start` - Start an exec instance
- `POST /api/docker/exec/:id/resize` - Resize exec instance TTY
- `GET /api/docker/exec/:id/json` - Inspect exec instance

### Image Endpoints (12)
- `GET /api/docker/images/json` - List images
- `POST /api/docker/build` - Build an image from Dockerfile
- `POST /api/docker/build/prune` - Delete build cache
- `POST /api/docker/images/create` - Pull/import an image
- `GET /api/docker/images/:name/json` - Inspect an image
- `GET /api/docker/images/:name/history` - Get image history
- `POST /api/docker/images/:name/push` - Push image to registry
- `POST /api/docker/images/:name/tag` - Tag an image
- `DELETE /api/docker/images/:name` - Remove an image
- `GET /api/docker/images/search` - Search images on Docker Hub
- `POST /api/docker/images/prune` - Delete unused images
- `POST /api/docker/commit` - Create image from container
- `GET /api/docker/images/:name/get` - Export image as tarball
- `GET /api/docker/images/get` - Export multiple images
- `POST /api/docker/images/load` - Import images from tarball

### Network Endpoints (7)
- `GET /api/docker/networks` - List networks
- `GET /api/docker/networks/:id` - Inspect a network
- `DELETE /api/docker/networks/:id` - Remove a network
- `POST /api/docker/networks/create` - Create a network
- `POST /api/docker/networks/:id/connect` - Connect container to network
- `POST /api/docker/networks/:id/disconnect` - Disconnect container from network
- `POST /api/docker/networks/prune` - Delete unused networks

### Volume Endpoints (5)
- `GET /api/docker/volumes` - List volumes
- `POST /api/docker/volumes/create` - Create a volume
- `GET /api/docker/volumes/:name` - Inspect a volume
- `DELETE /api/docker/volumes/:name` - Remove a volume
- `POST /api/docker/volumes/prune` - Delete unused volumes

### Swarm Endpoints (7)
- `GET /api/docker/swarm` - Inspect swarm
- `POST /api/docker/swarm/init` - Initialize a new swarm
- `POST /api/docker/swarm/join` - Join existing swarm
- `POST /api/docker/swarm/leave` - Leave the swarm
- `POST /api/docker/swarm/update` - Update the swarm
- `GET /api/docker/swarm/unlockkey` - Get unlock key
- `POST /api/docker/swarm/unlock` - Unlock a locked manager

### Service Endpoints (6)
- `GET /api/docker/services` - List services
- `POST /api/docker/services/create` - Create a service
- `GET /api/docker/services/:id` - Inspect a service
- `DELETE /api/docker/services/:id` - Remove a service
- `POST /api/docker/services/:id/update` - Update a service
- `GET /api/docker/services/:id/logs` - Get service logs

### Node Endpoints (4)
- `GET /api/docker/nodes` - List nodes
- `GET /api/docker/nodes/:id` - Inspect a node
- `DELETE /api/docker/nodes/:id` - Remove a node
- `POST /api/docker/nodes/:id/update` - Update a node

### Secret Endpoints (5)
- `GET /api/docker/secrets` - List secrets
- `POST /api/docker/secrets/create` - Create a secret
- `GET /api/docker/secrets/:id` - Inspect a secret
- `DELETE /api/docker/secrets/:id` - Remove a secret
- `POST /api/docker/secrets/:id/update` - Update a secret

### Config Endpoints (5)
- `GET /api/docker/configs` - List configs
- `POST /api/docker/configs/create` - Create a config
- `GET /api/docker/configs/:id` - Inspect a config
- `DELETE /api/docker/configs/:id` - Remove a config
- `POST /api/docker/configs/:id/update` - Update a config

### Task Endpoints (3)
- `GET /api/docker/tasks` - List tasks
- `GET /api/docker/tasks/:id` - Inspect a task
- `GET /api/docker/tasks/:id/logs` - Get task logs

### Plugin Endpoints (11)
- `GET /api/docker/plugins` - List plugins
- `GET /api/docker/plugins/privileges` - Get plugin privileges
- `POST /api/docker/plugins/pull` - Install a plugin
- `GET /api/docker/plugins/:name/json` - Inspect a plugin
- `DELETE /api/docker/plugins/:name` - Remove a plugin
- `POST /api/docker/plugins/:name/enable` - Enable a plugin
- `POST /api/docker/plugins/:name/disable` - Disable a plugin
- `POST /api/docker/plugins/:name/upgrade` - Upgrade a plugin
- `POST /api/docker/plugins/create` - Create a plugin
- `POST /api/docker/plugins/:name/push` - Push plugin to registry
- `POST /api/docker/plugins/:name/set` - Configure a plugin

### Additional Endpoints (2)
- `GET /api/docker/distribution/:name/json` - Get image info from registry
- `POST /api/docker/session` - Start build session

## Authentication

All endpoints require authentication via:
- **API Key**: Add `X-API-Key: eravend-123456` header
- **JWT Token**: Add `Authorization: Bearer <token>` header

## Rate Limiting

All endpoints are rate-limited to 100 requests per 15 minutes per IP/API key.

## Base URL

Production: `https://docker.eravend.net`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "status": 500
}
```

## Stream Endpoints

Some endpoints return streaming data (not JSON):
- Container logs
- Container attach
- Container export
- Image push/pull
- Image export/import
- Service logs
- Task logs
- Build output

These endpoints pipe the stream directly to the response.

## Notes

1. All container/image operations support standard Docker API parameters
2. Filter parameters can be passed as query strings
3. Stream endpoints do not return JSON - they return raw stream data
4. Archive operations (get/put) return/expect tar format
5. Swarm/Service/Node/Secret/Config endpoints require Docker Swarm mode

## Implementation Status

✅ All 100+ Docker Engine API endpoints implemented
✅ Unix socket support for secure local connections
✅ Stream handling for logs, attach, export operations
✅ Proper error handling and response formatting
✅ JWT and API key authentication on all endpoints
✅ Rate limiting protection
✅ Auto-deployed via GitHub Actions
