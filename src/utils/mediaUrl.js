/** Origine du serveur API (sans /api) pour les fichiers uploadés. */
export function getApiOrigin() {
  const configured = process.env.REACT_APP_MEDIA_URL;
  if (configured) return configured.replace(/\/$/, '');
  const api = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  return api.replace(/\/api\/?$/, '');
}

/**
 * Résout une URL d'image : uploads backend, chemins /images du site, ou URL absolue.
 */
export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) return `${getApiOrigin()}${url}`;
  return url;
}
