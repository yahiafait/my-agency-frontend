import axiosClient from './axiosClient';

const packageService = {
  getAll: (params = {}) => axiosClient.get('/packages', { params }),
  getById: (id) => axiosClient.get(`/packages/${id}`),
  create: (data) => axiosClient.post('/packages', data),
  update: (id, data) => axiosClient.put(`/packages/${id}`, data),
  remove: (id) => axiosClient.delete(`/packages/${id}`),
};

export default packageService;
