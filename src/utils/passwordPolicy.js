/** Aligné sur backend PasswordPolicy.java (ADMIN / MANAGER). */

export const STAFF_PASSWORD_RULES_TEXT =
  '8 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial.';

export function isValidStaffPassword(password) {
  if (!password || password.length < 8) return false;
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export function staffPasswordError(password) {
  if (!password) return 'Le mot de passe est requis.';
  if (!isValidStaffPassword(password)) return STAFF_PASSWORD_RULES_TEXT;
  return null;
}

/** Extrait le message d'erreur API (validation ou métier). */
export function extractApiError(err, fallback = 'Une erreur est survenue.') {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (first) return String(first);
  }
  if (data?.message && data.message !== 'Validation failed') {
    return data.message;
  }
  return fallback;
}
