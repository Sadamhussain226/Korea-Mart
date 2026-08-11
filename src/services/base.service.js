import { axiosClient } from '../api';

/**
 * Base Service Abstraction Layer
 */
export class BaseService {
  constructor(resourceEndpoint) {
    this.endpoint = resourceEndpoint;
  }

  async getAll(params = {}) {
    return axiosClient.get(this.endpoint, { params });
  }

  async getById(id) {
    return axiosClient.get(`${this.endpoint}/${id}`);
  }

  async create(payload) {
    return axiosClient.post(this.endpoint, payload);
  }

  async update(id, payload) {
    return axiosClient.put(`${this.endpoint}/${id}`, payload);
  }

  async delete(id) {
    return axiosClient.delete(`${this.endpoint}/${id}`);
  }
}
