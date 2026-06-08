import { useEffect, useState } from 'react';
import destinationService from '../../api/destinationService';
import reservationService from '../../api/reservationService';
import axiosClient from '../../api/axiosClient';
import './AdminDashboard.css';

const emptyDestination = {
  name: '',
  description: '',
  country: '',
  city: '',
  imageUrl: '',
  priceFrom: '',
  rating: 4.5,
  featured: false,
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyDestination);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadDestinations = () =>
    destinationService.getAll().then((res) => setDestinations(res.data));

  const loadReservations = () =>
    reservationService.getAll().then((res) => setReservations(res.data));

  const loadUsers = () =>
    axiosClient.get('/users').then((res) => setUsers(res.data));

  useEffect(() => {
    loadDestinations();
    loadReservations();
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      priceFrom: Number(form.priceFrom),
      rating: Number(form.rating),
    };
    try {
      if (editingId) {
        await destinationService.update(editingId, payload);
        setMessage('Destination mise Ã  jour');
      } else {
        await destinationService.create(payload);
        setMessage('Destination creee');
      }
      setForm(emptyDestination);
      setEditingId(null);
      loadDestinations();
    } catch {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name,
      description: d.description,
      country: d.country,
      city: d.city,
      imageUrl: d.imageUrl || '',
      priceFrom: d.priceFrom,
      rating: d.rating,
      featured: d.featured,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette destination ?')) return;
    await destinationService.remove(id);
    loadDestinations();
    setMessage('Destination supprimée');
  };

  const updateReservationStatus = async (id, status) => {
    await reservationService.updateStatus(id, status);
    loadReservations();
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await axiosClient.delete(`/users/${id}`);
    loadUsers();
  };

  return (
    <div className="admin page-header-offset">
      <div className="container">
        <h1>Dashboard Admin</h1>
        <p className="admin__subtitle">Gérez destinations, réservations et utilisateurs</p>

        {message && <p className="admin__message">{message}</p>}

        <div className="admin__tabs">
          {['destinations', 'reservations', 'users'].map((t) => (
            <button
              key={t}
              type="button"
              className={`admin__tab${tab === t ? ' admin__tab--active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'destinations' && 'Destinations'}
              {t === 'reservations' && 'Réservations'}
              {t === 'users' && 'Utilisateurs'}
            </button>
          ))}
        </div>

        {tab === 'destinations' && (
          <div className="admin__grid">
            <form className="admin__form" onSubmit={handleSubmit}>
              <h2>{editingId ? 'Modifier' : 'Ajouter'} une destination</h2>
              {['name', 'city', 'country', 'imageUrl', 'priceFrom', 'rating'].map((field) => (
                <label key={field}>
                  {field}
                  <input
                    required={field !== 'imageUrl'}
                    type={field === 'priceFrom' || field === 'rating' ? 'number' : 'text'}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </label>
              ))}
              <label>
                description
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <label className="admin__checkbox">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Populaire (featured)
              </label>
              <div className="admin__form-actions">
                <button type="submit" className="btn btn--primary">
                  {editingId ? 'Mettre Ã  jour' : 'CrÃ©er'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => { setEditingId(null); setForm(emptyDestination); }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>

            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Ville</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.city}</td>
                      <td>{d.priceFrom} €</td>
                      <td>
                        <button type="button" onClick={() => handleEdit(d)}>Modifier</button>
                        <button type="button" className="danger" onClick={() => handleDelete(d.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'reservations' && (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Package</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.user?.email}</td>
                    <td>{r.travelPackage?.title}</td>
                    <td>{r.startDate} → {r.endDate}</td>
                    <td>{r.totalPrice} €</td>
                    <td><span className={`badge badge--${r.status?.toLowerCase()}`}>{r.status}</span></td>
                    <td>
                      <select
                        value={r.status}
                        onChange={(e) => updateReservationStatus(r.id, e.target.value)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="admin__table-wrap">
            <table className="admin__table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button type="button" className="danger" onClick={() => deleteUser(u.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
