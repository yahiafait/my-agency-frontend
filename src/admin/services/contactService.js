/**
 * Service admin — messages de contact (API Spring Boot /api/contacts).
 * Axios client partagé : headers X-Admin-Key déjà gérés dans axiosClient.
 */
import axiosClient from '../../api/axiosClient';

export function getMessages() {
  return axiosClient.get('/contacts');
}

export function updateStatus(id, status) {
  return axiosClient.patch(`/contacts/${id}/status`, { status });
}

export function deleteMessage(id) {
  return axiosClient.delete(`/contacts/${id}`);
}
