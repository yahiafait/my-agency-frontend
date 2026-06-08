import axiosClient from './axiosClient';

const galleryService = {
  getAll: (featured) =>
    axiosClient.get('/gallery', { params: featured ? { featured: true } : {} }),
};

export default galleryService;
