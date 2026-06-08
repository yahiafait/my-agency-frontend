import { IconTrash, IconChevronLeft, IconChevronRight } from '../icons/AdminIcons';
import { STATUS_META } from '../data/messageStatus';
import StatusBadge from './StatusBadge';
import './MessagesTable.css';

/**
 * Tableau des messages avec actions (statut, suppression) et pagination.
 */
export default function MessagesTable({
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
        <p>Aucun message ne correspond à vos filtres.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Sujet</th>
            <th>Message</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id}>
              <td data-label="Nom">
                <strong>{m.name}</strong>
              </td>
              <td data-label="Email">
                <a href={`mailto:${m.email}`}>{m.email}</a>
              </td>
              <td data-label="Téléphone">{m.phone || '—'}</td>
              <td data-label="Sujet">{m.subject}</td>
              <td data-label="Message" className="admin-table__msg" title={m.message}>
                {m.message}
              </td>
              <td data-label="Date">
                {m.createdAt ? new Date(m.createdAt).toLocaleString('fr-FR') : '—'}
              </td>
              <td data-label="Statut">
                <StatusBadge status={m.status} />
              </td>
              <td data-label="Actions" className="admin-table__actions">
                <select
                  className="admin-table__select"
                  value={m.status}
                  disabled={rowBusy(m.id)}
                  onChange={(e) => onStatusChange(m.id, e.target.value)}
                  aria-label={`Statut pour ${m.name}`}
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
                  disabled={rowBusy(m.id)}
                  onClick={() => onDelete(m)}
                  aria-label={`Supprimer le message de ${m.name}`}
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
