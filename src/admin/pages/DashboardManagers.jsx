import { useCallback, useEffect, useState } from 'react';
import {
  createManager,
  deleteManager,
  getManagers,
  updateManager,
} from '../services/managerService';
import { IconUsers, IconPlus, IconEdit, IconTrash, IconLoader } from '../icons/AdminIcons';
import './DashboardStaff.css';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
};

function initials(first, last) {
  return `${(first || '?')[0]}${(last || '')[0]}`.toUpperCase();
}

export default function DashboardManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setManagers(await getManagers());
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Accès réservé à l’administrateur.'
          : 'Impossible de charger les managers.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || null,
        };
        if (form.password) payload.password = form.password;
        await updateManager(editingId, payload);
      } else {
        await createManager(form);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setForm({
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone || '',
      password: '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce manager ?')) return;
    try {
      await deleteManager(id);
      if (editingId === id) resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression impossible.');
    }
  };

  const canAdd = managers.length < 2;

  return (
    <div className="admin-staff">
      <header className="admin-staff__hero">
        <div className="admin-staff__hero-inner">
          <div>
            <h1>Équipe managers</h1>
            <p>
              Deux comptes maximum pour gérer la boîte de réception et le catalogue
              destinations. Réservé à l’administrateur principal.
            </p>
          </div>
          <div className="admin-staff__stats">
            <div className="admin-staff__stat">
              <strong>{managers.length}</strong>
              <span>/ 2 actifs</span>
            </div>
            <div className="admin-staff__stat">
              <strong>{2 - managers.length}</strong>
              <span>Places libres</span>
            </div>
          </div>
        </div>
      </header>

      {error && <p className="admin-staff__error" role="alert">{error}</p>}

      <div className="admin-staff__layout">
        <section className="admin-staff__panel admin-staff__panel--form">
          <div className="admin-staff__panel-head">
            <div className="admin-staff__panel-icon">
              <IconUsers />
            </div>
            <div>
              <h2>{editingId ? 'Modifier le manager' : 'Nouveau manager'}</h2>
              <p>Accès inbox + destinations</p>
            </div>
          </div>

          {!canAdd && !editingId ? (
            <p className="admin-staff__hint">
              Limite atteinte : supprimez un compte pour en créer un autre.
            </p>
          ) : (
            <form className="admin-staff__form" onSubmit={handleSubmit}>
              <div className="admin-staff__row">
                <label>
                  Prénom
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </label>
                <label>
                  Nom
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </label>
              </div>
              <label>
                Email de connexion
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                Téléphone
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                {editingId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                <input
                  type="password"
                  required={!editingId}
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
              <div className="admin-staff__actions">
                <button type="submit" className="admin-staff__btn-primary" disabled={saving}>
                  {saving ? <IconLoader /> : <IconPlus />}
                  {saving ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Créer le compte'}
                </button>
                {editingId && (
                  <button type="button" className="admin-staff__btn-ghost" onClick={resetForm}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        <section>
          {loading ? (
            <div className="admin-staff__loading">
              <IconLoader /> Chargement…
            </div>
          ) : managers.length === 0 ? (
            <div className="admin-staff__empty">
              <div className="admin-staff__empty-icon">👥</div>
              <p>Aucun manager configuré. Créez jusqu’à deux comptes.</p>
            </div>
          ) : (
            <div className="admin-staff__team">
              {managers.map((m) => (
                <div key={m.id} className="admin-staff__member">
                  <div className="admin-staff__avatar">
                    {initials(m.firstName, m.lastName)}
                  </div>
                  <div className="admin-staff__member-info">
                    <strong>
                      {m.firstName} {m.lastName}
                    </strong>
                    <span>{m.email}</span>
                    {m.phone && <span> · {m.phone}</span>}
                  </div>
                  <div className="admin-staff__member-actions">
                    <button
                      type="button"
                      className="admin-staff__card-btn"
                      onClick={() => startEdit(m)}
                    >
                      <IconEdit /> Modifier
                    </button>
                    <button
                      type="button"
                      className="admin-staff__card-btn admin-staff__card-btn--danger"
                      onClick={() => handleDelete(m.id)}
                    >
                      <IconTrash /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
