import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMessages, updateStatus, deleteMessage } from '../services/contactService';
import { MESSAGE_STATUS, normalizeMessage } from '../data/messageStatus';
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';
import MessagesTable from '../components/MessagesTable';
import './DashboardMessages.css';

const PAGE_SIZE = 8;

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

/** Page dashboard : messages contact (séparée des réservations). */
export default function DashboardMessages() {
  const [rawMessages, setRawMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [errorMessages, setErrorMessages] = useState(null);
  const [busyMessage, setBusyMessage] = useState(null);

  const [statusFilter, setStatusFilter] = useState(MESSAGE_STATUS.ALL);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const messages = useMemo(() => rawMessages.map(normalizeMessage), [rawMessages]);

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

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
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
  }, [messages, statusFilter, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = messages.length;
    const nouveau = messages.filter((x) => x.status === MESSAGE_STATUS.NOUVEAU).length;
    const enCours = messages.filter((x) => x.status === MESSAGE_STATUS.EN_COURS).length;
    const traite = messages.filter((x) => x.status === MESSAGE_STATUS.TRAITE).length;
    return { total, nouveau, enCours, traite };
  }, [messages]);

  const pageCount = filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = pageCount === 0 ? 1 : Math.min(page, pageCount);
  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

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

  return (
    <div className="admin-dashboard">
      {errorMessages && <div className="admin-dashboard__error">{errorMessages}</div>}

      <StatsCards
        total={stats.total}
        nouveau={stats.nouveau}
        enCours={stats.enCours}
        traite={stats.traite}
        totalLabel="Total messages"
      />

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Rechercher (nom, email, téléphone, sujet, message)…"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFrom={setDateFrom}
        onDateTo={setDateTo}
        exportRows={filtered}
        loading={loadingMessages}
      />

      {loadingMessages ? (
        <p className="admin-dashboard__loading">Chargement des messages…</p>
      ) : messages.length === 0 ? (
        <p className="admin-dashboard__empty">
          Aucun message en base. Envoyez un message depuis la page <Link to="/contact">Contact</Link>.
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
    </div>
  );
}
