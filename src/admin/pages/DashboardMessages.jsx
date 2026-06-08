import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages, updateStatus, deleteMessage } from '../services/contactService';
import {
  getWebsiteReservations,
  updateReservationStatus,
  deleteWebsiteReservation,
} from '../services/websiteReservationService';
import { MESSAGE_STATUS, normalizeMessage, normalizeWebsiteReservation, STATUS_META } from '../data/messageStatus';
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';
import MessagesTable from '../components/MessagesTable';
import ReservationsTable from '../components/ReservationsTable';
import './DashboardMessages.css';

const PAGE_SIZE = 8;
const TAB_CONTACT = 'contact';
const TAB_RESERVATIONS = 'reservations';

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
        Accès refusé. Reconnectez-vous sur{' '}
        <Link to="/admin/login">/admin/login</Link>.
      </>
    );
  }
  return err.response.data?.message || `Erreur ${err.response.status}`;
}

/** Page dashboard : messages contact et demandes de réservation site (même espace). */
export default function DashboardMessages() {
  const [tab, setTab] = useState(TAB_CONTACT);

  const [rawMessages, setRawMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessages, setErrorMessages] = useState(null);
  const [busyMessage, setBusyMessage] = useState(null);

  const [rawReservations, setRawReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [errorReservations, setErrorReservations] = useState(null);
  const [busyReservation, setBusyReservation] = useState(null);

  const [statusFilter, setStatusFilter] = useState(MESSAGE_STATUS.ALL);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const messages = useMemo(() => rawMessages.map(normalizeMessage), [rawMessages]);
  const reservations = useMemo(
    () => rawReservations.map(normalizeWebsiteReservation),
    [rawReservations]
  );

  const loadMessages = useCallback(() => {
    setLoadingMessages(true);
    setErrorMessages(null);
    getMessages()
      .then((res) => {
        setRawMessages(res.data || []);
      })
      .catch((err) => {
        setErrorMessages(getErrorMessage(err));
      })
      .finally(() => setLoadingMessages(false));
  }, []);

  const loadReservations = useCallback(() => {
    setLoadingReservations(true);
    setErrorReservations(null);
    getWebsiteReservations()
      .then((res) => {
        setRawReservations(res.data || []);
      })
      .catch((err) => {
        setErrorReservations(getErrorMessage(err));
      })
      .finally(() => setLoadingReservations(false));
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  /** Recharge à chaque ouverture de l’onglet (évite une liste vide après une nouvelle réservation). */
  useEffect(() => {
    if (tab === TAB_RESERVATIONS) {
      loadReservations();
    }
  }, [tab, loadReservations]);

  useEffect(() => {
    setPage(1);
  }, [tab, statusFilter, search, dateFrom, dateTo]);

  const activeRows = tab === TAB_CONTACT ? messages : reservations;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (tab === TAB_CONTACT) {
      return messages.filter((m) => {
        if (statusFilter !== MESSAGE_STATUS.ALL && m.status !== statusFilter) return false;
        if (q) {
          const blob = `${m.name} ${m.email} ${m.phone || ''} ${m.subject} ${m.message}`.toLowerCase();
          if (!blob.includes(q)) return false;
        }
        if (m.createdAt) {
          const d = new Date(m.createdAt);
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
    }
    return reservations.filter((r) => {
      if (statusFilter !== MESSAGE_STATUS.ALL && r.status !== statusFilter) return false;
      if (q) {
        const blob = `${r.reference} ${r.displayName} ${r.firstName} ${r.lastName} ${r.email} ${r.phone || ''} ${r.notes || ''}`.toLowerCase();
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
  }, [tab, messages, reservations, statusFilter, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = activeRows.length;
    const nouveau = activeRows.filter((x) => x.status === MESSAGE_STATUS.NOUVEAU).length;
    const enCours = activeRows.filter((x) => x.status === MESSAGE_STATUS.EN_COURS).length;
    const traite = activeRows.filter((x) => x.status === MESSAGE_STATUS.TRAITE).length;
    return { total, nouveau, enCours, traite };
  }, [activeRows]);

  const pageCount = filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = pageCount === 0 ? 1 : Math.min(page, pageCount);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const loading = tab === TAB_CONTACT ? loadingMessages : loadingReservations;
  const panelError = tab === TAB_CONTACT ? errorMessages : errorReservations;

  const handleStatusChangeMessage = async (id, status) => {
    setBusyMessage(id);
    setErrorMessages(null);
    try {
      const { data } = await updateStatus(id, status);
      setRawMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    } catch (err) {
      setErrorMessages(getErrorMessage(err));
    } finally {
      setBusyMessage(null);
    }
  };

  const handleDeleteMessage = async (m) => {
    if (!window.confirm(`Supprimer le message de « ${m.name} » ?`)) return;
    setBusyMessage(m.id);
    setErrorMessages(null);
    try {
      await deleteMessage(m.id);
      setRawMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err) {
      setErrorMessages(getErrorMessage(err));
    } finally {
      setBusyMessage(null);
    }
  };

  const handleStatusChangeReservation = async (id, status) => {
    setBusyReservation(id);
    setErrorReservations(null);
    try {
      const { data } = await updateReservationStatus(id, status);
      setRawReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    } catch (err) {
      setErrorReservations(getErrorMessage(err));
    } finally {
      setBusyReservation(null);
    }
  };

  const handleDeleteReservation = async (r) => {
    if (!window.confirm(`Supprimer la réservation « ${r.reference} » ?`)) return;
    setBusyReservation(r.id);
    setErrorReservations(null);
    try {
      await deleteWebsiteReservation(r.id);
      setRawReservations((prev) => prev.filter((x) => x.id !== r.id));
    } catch (err) {
      setErrorReservations(getErrorMessage(err));
    } finally {
      setBusyReservation(null);
    }
  };

  const exportReservationRows = (rows) =>
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

  return (
    <div className="admin-dashboard">
      <div className="admin-inbox-tabs" role="tablist" aria-label="Boîte de réception">
        <button
          type="button"
          role="tab"
          aria-selected={tab === TAB_CONTACT}
          className={`admin-inbox-tab${tab === TAB_CONTACT ? ' admin-inbox-tab--active' : ''}`}
          onClick={() => setTab(TAB_CONTACT)}
        >
          Messages contact
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === TAB_RESERVATIONS}
          className={`admin-inbox-tab${tab === TAB_RESERVATIONS ? ' admin-inbox-tab--active' : ''}`}
          onClick={() => setTab(TAB_RESERVATIONS)}
        >
          Réservations site
        </button>
      </div>

      {panelError && <div className="admin-dashboard__error">{panelError}</div>}

      <StatsCards
        total={stats.total}
        nouveau={stats.nouveau}
        enCours={stats.enCours}
        traite={stats.traite}
        totalLabel={tab === TAB_CONTACT ? 'Total messages' : 'Total demandes'}
      />

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={
          tab === TAB_CONTACT
            ? 'Rechercher (nom, email, téléphone, sujet, message)…'
            : 'Rechercher (référence, nom, email, téléphone, notes)…'
        }
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFrom={setDateFrom}
        onDateTo={setDateTo}
        exportRows={filtered}
        loading={loading}
        exportBuildRows={tab === TAB_RESERVATIONS ? exportReservationRows : undefined}
        exportSheetName={tab === TAB_RESERVATIONS ? 'Réservations' : undefined}
        exportFileName={
          tab === TAB_RESERVATIONS
            ? `mai-tourism-reservations-${new Date().toISOString().slice(0, 10)}.xlsx`
            : undefined
        }
      />

      {tab === TAB_CONTACT ? (
        <>
          {loadingMessages ? (
            <p className="admin-dashboard__loading">Chargement des messages…</p>
          ) : messages.length === 0 ? (
            <p className="admin-dashboard__empty">
              Aucun message en base. Envoyez un message depuis la page{' '}
              <Link to="/contact">Contact</Link>.
            </p>
          ) : (
            <MessagesTable
              rows={pageRows}
              page={safePage}
              pageCount={pageCount}
              onPageChange={setPage}
              onStatusChange={handleStatusChangeMessage}
              onDelete={handleDeleteMessage}
              isRowBusy={(id) => busyMessage === id}
            />
          )}
        </>
      ) : (
        <>
          {loadingReservations ? (
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
              onStatusChange={handleStatusChangeReservation}
              onDelete={handleDeleteReservation}
              isRowBusy={(id) => busyReservation === id}
            />
          )}
        </>
      )}
    </div>
  );
}
