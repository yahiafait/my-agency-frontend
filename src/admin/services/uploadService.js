import axios from 'axios';
import axiosClient, { TOKEN_STORAGE } from '../../api/axiosClient';

export async function uploadDestinationImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = sessionStorage.getItem(TOKEN_STORAGE);
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const { data } = await axios.post(`${baseURL}/uploads/destination-image`, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return data.url;
}
