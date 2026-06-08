/** Statuts alignés sur l’API Spring Boot (valeurs stables). */

export const MESSAGE_STATUS = {
  ALL: 'ALL',
  NOUVEAU: 'NOUVEAU',
  EN_COURS: 'EN_COURS',
  TRAITE: 'TRAITE',
};

/** Libellés FR pour l’interface admin. */
export const STATUS_META = {
  NOUVEAU: { label: 'Nouveau', tone: 'new' },
  EN_COURS: { label: 'En cours', tone: 'progress' },
  TRAITE: { label: 'Traité', tone: 'done' },
};

/** Compatibilité : anciens enregistrements sans `status` mais avec `read`. */
export function normalizeMessage(msg) {
  const read = msg.read === true || msg.read === 'true';
  const status = msg.status || (read ? MESSAGE_STATUS.TRAITE : MESSAGE_STATUS.NOUVEAU);
  return { ...msg, status, read };
}

const TRAVEL_CLASS_LABELS = {
  PREMIERE_CLASSE: '1ère classe',
  DEUXIEME_CLASSE: '2ème classe',
};

export function travelClassLabel(code) {
  if (!code) return '—';
  return TRAVEL_CLASS_LABELS[code] || code;
}

/** Demande réservation site (API website_reservations). */
export function normalizeWebsiteReservation(row) {
  const status = row.status || MESSAGE_STATUS.NOUVEAU;
  const displayName = `${row.firstName || ''} ${row.lastName || ''}`.trim();
  const travelClassDisplay = travelClassLabel(row.travelClass);
  return { ...row, status, displayName, travelClassDisplay };
}
