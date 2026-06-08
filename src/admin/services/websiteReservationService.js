/**
 * Admin — demandes de réservation site (GET/PATCH/DELETE, X-Admin-Key via axiosClient).
 */
import axiosClient from '../../api/axiosClient';

export function getWebsiteReservations() {
  return axiosClient.get('/public-reservations');
}

export function updateReservationStatus(id, status) {
  return axiosClient.patch(`/public-reservations/${id}/status`, { status });
}

export function deleteWebsiteReservation(id) {
  return axiosClient.delete(`/public-reservations/${id}`);
}
