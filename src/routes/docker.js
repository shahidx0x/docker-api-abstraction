const express = require('express');
const router = express.Router();
const dockerService = require('../services/docker.service');

// System endpoints
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

// Container endpoints
router.get('/containers', async (req, res, next) => {
  try {
    const all = req.query.all === 'true';
    const result = await dockerService.listContainers(all);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id', async (req, res, next) => {
  try {
    const result = await dockerService.getContainerDetails(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/create', async (req, res, next) => {
  try {
    const result = await dockerService.createContainer(req.body);
    res.status(201).json({ success: true, data: result });
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
    const timeout = parseInt(req.query.timeout) || 10;
    await dockerService.stopContainer(req.params.id, timeout);
    res.json({ success: true, message: 'Container stopped successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/containers/:id/restart', async (req, res, next) => {
  try {
    const timeout = parseInt(req.query.timeout) || 10;
    await dockerService.restartContainer(req.params.id, timeout);
    res.json({ success: true, message: 'Container restarted successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/containers/:id', async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    const volumes = req.query.volumes === 'true';
    await dockerService.removeContainer(req.params.id, force, volumes);
    res.json({ success: true, message: 'Container removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/logs', async (req, res, next) => {
  try {
    const stdout = req.query.stdout !== 'false';
    const stderr = req.query.stderr !== 'false';
    const tail = parseInt(req.query.tail) || 100;
    const result = await dockerService.getContainerLogs(req.params.id, stdout, stderr, tail);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/containers/:id/stats', async (req, res, next) => {
  try {
    const stream = req.query.stream === 'true';
    const result = await dockerService.getContainerStats(req.params.id, stream);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Image endpoints
router.get('/images', async (req, res, next) => {
  try {
    const all = req.query.all === 'true';
    const result = await dockerService.listImages(all);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/images/:name', async (req, res, next) => {
  try {
    const result = await dockerService.getImageDetails(req.params.name);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/images/pull', async (req, res, next) => {
  try {
    const { image, tag } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'Image name is required' });
    }
    const result = await dockerService.pullImage(image, tag);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.delete('/images/:name', async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    const result = await dockerService.removeImage(req.params.name, force);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/images/search/:term', async (req, res, next) => {
  try {
    const result = await dockerService.searchImages(req.params.term);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Volume endpoints
router.get('/volumes', async (req, res, next) => {
  try {
    const result = await dockerService.listVolumes();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/volumes/:name', async (req, res, next) => {
  try {
    const result = await dockerService.getVolumeDetails(req.params.name);
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

router.delete('/volumes/:name', async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    await dockerService.removeVolume(req.params.name, force);
    res.json({ success: true, message: 'Volume removed successfully' });
  } catch (error) {
    next(error);
  }
});

// Network endpoints
router.get('/networks', async (req, res, next) => {
  try {
    const result = await dockerService.listNetworks();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/networks/:id', async (req, res, next) => {
  try {
    const result = await dockerService.getNetworkDetails(req.params.id);
    res.json({ success: true, data: result });
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

router.delete('/networks/:id', async (req, res, next) => {
  try {
    await dockerService.removeNetwork(req.params.id);
    res.json({ success: true, message: 'Network removed successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/networks/:id/connect', async (req, res, next) => {
  try {
    const { containerId, ...config } = req.body;
    if (!containerId) {
      return res.status(400).json({ success: false, error: 'Container ID is required' });
    }
    await dockerService.connectContainerToNetwork(req.params.id, containerId, config);
    res.json({ success: true, message: 'Container connected to network successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/networks/:id/disconnect', async (req, res, next) => {
  try {
    const { containerId, force } = req.body;
    if (!containerId) {
      return res.status(400).json({ success: false, error: 'Container ID is required' });
    }
    await dockerService.disconnectContainerFromNetwork(req.params.id, containerId, force);
    res.json({ success: true, message: 'Container disconnected from network successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
