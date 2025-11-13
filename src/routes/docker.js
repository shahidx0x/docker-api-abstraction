const express = require('express');
const router = express.Router();
const dockerService = require('../services/docker.service');

// ============================================
// SYSTEM ENDPOINTS
// ============================================
router.get('/ping', async (req, res, next) => {
  try {
    const result = await dockerService.ping();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/version', async (req, res, next) => {
  try {
    const result = await dockerService.getVersion();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/info', async (req, res, next) => {
  try {
    const result = await dockerService.getSystemInfo();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/system/df', async (req, res, next) => {
  try {
    const result = await dockerService.getDiskUsage();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/events', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/events', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/auth', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/auth', req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CONTAINER ENDPOINTS (27 endpoints)
// ============================================
router.get('/containers/json', async (req, res, next) => {
  try {
    const result = await dockerService.listContainers(req.query.all === 'true', req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/create', async (req, res, next) => {
  try {
    const result = await dockerService.createContainer(req.body, req.query.name);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/json', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/containers/${req.params.id}/json`, null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/top', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/containers/${req.params.id}/top`, null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/logs', async (req, res, next) => {
  try {
    const result = await dockerService.getContainerLogs(
      req.params.id,
      req.query.stdout !== 'false',
      req.query.stderr !== 'false',
      parseInt(req.query.tail) || 100
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/changes', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/containers/${req.params.id}/changes`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/export', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/containers/${req.params.id}/export`, null, null, { responseType: 'stream' });
    res.setHeader('Content-Type', 'application/x-tar');
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/stats', async (req, res, next) => {
  try {
    const result = await dockerService.getContainerStats(req.params.id, req.query.stream !== 'false');
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/resize', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/containers/${req.params.id}/resize`, null, req.query);
    res.json({ success: true, message: 'Container TTY resized successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/start', async (req, res, next) => {
  try {
    await dockerService.startContainer(req.params.id);
    res.json({ success: true, message: 'Container started successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/stop', async (req, res, next) => {
  try {
    await dockerService.stopContainer(req.params.id, parseInt(req.query.t) || 10);
    res.json({ success: true, message: 'Container stopped successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/restart', async (req, res, next) => {
  try {
    await dockerService.restartContainer(req.params.id, parseInt(req.query.t) || 10);
    res.json({ success: true, message: 'Container restarted successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/kill', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/containers/${req.params.id}/kill`, null, req.query);
    res.json({ success: true, message: 'Container killed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/update', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/containers/${req.params.id}/update`, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/rename', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/containers/${req.params.id}/rename`, null, req.query);
    res.json({ success: true, message: 'Container renamed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/pause', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/containers/${req.params.id}/pause`);
    res.json({ success: true, message: 'Container paused successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/unpause', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/containers/${req.params.id}/unpause`);
    res.json({ success: true, message: 'Container unpaused successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/attach', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/containers/${req.params.id}/attach`, null, req.query, { responseType: 'stream' });
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/wait', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/containers/${req.params.id}/wait`, null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/containers/:id', async (req, res, next) => {
  try {
    await dockerService.removeContainer(
      req.params.id,
      req.query.force === 'true',
      req.query.v === 'true'
    );
    res.json({ success: true, message: 'Container removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.head('/containers/:id/archive', async (req, res, next) => {
  try {
    const result = await dockerService.request('HEAD', `/containers/${req.params.id}/archive`, null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/archive', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/containers/${req.params.id}/archive`, null, req.query, { responseType: 'stream' });
    res.setHeader('Content-Type', 'application/x-tar');
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.put('/containers/:id/archive', async (req, res, next) => {
  try {
    await dockerService.request('PUT', `/containers/${req.params.id}/archive`, req.body, req.query);
    res.json({ success: true, message: 'Archive uploaded successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/prune', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/containers/prune', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/exec', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/containers/${req.params.id}/exec`, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/exec/:id/start', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/exec/${req.params.id}/start`, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/exec/:id/resize', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/exec/${req.params.id}/resize`, null, req.query);
    res.json({ success: true, message: 'Exec instance resized successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/exec/:id/json', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/exec/${req.params.id}/json`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ============================================
// IMAGE ENDPOINTS (12 endpoints)
// ============================================
router.get('/images/json', async (req, res, next) => {
  try {
    const result = await dockerService.listImages(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/build', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/build', req.body, req.query, { responseType: 'stream' });
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.post('/build/prune', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/build/prune', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/images/create', async (req, res, next) => {
  try {
    const result = await dockerService.pullImage(req.query.fromImage, req.query.tag);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/images/:name/json', async (req, res, next) => {
  try {
    const result = await dockerService.inspectImage(req.params.name);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/images/:name/history', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/images/${req.params.name}/history`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/images/:name/push', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/images/${req.params.name}/push`, null, req.query, { responseType: 'stream' });
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.post('/images/:name/tag', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/images/${req.params.name}/tag`, null, req.query);
    res.json({ success: true, message: 'Image tagged successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/images/:name', async (req, res, next) => {
  try {
    const result = await dockerService.removeImage(req.params.name, req.query.force === 'true');
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/images/search', async (req, res, next) => {
  try {
    const result = await dockerService.searchImages(req.query.term);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/images/prune', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/images/prune', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/commit', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/commit', req.body, req.query);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/images/:name/get', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/images/${req.params.name}/get`, null, null, { responseType: 'stream' });
    res.setHeader('Content-Type', 'application/x-tar');
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.get('/images/get', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/images/get', null, req.query, { responseType: 'stream' });
    res.setHeader('Content-Type', 'application/x-tar');
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

router.post('/images/load', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/images/load', req.body, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ============================================
// NETWORK ENDPOINTS (7 endpoints)
// ============================================
router.get('/networks', async (req, res, next) => {
  try {
    const result = await dockerService.listNetworks(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/networks/:id', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/networks/${req.params.id}`, null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/networks/:id', async (req, res, next) => {
  try {
    await dockerService.removeNetwork(req.params.id);
    res.json({ success: true, message: 'Network removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/networks/create', async (req, res, next) => {
  try {
    const result = await dockerService.createNetwork(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/networks/:id/connect', async (req, res, next) => {
  try {
    await dockerService.connectNetwork(req.params.id, req.body.Container, req.body.EndpointConfig);
    res.json({ success: true, message: 'Container connected to network successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/networks/:id/disconnect', async (req, res, next) => {
  try {
    await dockerService.disconnectNetwork(req.params.id, req.body.Container, req.body.Force);
    res.json({ success: true, message: 'Container disconnected from network successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/networks/prune', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/networks/prune', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ============================================
// VOLUME ENDPOINTS (5 endpoints)
// ============================================
router.get('/volumes', async (req, res, next) => {
  try {
    const result = await dockerService.listVolumes(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/volumes/create', async (req, res, next) => {
  try {
    const result = await dockerService.createVolume(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/volumes/:name', async (req, res, next) => {
  try {
    const result = await dockerService.inspectVolume(req.params.name);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/volumes/:name', async (req, res, next) => {
  try {
    await dockerService.removeVolume(req.params.name, req.query.force === 'true');
    res.json({ success: true, message: 'Volume removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/volumes/prune', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/volumes/prune', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ============================================
// SWARM ENDPOINTS (6 endpoints)
// ============================================
router.get('/swarm', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/swarm');
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/swarm/init', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/swarm/init', req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/swarm/join', async (req, res, next) => {
  try {
    await dockerService.request('POST', '/swarm/join', req.body);
    res.json({ success: true, message: 'Joined swarm successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/swarm/leave', async (req, res, next) => {
  try {
    await dockerService.request('POST', '/swarm/leave', null, req.query);
    res.json({ success: true, message: 'Left swarm successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/swarm/update', async (req, res, next) => {
  try {
    await dockerService.request('POST', '/swarm/update', req.body, req.query);
    res.json({ success: true, message: 'Swarm updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/swarm/unlockkey', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/swarm/unlockkey');
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/swarm/unlock', async (req, res, next) => {
  try {
    await dockerService.request('POST', '/swarm/unlock', req.body);
    res.json({ success: true, message: 'Swarm unlocked successfully' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// SERVICE ENDPOINTS (6 endpoints)
// ============================================
router.get('/services', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/services', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/services/create', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/services/create', req.body, req.query);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/services/:id', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/services/${req.params.id}`, null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/services/:id', async (req, res, next) => {
  try {
    await dockerService.request('DELETE', `/services/${req.params.id}`);
    res.json({ success: true, message: 'Service removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/services/:id/update', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/services/${req.params.id}/update`, req.body, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/services/:id/logs', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/services/${req.params.id}/logs`, null, req.query, { responseType: 'stream' });
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

// ============================================
// NODE ENDPOINTS (4 endpoints)
// ============================================
router.get('/nodes', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/nodes', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/nodes/:id', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/nodes/${req.params.id}`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/nodes/:id', async (req, res, next) => {
  try {
    await dockerService.request('DELETE', `/nodes/${req.params.id}`, null, req.query);
    res.json({ success: true, message: 'Node removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/nodes/:id/update', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/nodes/${req.params.id}/update`, req.body, req.query);
    res.json({ success: true, message: 'Node updated successfully' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// SECRET ENDPOINTS (5 endpoints)
// ============================================
router.get('/secrets', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/secrets', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/secrets/create', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/secrets/create', req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/secrets/:id', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/secrets/${req.params.id}`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/secrets/:id', async (req, res, next) => {
  try {
    await dockerService.request('DELETE', `/secrets/${req.params.id}`);
    res.json({ success: true, message: 'Secret removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/secrets/:id/update', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/secrets/${req.params.id}/update`, req.body, req.query);
    res.json({ success: true, message: 'Secret updated successfully' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// CONFIG ENDPOINTS (5 endpoints)
// ============================================
router.get('/configs', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/configs', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/configs/create', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/configs/create', req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/configs/:id', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/configs/${req.params.id}`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/configs/:id', async (req, res, next) => {
  try {
    await dockerService.request('DELETE', `/configs/${req.params.id}`);
    res.json({ success: true, message: 'Config removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/configs/:id/update', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/configs/${req.params.id}/update`, req.body, req.query);
    res.json({ success: true, message: 'Config updated successfully' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// TASK ENDPOINTS (3 endpoints)
// ============================================
router.get('/tasks', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/tasks', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/tasks/:id', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/tasks/${req.params.id}`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/tasks/:id/logs', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/tasks/${req.params.id}/logs`, null, req.query, { responseType: 'stream' });
    result.pipe(res);
  } catch (error) {
    next(error);
  }
});

// ============================================
// PLUGIN ENDPOINTS (11 endpoints)
// ============================================
router.get('/plugins', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/plugins', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/plugins/privileges', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', '/plugins/privileges', null, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/pull', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/plugins/pull', req.body, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/plugins/:name/json', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/plugins/${req.params.name}/json`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/plugins/:name', async (req, res, next) => {
  try {
    await dockerService.request('DELETE', `/plugins/${req.params.name}`, null, req.query);
    res.json({ success: true, message: 'Plugin removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/:name/enable', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/plugins/${req.params.name}/enable`, null, req.query);
    res.json({ success: true, message: 'Plugin enabled successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/:name/disable', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/plugins/${req.params.name}/disable`);
    res.json({ success: true, message: 'Plugin disabled successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/:name/upgrade', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', `/plugins/${req.params.name}/upgrade`, req.body, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/create', async (req, res, next) => {
  try {
    await dockerService.request('POST', '/plugins/create', req.body, req.query);
    res.json({ success: true, message: 'Plugin created successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/:name/push', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/plugins/${req.params.name}/push`);
    res.json({ success: true, message: 'Plugin pushed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/plugins/:name/set', async (req, res, next) => {
  try {
    await dockerService.request('POST', `/plugins/${req.params.name}/set`, req.body);
    res.json({ success: true, message: 'Plugin configuration updated successfully' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// DISTRIBUTION ENDPOINT
// ============================================
router.get('/distribution/:name/json', async (req, res, next) => {
  try {
    const result = await dockerService.request('GET', `/distribution/${req.params.name}/json`);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// ============================================
// SESSION ENDPOINT
// ============================================
router.post('/session', async (req, res, next) => {
  try {
    const result = await dockerService.request('POST', '/session', req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
