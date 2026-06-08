import * as XLSX from 'xlsx';
import { IconDownload } from '../icons/AdminIcons';
import { STATUS_META } from '../data/messageStatus';
import './ExportButton.css';

/**
 * Export Excel (SheetJS) des lignes visibles (après filtres).
 * Par défaut : colonnes messages contact ; sinon `buildSheetRows(rows)`.
 */
export default function ExportButton({
  rows,
  disabled,
  buildSheetRows,
  sheetName = 'Messages',
  fileName,
}) {
  const handleExport = () => {
    if (!rows?.length) return;
    const data = buildSheetRows
      ? buildSheetRows(rows)
      : rows.map((m) => ({
          Nom: m.name,
          Email: m.email,
          Téléphone: m.phone || '',
          Sujet: m.subject,
          Message: m.message,
          Statut: STATUS_META[m.status]?.label || m.status,
          Date: m.createdAt ? new Date(m.createdAt).toLocaleString('fr-FR') : '',
        }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const name =
      fileName || `mai-tourism-messages-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, name);
  };

  return (
    <button
      type="button"
      className="admin-export-btn"
      onClick={handleExport}
      disabled={disabled || !rows?.length}
    >
      <IconDownload />
      Exporter vers Excel
    </button>
  );
}
