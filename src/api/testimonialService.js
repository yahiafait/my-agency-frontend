import axiosClient from './axiosClient';

const testimonialService = {
  getAll: (featured) =>
    axiosClient.get('/testimonials', { params: featured ? { featured: true } : {} }),
};

export default testimonialService;
