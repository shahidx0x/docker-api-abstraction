# Docker API Abstraction

## Installation

1. Clone the repository:
```bash
git clone https://github.com/shahidx0x/docker-api-abstraction.git
cd docker-api-abstraction
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables:
```bash
export API_KEYS=your-api-key-here
export JWT_SECRET=your-jwt-secret-here
export NODE_ENV=production
```

4. Run the application:
```bash
npm start
```

## API Documentation

API documentation is available in the `postman/` folder as Postman collection JSON files:

- `Docker_Containers_Only.postman_collection.json` - Container operations
- `images.postman_collection.json` - Image operations
- `networks.postman_collection.json` - Network operations
- `volumes.postman_collection.json` - Volume operations
- `swarm.postman_collection.json` - Swarm operations
- `system.postman_collection.json` - System operations

Import these files into Postman to test the API endpoints.

## Requirements

- Node.js 18+
- Docker daemon running
- Docker socket access (`/var/run/docker.sock`)

## Docker Run

```bash
docker run -d \
  -p 4120:3000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e API_KEYS=eravend-123456 \
  -e JWT_SECRET=eravend-123456 \
  -e NODE_ENV=production \
  --name docker-api-abstraction \
  ghcr.io/shahidx0x/docker-api-abstraction:master
```

## API Endpoints JSON

All endpoints require `X-API-Key: eravend-123456` header.

Example container creation:
```json
{
  "Image": "nginx:latest",
  "Cmd": ["nginx", "-g", "daemon off;"],
  "ExposedPorts": {
    "80/tcp": {}
  },
  "HostConfig": {
    "PortBindings": {
      "80/tcp": [{"HostPort": "8080"}]
    }
  }
```

Example container creation and start (single API call):
```json
{
  "Image": "nginx:latest",
  "Cmd": ["nginx", "-g", "daemon off;"],
  "ExposedPorts": {
    "80/tcp": {}
  },
  "HostConfig": {
    "PortBindings": {
      "80/tcp": [{"HostPort": "8080"}]
    }
  }
```

**Endpoint:** `POST {{baseUrl}}/containers/create-and-start?name=my-container`  
**Description:** Creates and immediately starts a container in one API call

**Endpoint:** `POST {{baseUrl}}/containers/create-start-stop-remove?timeout=30&name=my-container`  
**Description:** Creates, starts, and schedules automatic stop/removal of a container after specified timeout (in seconds)  
**Query Parameters:**  
- `timeout`: Time in seconds before stopping and removing the container (default: 30)  
- `name`: Optional container name  
**Note:** Container will be force-removed with volumes after the timeout period
