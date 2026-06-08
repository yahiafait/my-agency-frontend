import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import packageService from '../../api/packageService';
import hotelService from '../../api/hotelService';
import destinationService from '../../api/destinationService';
import { uploadDestinationImage } from '../services/uploadService';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { IconPlus, IconEdit, IconTrash, IconLoader } from '../icons/AdminIcons';
import './DashboardStaff.css';

const EMPTY = {
  title: '',
  description: '',
  durationDays: '',
  price: '',
  imageUrl: '',
  featured: false,
  destinationId: '',
  hotelIds: [],
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_MB = 5;

function normalizePackage(pkg) {
  return {
    ...pkg,
    destinationName: pkg.destination?.name || 'Destination non liée',
    hotelNames: Array.isArray(pkg.hotels) ? pkg.hotels.map((h) => h.name) : [],
  };
}

export default function DashboardPackages() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [pkgRes, destRes, hotelRes] = await Promise.all([
        packageService.getAll(),
        destinationService.getAll(),
        hotelService.getAll(),
      ]);
      const pkgList = Array.isArray(pkgRes.data) ? pkgRes.data.map(normalizePackage) : [];
      setPackages(pkgList);
      setDestinations(Array.isArray(destRes.data) ? destRes.data : []);
      setHotels(Array.isArray(hotelRes.data) ? hotelRes.data : []);
    } catch {
      setError('Impossible de charger les forfaits.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featuredCount = useMemo(() => packages.filter((p) => p.featured).length, [packages]);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const toPayload = () => ({
    title: form.title.trim(),
    description: form.description.trim(),
    durationDays: Number(form.durationDays),
    price: Number(form.price),
    imageUrl: form.imageUrl.trim() || null,
    featured: Boolean(form.featured),
    destinationId: Number(form.destinationId),
    hotelIds: form.hotelIds.map(Number),
  });

  const processFile = async (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Format accepté : JPG, PNG, WebP ou GIF.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image trop lourde (max ${MAX_MB} Mo).`);
      return;
    }
    setUploading(true);
    setError('');
    try {
      const url = await uploadDestinationImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      if (err.sessionExpired || err.response?.status === 401 || err.response?.status === 403) {
        setError('Session expirée. Déconnectez-vous puis reconnectez-vous.');
      } else {
        setError(err.response?.data?.message || 'Échec de l’envoi de l’image.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const toggleHotel = (hotelId) => {
    setForm((prev) => ({
      ...prev,
      hotelIds: prev.hotelIds.includes(hotelId)
        ? prev.hotelIds.filter((id) => id !== hotelId)
        : [...prev.hotelIds, hotelId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destinationId) {
      setError('Sélectionnez une destination.');
      return;
    }
    if (!form.imageUrl?.trim()) {
      setError('Ajoutez une photo depuis votre ordinateur.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = toPayload();
      if (editingId) {
        await packageService.update(editingId, payload);
      } else {
        await packageService.create(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (pkg) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      description: pkg.description,
      durationDays: String(pkg.durationDays),
      price: String(pkg.price),
      imageUrl: pkg.imageUrl || '',
      featured: pkg.featured,
      destinationId: String(pkg.destination?.id || ''),
      hotelIds: Array.isArray(pkg.hotels) ? pkg.hotels.map((h) => h.id) : [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce forfait ?')) return;
    try {
      await packageService.remove(id);
      if (editingId === id) resetForm();
      await load();
    } catch {
      setError('Suppression impossible.');
    }
  };

  return (
    <div className="admin-staff">
      <header className="admin-staff__hero">
        <div className="admin-staff__hero-inner">
          <div>
            <h1>Catalogue forfaits</h1>
            <p>Admin et managers peuvent créer des offres combinant destination + hôtels.</p>
          </div>
          <div className="admin-staff__stats">
            <div className="admin-staff__stat">
              <strong>{packages.length}</strong>
              <span>Total</span>
            </div>
            <div className="admin-staff__stat">
              <strong>{featuredCount}</strong>
              <span>En vedette</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <p className="admin-staff__error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-staff__layout">
        <section className="admin-staff__panel admin-staff__panel--form">
          <div className="admin-staff__panel-head">
            <div className="admin-staff__panel-icon">🧳</div>
            <div>
              <h2>{editingId ? 'Modifier le forfait' : 'Nouveau forfait'}</h2>
              <p>{editingId ? 'Mettez à jour les informations' : 'Créez une offre complète'}</p>
            </div>
          </div>

          <form className="admin-staff__form" onSubmit={handleSubmit}>
            <label>
              Titre
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label>
              Description
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>

            <div className="admin-staff__row">
              <label>
                Durée (jours)
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Ex. 5"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                />
              </label>
              <label>
                Prix (€)
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Ex. 1299"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>
            </div>

            <label>
              Destination liée
              <select
                required
                value={form.destinationId}
                onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
              >
                <option value="">-- Choisir une destination --</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="admin-staff__upload-field">
              <span className="admin-staff__upload-label">Photo du forfait</span>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                className="admin-staff__file-input"
                onChange={handleFileChange}
              />
              <div
                className={`admin-staff__dropzone${dragOver ? ' admin-staff__dropzone--over' : ''}${form.imageUrl ? ' admin-staff__dropzone--has-image' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Choisir une image forfait"
              >
                {uploading ? (
                  <p className="admin-staff__dropzone-text">
                    <IconLoader /> Envoi en cours…
                  </p>
                ) : form.imageUrl ? (
                  <>
                    <img
                      src={resolveMediaUrl(form.imageUrl)}
                      alt="Aperçu forfait"
                      className="admin-staff__dropzone-preview"
                    />
                    <p className="admin-staff__dropzone-hint">Cliquez ou glissez pour remplacer</p>
                  </>
                ) : (
                  <>
                    <span className="admin-staff__dropzone-icon" aria-hidden>
                      📷
                    </span>
                    <p className="admin-staff__dropzone-text">
                      <strong>Cliquez pour choisir</strong> ou glissez une image
                    </p>
                    <p className="admin-staff__dropzone-hint">JPG, PNG, WebP, GIF — max {MAX_MB} Mo</p>
                  </>
                )}
              </div>
            </div>

            <div className="admin-staff__field-group">
              <span className="admin-staff__upload-label">Hôtels inclus</span>
              <div className="admin-staff__checklist">
                {hotels.map((hotel) => (
                  <label key={hotel.id} className="admin-staff__checklist-item">
                    <input
                      type="checkbox"
                      checked={form.hotelIds.includes(hotel.id)}
                      onChange={() => toggleHotel(hotel.id)}
                    />
                    <span>{hotel.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="admin-staff__toggle">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Mettre en avant sur la page forfaits
            </label>

            <div className="admin-staff__actions">
              <button type="submit" className="admin-staff__btn-primary" disabled={saving}>
                {saving ? <IconLoader /> : <IconPlus />}
                {saving ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Publier'}
              </button>
              {editingId && (
                <button type="button" className="admin-staff__btn-ghost" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          {loading ? (
            <div className="admin-staff__loading">
              <IconLoader /> Chargement du catalogue…
            </div>
          ) : packages.length === 0 ? (
            <div className="admin-staff__empty">
              <div className="admin-staff__empty-icon">🧳</div>
              <p>Aucun forfait pour le moment.</p>
            </div>
          ) : (
            <div className="admin-staff__grid">
              {packages.map((pkg) => (
                <article key={pkg.id} className="admin-staff__card">
                  <div className="admin-staff__card-media">
                    {pkg.imageUrl && (
                      <img src={resolveMediaUrl(pkg.imageUrl)} alt="" loading="lazy" />
                    )}
                    {pkg.featured && <span className="admin-staff__card-badge">Vedette</span>}
                    <span className="admin-staff__card-rating">{pkg.durationDays} j</span>
                  </div>
                  <div className="admin-staff__card-body">
                    <h3>{pkg.title}</h3>
                    <p className="admin-staff__card-loc">{pkg.destinationName}</p>
                    <p className="admin-staff__card-meta">
                      Hôtels inclus : {pkg.hotelNames.length > 0 ? pkg.hotelNames.join(', ') : 'aucun'}
                    </p>
                    <p className="admin-staff__card-price">
                      {Number(pkg.price).toLocaleString('fr-FR')} €
                    </p>
                    <div className="admin-staff__card-actions">
                      <button
                        type="button"
                        className="admin-staff__card-btn"
                        onClick={() => startEdit(pkg)}
                      >
                        <IconEdit /> Modifier
                      </button>
                      <button
                        type="button"
                        className="admin-staff__card-btn admin-staff__card-btn--danger"
                        onClick={() => handleDelete(pkg.id)}
                      >
                        <IconTrash /> Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
