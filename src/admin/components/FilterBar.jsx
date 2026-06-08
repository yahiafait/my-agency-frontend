import { IconSearch } from '../icons/AdminIcons';
import { MESSAGE_STATUS } from '../data/messageStatus';
import ExportButton from './ExportButton';
import './FilterBar.css';

/**
 * Filtres statut + recherche + plage de dates + export Excel.
 */
export default function FilterBar({
  statusFilter,
  onStatusFilter,
  search,
  onSearchChange,
  searchPlaceholder = 'Rechercher (nom, email, sujet, message)…',
  dateFrom,
  dateTo,
  onDateFrom,
  onDateTo,
  exportRows,
  loading,
  exportBuildRows,
  exportSheetName,
  exportFileName,
}) {
  const chips = [
    { id: MESSAGE_STATUS.ALL, label: 'Tous' },
    { id: MESSAGE_STATUS.NOUVEAU, label: 'Nouveau' },
    { id: MESSAGE_STATUS.EN_COURS, label: 'En cours' },
    { id: MESSAGE_STATUS.TRAITE, label: 'Traité' },
  ];

  return (
    <div className="admin-filter-bar">
      <div className="admin-filter-bar__chips" role="tablist" aria-label="Filtrer par statut">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={statusFilter === c.id}
            className={`admin-chip${statusFilter === c.id ? ' admin-chip--active' : ''}`}
            onClick={() => onStatusFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="admin-filter-bar__row">
        <div className="admin-filter-bar__search">
          <IconSearch className="admin-filter-bar__search-icon" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Recherche"
          />
        </div>
        <div className="admin-filter-bar__dates">
          <label>
            <span>Du</span>
            <input type="date" value={dateFrom} onChange={(e) => onDateFrom(e.target.value)} />
          </label>
          <label>
            <span>Au</span>
            <input type="date" value={dateTo} onChange={(e) => onDateTo(e.target.value)} />
          </label>
        </div>
        <ExportButton
          rows={exportRows}
          disabled={loading}
          buildSheetRows={exportBuildRows}
          sheetName={exportSheetName}
          fileName={exportFileName}
        />
      </div>
    </div>
  );
}
