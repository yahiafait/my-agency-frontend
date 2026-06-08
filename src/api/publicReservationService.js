/**
 * Demande de réservation publique (POST sans clé admin).
 */
import axiosClient from './axiosClient';

export function submitWebsiteReservation(body) {
  return axiosClient.post('/public-reservations', body);
}
