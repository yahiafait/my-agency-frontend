import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import hotelService from '../../api/hotelService';
import { uploadDestinationImage } from '../services/uploadService';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { IconPlus, IconEdit, IconTrash, IconLoader } from '../icons/AdminIcons';
import './DashboardStaff.css';

const EMPTY = {
  name: '',
  description: '',
  city: '',
  country: 'Maroc',
  stars: '4',
  pricePerNight: '',
  imageUrl: '',
  featured: false,
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_MB = 5;

export default function DashboardHotels() {
  const [list, setList] = useState([]);
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
      const { data } = await hotelService.getAll();
      setList(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger les hôtels.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featuredCount = useMemo(() => list.filter((h) => h.featured).length, [list]);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const toPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    city: form.city.trim(),
    country: form.country.trim(),
    stars: Number(form.stars),
    pricePerNight: Number(form.pricePerNight),
    imageUrl: form.imageUrl.trim() || null,
    featured: Boolean(form.featured),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl?.trim()) {
      setError('Ajoutez une photo depuis votre ordinateur.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = toPayload();
      if (editingId) {
        await hotelService.update(editingId, payload);
      } else {
        await hotelService.create(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (hotel) => {
    setEditingId(hotel.id);
    setForm({
      name: hotel.name,
      description: hotel.description,
      city: hotel.city,
      country: hotel.country,
      stars: String(hotel.stars),
      pricePerNight: String(hotel.pricePerNight),
      imageUrl: hotel.imageUrl || '',
      featured: hotel.featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet hôtel ?')) return;
    try {
      await hotelService.remove(id);
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
            <h1>Catalogue hôtels</h1>
            <p>Admin et managers peuvent publier les hôtels partenaires visibles sur le site.</p>
          </div>
          <div className="admin-staff__stats">
            <div className="admin-staff__stat">
              <strong>{list.length}</strong>
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
            <div className="admin-staff__panel-icon">🏨</div>
            <div>
              <h2>{editingId ? 'Modifier l’hôtel' : 'Nouvel hôtel'}</h2>
              <p>{editingId ? 'Mise à jour des informations' : 'Ajoutez un nouvel hébergement'}</p>
            </div>
          </div>

          <form className="admin-staff__form" onSubmit={handleSubmit}>
            <label>
              Nom de l’hôtel
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                Ville
                <input
                  required
                  placeholder="Ex. Marrakech"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>
              <label>
                Pays
                <input
                  required
                  placeholder="Ex. Maroc"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </label>
            </div>

            <div className="admin-staff__upload-field">
              <span className="admin-staff__upload-label">Photo de l’hôtel</span>
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
                aria-label="Choisir une image hôtel"
              >
                {uploading ? (
                  <p className="admin-staff__dropzone-text">
                    <IconLoader /> Envoi en cours…
                  </p>
                ) : form.imageUrl ? (
                  <>
                    <img
                      src={resolveMediaUrl(form.imageUrl)}
                      alt="Aperçu hôtel"
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

            <div className="admin-staff__row">
              <label>
                Nombre d’étoiles
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={form.stars}
                  onChange={(e) => setForm({ ...form, stars: e.target.value })}
                />
              </label>
              <label>
                Prix / nuit (€)
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Ex. 180"
                  value={form.pricePerNight}
                  onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
                />
              </label>
            </div>

            <label className="admin-staff__toggle">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Mettre en avant sur la page hôtels
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
          ) : list.length === 0 ? (
            <div className="admin-staff__empty">
              <div className="admin-staff__empty-icon">🏨</div>
              <p>Aucun hôtel pour le moment.</p>
            </div>
          ) : (
            <div className="admin-staff__grid">
              {list.map((hotel) => (
                <article key={hotel.id} className="admin-staff__card">
                  <div className="admin-staff__card-media">
                    {hotel.imageUrl && (
                      <img src={resolveMediaUrl(hotel.imageUrl)} alt="" loading="lazy" />
                    )}
                    {hotel.featured && <span className="admin-staff__card-badge">Vedette</span>}
                    <span className="admin-staff__card-rating">{'★'.repeat(hotel.stars)}</span>
                  </div>
                  <div className="admin-staff__card-body">
                    <h3>{hotel.name}</h3>
                    <p className="admin-staff__card-loc">
                      {hotel.city}, {hotel.country}
                    </p>
                    <p className="admin-staff__card-price">
                      {Number(hotel.pricePerNight).toLocaleString('fr-FR')} € / nuit
                    </p>
                    <div className="admin-staff__card-actions">
                      <button
                        type="button"
                        className="admin-staff__card-btn"
                        onClick={() => startEdit(hotel)}
                      >
                        <IconEdit /> Modifier
                      </button>
                      <button
                        type="button"
                        className="admin-staff__card-btn admin-staff__card-btn--danger"
                        onClick={() => handleDelete(hotel.id)}
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
