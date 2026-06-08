import { STATUS_META } from '../data/messageStatus';
import './StatusBadge.css';

/** Badge coloré pour un statut message (Nouveau / En cours / Traité). */
export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: 'new' };
  return (
    <span className={`admin-status-badge admin-status-badge--${meta.tone}`}>
      {meta.label}
    </span>
  );
}
