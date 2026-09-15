import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getWebsiteReservations,
  updateReservationStatus,
  deleteWebsiteReservation,
} from '../services/websiteReservationService';
import { MESSAGE_STATUS, normalizeWebsiteReservation, STATUS_META } from '../data/messageStatus';
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';
import ReservationsTable from '../components/ReservationsTable';
import './DashboardMessages.css';

const PAGE_SIZE = 8;

function formatApiDateForExport(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(value);
}

function getErrorMessage(err) {
  if (!err.response) {
    return (
      <>
        Impossible de joindre le backend. Vérifiez que Spring Boot tourne sur{' '}
        <strong>http://localhost:8080</strong>.
      </>
    );
  }
  if (err.response.status === 403) {
    return (
      <>
        Accès refusé. Reconnectez-vous sur <Link to="/admin/login">/admin/login</Link>.
      </>
    );
  }
  return err.response.data?.message || `Erreur ${err.response.status}`;
}

export default function DashboardReservations() {
  const [rawReservations, setRawReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [statusFilter, setStatusFilter] = useState(MESSAGE_STATUS.ALL);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const reservations = useMemo(
    () => rawReservations.map(normalizeWebsiteReservation),
    [rawReservations]
  );

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getWebsiteReservations()
      .then((res) => setRawReservations(res.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations.filter((r) => {
      if (statusFilter !== MESSAGE_STATUS.ALL && r.status !== statusFilter) return false;
      if (q) {
        const blob =
          `${r.reference} ${r.displayName} ${r.firstName} ${r.lastName} ${r.email} ${r.phone || ''} ${r.notes || ''}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        d.setHours(0, 0, 0, 0);
        if (dateFrom) {
          const from = new Date(dateFrom);
          if (d < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (d > to) return false;
        }
      }
      return true;
    });
  }, [reservations, statusFilter, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = reservations.length;
    const nouveau = reservations.filter((x) => x.status === MESSAGE_STATUS.NOUVEAU).length;
    const enCours = reservations.filter((x) => x.status === MESSAGE_STATUS.EN_COURS).length;
    const traite = reservations.filter((x) => x.status === MESSAGE_STATUS.TRAITE).length;
    return { total, nouveau, enCours, traite };
  }, [reservations]);

  const pageCount = filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = pageCount === 0 ? 1 : Math.min(page, pageCount);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const exportRows = (rows) =>
    rows.map((r) => ({
      Référence: r.reference,
      Client: r.displayName,
      Email: r.email,
      Téléphone: r.phone || '',
      Départ: formatApiDateForExport(r.startDate),
      Retour: formatApiDateForExport(r.endDate),
      Voyageurs: r.guests,
      Classe: r.travelClassDisplay || r.travelClass || '',
      'Id destination': r.destinationId ?? '',
      'Id package': r.packageId ?? '',
      Notes: r.notes || '',
      'Total estimé (€)': r.estimatedTotal != null ? Number(r.estimatedTotal) : '',
      Statut: STATUS_META[r.status]?.label || r.status,
      Créée: r.createdAt ? new Date(r.createdAt).toLocaleString('fr-FR') : '',
    }));

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    setError(null);
    try {
      const { data } = await updateReservationStatus(id, status);
      setRawReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (r) => {
    if (!window.confirm(`Supprimer la réservation « ${r.reference} » ?`)) return;
    setBusyId(r.id);
    setError(null);
    try {
      await deleteWebsiteReservation(r.id);
      setRawReservations((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-dashboard">
      {error && <div className="admin-dashboard__error">{error}</div>}

      <StatsCards
        total={stats.total}
        nouveau={stats.nouveau}
        enCours={stats.enCours}
        traite={stats.traite}
        totalLabel="Total demandes"
      />

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher (référence, nom, email, téléphone, notes)…"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFrom={setDateFrom}
        onDateTo={setDateTo}
        exportRows={filtered}
        loading={loading}
        exportBuildRows={exportRows}
        exportSheetName="Réservations"
        exportFileName={`mai-tourism-reservations-${new Date().toISOString().slice(0, 10)}.xlsx`}
      />

      {loading ? (
        <p className="admin-dashboard__loading">Chargement des réservations…</p>
      ) : reservations.length === 0 ? (
        <p className="admin-dashboard__empty">
          Aucune demande de réservation en base. Utilisez le formulaire{' '}
          <Link to="/reservation">Réservation</Link>.
        </p>
      ) : (
        <ReservationsTable
          rows={pageRows}
          page={safePage}
          pageCount={pageCount}
          onPageChange={setPage}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          isRowBusy={(id) => busyId === id}
        />
      )}
    </div>
  );
}

