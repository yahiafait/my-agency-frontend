import axiosClient from './axiosClient';

const contactService = {
  send: (data) => axiosClient.post('/contacts', data),
  getAll: () => axiosClient.get('/contacts'),
  markAsRead: (id) => axiosClient.patch(`/contacts/${id}/read`),
  updateStatus: (id, status) => axiosClient.patch(`/contacts/${id}/status`, { status }),
  remove: (id) => axiosClient.delete(`/contacts/${id}`),
};

export default contactService;
