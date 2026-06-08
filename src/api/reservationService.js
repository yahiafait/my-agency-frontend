import axiosClient from './axiosClient';

const reservationService = {
  getAll: () => axiosClient.get('/reservations'),
  getMine: () => axiosClient.get('/reservations/me'),
  create: (data) => axiosClient.post('/reservations', data),
  updateStatus: (id, status) =>
    axiosClient.patch(`/reservations/${id}/status`, null, { params: { status } }),
  remove: (id) => axiosClient.delete(`/reservations/${id}`),
};

export default reservationService;
