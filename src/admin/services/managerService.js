import axiosClient from '../../api/axiosClient';

export async function getManagers() {
  const { data } = await axiosClient.get('/admin/managers');
  return data;
}

export async function createManager(payload) {
  const { data } = await axiosClient.post('/admin/managers', payload);
  return data;
}

export async function updateManager(id, payload) {
  const { data } = await axiosClient.put(`/admin/managers/${id}`, payload);
  return data;
}

export async function deleteManager(id) {
  await axiosClient.delete(`/admin/managers/${id}`);
}
