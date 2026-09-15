import axiosClient from '../../api/axiosClient';

export async function staffLogin(email, password) {
  const { data } = await axiosClient.post('/auth/staff/login', { email, password });
  return data;
}

export async function changeStaffPassword(currentPassword, newPassword) {
  await axiosClient.patch('/auth/staff/password', {
    currentPassword,
    newPassword,
  });
}
