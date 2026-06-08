import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import destinationService from '../../api/destinationService';
import { uploadDestinationImage } from '../services/uploadService';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { IconGlobe, IconPlus, IconEdit, IconTrash, IconLoader } from '../icons/AdminIcons';
import './DashboardStaff.css';

const EMPTY = {
  name: '',
  description: '',
  country: 'Maroc',
  city: '',
  imageUrl: '',
  priceFrom: '',
  rating: '4.5',
  featured: false,
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_MB = 5;

export default function DashboardDestinations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await destinationService.getAll();
      setList(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger les destinations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const featuredCount = useMemo(() => list.filter((d) => d.featured).length, [list]);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const toPayload = () => ({
    name: form.name.trim(),
    description: form.description.trim(),
    country: form.country.trim(),
    city: form.city.trim(),
    imageUrl: form.imageUrl.trim() || null,
    priceFrom: Number(form.priceFrom),
    rating: Number(form.rating),
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
        setError('Session expirée. Déconnectez-vous puis reconnectez-vous en manager.');
      } else {
        setError(err.response?.data?.message || 'Échec de l’envoi de l’image. Vérifiez le format (JPG, PNG) et la taille (max 5 Mo).');
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
        await destinationService.update(editingId, payload);
      } else {
        await destinationService.create(payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setForm({
      name: d.name,
      description: d.description,
      country: d.country,
      city: d.city,
      imageUrl: d.imageUrl || '',
      priceFrom: String(d.priceFrom),
      rating: String(d.rating),
      featured: d.featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette destination ?')) return;
    try {
      await destinationService.remove(id);
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
            <h1>Catalogue destinations</h1>
            <p>
              Ajoutez et mettez à jour les voyages affichés sur le site public. Les managers
              ont les mêmes droits que l’admin sur cette section.
            </p>
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

      {error && <p className="admin-staff__error" role="alert">{error}</p>}

      <div className="admin-staff__layout">
        <section className="admin-staff__panel admin-staff__panel--form">
          <div className="admin-staff__panel-head">
            <div className="admin-staff__panel-icon">
              <IconGlobe />
            </div>
            <div>
              <h2>{editingId ? 'Modifier' : 'Nouvelle destination'}</h2>
              <p>{editingId ? 'Mettez à jour les informations' : 'Publiez une nouvelle offre'}</p>
            </div>
          </div>

          <form className="admin-staff__form" onSubmit={handleSubmit}>
            <label>
              Nom de la destination
              <input
                required
                placeholder="Ex. Marrakech — La perle du Sud"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Description courte
              <textarea
                required
                rows={3}
                placeholder="Texte affiché sur les cartes et la fiche…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <div className="admin-staff__row">
              <label>
                Pays
                <input
                  required
                  placeholder="Ex. Maroc"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </label>
              <label>
                Ville
                <input
                  required
                  placeholder="Ex. Marrakech"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>
            </div>
            <div className="admin-staff__upload-field">
              <span className="admin-staff__upload-label">Photo de la destination</span>
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
                aria-label="Choisir une image depuis votre ordinateur"
              >
                {uploading ? (
                  <p className="admin-staff__dropzone-text">
                    <IconLoader /> Envoi en cours…
                  </p>
                ) : form.imageUrl ? (
                  <>
                    <img
                      src={resolveMediaUrl(form.imageUrl)}
                      alt="Aperçu"
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
              {form.imageUrl && (
                <button
                  type="button"
                  className="admin-staff__remove-image"
                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                >
                  Supprimer la photo
                </button>
              )}
            </div>
            <div className="admin-staff__row">
              <label>
                Prix dès (€)
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Ex. 899"
                  value={form.priceFrom}
                  onChange={(e) => setForm({ ...form, priceFrom: e.target.value })}
                />
              </label>
              <label>
                Note /5
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  required
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                />
              </label>
            </div>
            <label className="admin-staff__toggle">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Mettre en avant sur la page d’accueil
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
              <div className="admin-staff__empty-icon">🌍</div>
              <p>Aucune destination. Créez la première avec le formulaire.</p>
            </div>
          ) : (
            <div className="admin-staff__grid">
              {list.map((d) => (
                <article key={d.id} className="admin-staff__card">
                  <div className="admin-staff__card-media">
                    {d.imageUrl && (
                      <img src={resolveMediaUrl(d.imageUrl)} alt="" loading="lazy" />
                    )}
                    {d.featured && <span className="admin-staff__card-badge">Vedette</span>}
                    <span className="admin-staff__card-rating">★ {d.rating}</span>
                  </div>
                  <div className="admin-staff__card-body">
                    <h3>{d.name}</h3>
                    <p className="admin-staff__card-loc">
                      {d.city}, {d.country}
                    </p>
                    <p className="admin-staff__card-price">
                      {Number(d.priceFrom).toLocaleString('fr-FR')} €
                    </p>
                    <div className="admin-staff__card-actions">
                      <button
                        type="button"
                        className="admin-staff__card-btn"
                        onClick={() => startEdit(d)}
                      >
                        <IconEdit /> Modifier
                      </button>
                      <button
                        type="button"
                        className="admin-staff__card-btn admin-staff__card-btn--danger"
                        onClick={() => handleDelete(d.id)}
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
