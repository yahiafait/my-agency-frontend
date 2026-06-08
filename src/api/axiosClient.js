import axios from 'axios';

const TOKEN_STORAGE = 'mai_tourism_staff_token';
const LEGACY_KEY_STORAGE = 'mai_tourism_admin_key';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_STORAGE);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const legacyKey = sessionStorage.getItem(LEGACY_KEY_STORAGE);
  if (legacyKey && !token) {
    config.headers['X-Admin-Key'] = legacyKey;
  }
  // FormData : laisser le navigateur définir multipart/form-data + boundary
  if (config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete('Content-Type');
    } else {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const hadToken = sessionStorage.getItem(TOKEN_STORAGE);
      if (hadToken && !error.config?.url?.includes('/auth/staff/login')) {
        sessionStorage.removeItem('mai_tourism_staff_session');
        sessionStorage.removeItem(TOKEN_STORAGE);
        error.sessionExpired = true;
      }
    }
    return Promise.reject(error);
  }
);

export { TOKEN_STORAGE, LEGACY_KEY_STORAGE };
export default axiosClient;
