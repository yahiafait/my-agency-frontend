import axiosClient from './axiosClient';

const destinationService = {
  getAll: (featured) =>
    axiosClient.get('/destinations', {
      params: featured ? { featured: true } : {},
    }),

  getById: (id) => axiosClient.get(`/destinations/${id}`),

  create: (data) => axiosClient.post('/destinations', data),

  update: (id, data) => axiosClient.put(`/destinations/${id}`, data),

  remove: (id) => axiosClient.delete(`/destinations/${id}`),
};

export default destinationService;
