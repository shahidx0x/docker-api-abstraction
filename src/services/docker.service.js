const axios = require('axios');
const http = require('http');

class DockerService {
  constructor() {
    // Always use Unix socket for Docker communication
    this.socketPath = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    this.apiVersion = process.env.DOCKER_API_VERSION || 'v1.43';
    this.baseURL = `http://localhost/${this.apiVersion}`;
    
    // Configure axios to use Unix socket
    this.axiosConfig = {
      socketPath: this.socketPath,
      httpAgent: new http.Agent({ socketPath: this.socketPath })
    };
  }

  /**
   * Make a request to Docker API
   */
  async request(method, endpoint, data = null, params = {}, additionalConfig = {}) {
    try {
      const config = {
        method,
        url: `${this.baseURL}${endpoint}`,
        params,
        headers: {
          'Content-Type': 'application/json'
        },
        ...this.axiosConfig,
        ...additionalConfig
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      
      // For stream responses, return the stream directly
      if (additionalConfig.responseType === 'stream') {
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      throw {
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
        details: error.response?.data
      };
    }
  }

  // Container operations
  async listContainers(all = false) {
    return this.request('GET', '/containers/json', null, { all });
  }

  async getContainerDetails(id) {
    return this.request('GET', `/containers/${id}/json`);
  }

  async createContainer(config) {
    return this.request('POST', '/containers/create', config);
  }

  async startContainer(id) {
    return this.request('POST', `/containers/${id}/start`);
  }

  async stopContainer(id, timeout = 10) {
    return this.request('POST', `/containers/${id}/stop`, null, { t: timeout });
  }

  async restartContainer(id, timeout = 10) {
    return this.request('POST', `/containers/${id}/restart`, null, { t: timeout });
  }

  async removeContainer(id, force = false, volumes = false) {
    return this.request('DELETE', `/containers/${id}`, null, { force, v: volumes });
  }

  async getContainerLogs(id, stdout = true, stderr = true, tail = 100) {
    return this.request('GET', `/containers/${id}/logs`, null, {
      stdout,
      stderr,
      tail,
      timestamps: true
    });
  }

  async getContainerStats(id, stream = false) {
    return this.request('GET', `/containers/${id}/stats`, null, { stream });
  }

  // Image operations
  async listImages(all = false) {
    return this.request('GET', '/images/json', null, { all });
  }

  async getImageDetails(name) {
    return this.request('GET', `/images/${name}/json`);
  }

  async pullImage(imageName, tag = 'latest') {
    return this.request('POST', '/images/create', null, {
      fromImage: imageName,
      tag
    });
  }

  async pullImageStream(imageName, tag = 'latest') {
    return this.request('POST', '/images/create', null, {
      fromImage: imageName,
      tag
    }, { responseType: 'stream' });
  }

  async removeImage(name, force = false) {
    return this.request('DELETE', `/images/${name}`, null, { force });
  }

  async searchImages(term) {
    return this.request('GET', '/images/search', null, { term });
  }

  // Volume operations
  async listVolumes() {
    return this.request('GET', '/volumes');
  }

  async getVolumeDetails(name) {
    return this.request('GET', `/volumes/${name}`);
  }

  async createVolume(config) {
    return this.request('POST', '/volumes/create', config);
  }

  async removeVolume(name, force = false) {
    return this.request('DELETE', `/volumes/${name}`, null, { force });
  }

  // Network operations
  async listNetworks() {
    return this.request('GET', '/networks');
  }

  async getNetworkDetails(id) {
    return this.request('GET', `/networks/${id}`);
  }

  async createNetwork(config) {
    return this.request('POST', '/networks/create', config);
  }

  async removeNetwork(id) {
    return this.request('DELETE', `/networks/${id}`);
  }

  async connectContainerToNetwork(networkId, containerId, config = {}) {
    return this.request('POST', `/networks/${networkId}/connect`, {
      Container: containerId,
      ...config
    });
  }

  async disconnectContainerFromNetwork(networkId, containerId, force = false) {
    return this.request('POST', `/networks/${networkId}/disconnect`, {
      Container: containerId,
      Force: force
    });
  }

  // System operations
  async getSystemInfo() {
    return this.request('GET', '/info');
  }

  async getVersion() {
    return this.request('GET', '/version');
  }

  async ping() {
    return this.request('GET', '/_ping');
  }

  async getEvents(since, until, filters = {}) {
    return this.request('GET', '/events', null, { since, until, filters: JSON.stringify(filters) });
  }

  async getDiskUsage() {
    return this.request('GET', '/system/df');
  }
}

module.exports = new DockerService();
