import { IconTrash, IconChevronLeft, IconChevronRight } from '../icons/AdminIcons';
import { STATUS_META } from '../data/messageStatus';
import StatusBadge from './StatusBadge';
import './MessagesTable.css';

function formatApiDate(value) {
  if (value == null || value === '') return '—';
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(value);
}

function formatDateTime(value) {
  if (!value) return '—';
  try {
    const d = Array.isArray(value) ? new Date(value[0], value[1] - 1, value[2], ...(value.slice(3) || [])) : new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('fr-FR');
  } catch {
    return '—';
  }
}

/**
 * Tableau des demandes de réservation site (statut, suppression, pagination).
 */
export default function ReservationsTable({
  rows,
  page,
  pageCount,
  onPageChange,
  onStatusChange,
  onDelete,
  busyId,
  isRowBusy,
}) {
  const rowBusy = (id) => (isRowBusy ? isRowBusy(id) : busyId === id);
  if (!rows.length) {
    return (
      <div className="admin-table-empty">
        <p>Aucune réservation ne correspond à vos filtres.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Réf.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Dates / voyageurs</th>
            <th>Estimation</th>
            <th>Créée le</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td data-label="Réf.">
                <strong>{r.reference}</strong>
              </td>
              <td data-label="Client">
                <strong>{r.displayName}</strong>
                {r.phone ? (
                  <>
                    <br />
                    <span className="admin-table__muted">{r.phone}</span>
                  </>
                ) : null}
              </td>
              <td data-label="Email">
                <a href={`mailto:${r.email}`}>{r.email}</a>
              </td>
              <td data-label="Dates">
                {formatApiDate(r.startDate)} → {formatApiDate(r.endDate)}
                <br />
                <span className="admin-table__muted">{r.guests} voyageur{r.guests > 1 ? 's' : ''}</span>
                {r.travelClassDisplay && (
                  <>
                    <br />
                    <span className="admin-table__muted">{r.travelClassDisplay}</span>
                  </>
                )}
                {(r.destinationId || r.packageId) && (
                  <>
                    <br />
                    <span className="admin-table__muted" title="IDs mock / catalogue">
                      {r.destinationId ? `Dest. #${r.destinationId}` : ''}
                      {r.destinationId && r.packageId ? ' · ' : ''}
                      {r.packageId ? `Pkg #${r.packageId}` : ''}
                    </span>
                  </>
                )}
              </td>
              <td data-label="Estimation">
                {r.estimatedTotal != null
                  ? `${Number(r.estimatedTotal).toLocaleString('fr-FR')} €`
                  : '—'}
              </td>
              <td data-label="Créée le">{formatDateTime(r.createdAt)}</td>
              <td data-label="Statut">
                <StatusBadge status={r.status} />
              </td>
              <td data-label="Actions" className="admin-table__actions">
                <select
                  className="admin-table__select"
                  value={r.status}
                  disabled={rowBusy(r.id)}
                  onChange={(e) => onStatusChange(r.id, e.target.value)}
                  aria-label={`Statut pour ${r.reference}`}
                >
                  {Object.keys(STATUS_META).map((key) => (
                    <option key={key} value={key}>
                      {STATUS_META[key].label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="admin-table__del"
                  disabled={rowBusy(r.id)}
                  onClick={() => onDelete(r)}
                  aria-label={`Supprimer la réservation ${r.reference}`}
                >
                  <IconTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pageCount > 1 && (
        <div className="admin-pagination">
          <button
            type="button"
            className="admin-pagination__btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Page précédente"
          >
            <IconChevronLeft />
          </button>
          <span className="admin-pagination__info">
            Page {page} / {pageCount}
          </span>
          <button
            type="button"
            className="admin-pagination__btn"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            aria-label="Page suivante"
          >
            <IconChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
