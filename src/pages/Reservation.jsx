import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  fetchReservationDestinations,
  fetchDestinationById,
  isExtraDestinationId,
} from '../services/destinationCatalog';
import { fetchPackagesCatalog } from '../services/packageCatalog';
import { images } from '../data/images';
import { agencyInfo } from '../data/agencyInfo';
import { useLanguage } from '../context/LanguageContext';
import { submitWebsiteReservation } from '../api/publicReservationService';
import './Reservation.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  packageId: '',
  destinationId: '',
  startDate: '',
  endDate: '',
  guests: 2,
  travelClass: 'DEUXIEME_CLASSE',
  notes: '',
};

export default function Reservation() {
  const { t, priceLocale } = useLanguage();
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);

  const [searchParams] = useSearchParams();
  const preselectedDest = searchParams.get('destination');
  const preselectedPkg = searchParams.get('package');

  const [form, setForm] = useState({
    ...initialForm,
    destinationId: preselectedDest || '',
    packageId: preselectedPkg || '',
  });

  useEffect(() => {
    fetchReservationDestinations().then(setDestinations);
    fetchPackagesCatalog().then(setPackages);
  }, []);

  useEffect(() => {
    if (!preselectedPkg || packages.length === 0) return;
    const pkg = packages.find((p) => String(p.id) === String(preselectedPkg));
    if (!pkg) return;
    setForm((prev) => ({
      ...prev,
      packageId: String(pkg.id),
      destinationId: pkg.destinationId ? String(pkg.destinationId) : prev.destinationId,
    }));
  }, [preselectedPkg, packages]);

  useEffect(() => {
    const destId = form.destinationId;
    if (!destId || isExtraDestinationId(destId)) return;
    if (destinations.some((d) => String(d.id) === String(destId))) return;

    let cancelled = false;
    fetchDestinationById(destId).then((dest) => {
      if (!cancelled && dest) {
        setDestinations((prev) =>
          prev.some((d) => d.id === dest.id) ? prev : [...prev, dest]
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [form.destinationId, destinations]);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const selectedPackage = form.packageId
    ? packages.find((p) => String(p.id) === String(form.packageId))
    : null;
  const selectedDestination = form.destinationId
    ? destinations.find((d) => String(d.id) === String(form.destinationId))
    : null;

  const sideImage =
    selectedPackage?.imageUrl ||
    selectedDestination?.imageUrl ||
    selectedPackage?.destination?.imageUrl ||
    '';

  const estimatedTotal = useMemo(() => {
    if (selectedPackage) {
      return selectedPackage.price * Number(form.guests || 1);
    }
    if (selectedDestination) {
      return selectedDestination.priceFrom * Number(form.guests || 1);
    }
    return 0;
  }, [selectedPackage, selectedDestination, form.guests]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const packageMatchesDestination = (pkg) => {
    if (!form.destinationId) return true;
    if (isExtraDestinationId(form.destinationId)) {
      const city = selectedDestination?.city?.toLowerCase();
      return city && pkg.destination?.city?.toLowerCase() === city;
    }
    return pkg.destinationId === Number(form.destinationId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const ref = `MT-${Date.now().toString(36).toUpperCase()}`;
    const extraCity = isExtraDestinationId(form.destinationId) ? selectedDestination : null;
    const userNotes = form.notes?.trim() || '';
    const notes = extraCity
      ? [t('pages.reservation.extraCityNote', { city: extraCity.city, country: extraCity.country }), userNotes]
          .filter(Boolean)
          .join('\n')
      : userNotes || null;

    const payload = {
      reference: ref,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() ? form.phone.trim() : null,
      destinationId: extraCity || !form.destinationId ? null : Number(form.destinationId),
      packageId: form.packageId ? Number(form.packageId) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      guests: Number(form.guests) || 1,
      travelClass: form.travelClass,
      notes,
      estimatedTotal,
    };

    setSubmitting(true);
    try {
      await submitWebsiteReservation(payload);
      setReference(ref);
      setSubmitted(true);
    } catch (err) {
      const d = err.response?.data;
      let msg = d?.message || err.message;
      if (d?.errors && typeof d.errors === 'object') {
        msg = Object.entries(d.errors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' — ');
      }
      setSubmitError(msg || t('pages.reservation.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const guestLabel =
    Number(form.guests) > 1 ? t('common.travelers') : t('common.traveler');

  if (submitted) {
    return (
      <div className="page reservation-page">
        <div className="container">
          <div className="reservation-success animate-fade-up">
            <div className="reservation-success__icon">✓</div>
            <img src={images.logo} alt="MAI Tourisme" className="reservation-success__logo" />
            <h1>{t('pages.reservation.successTitle')}</h1>
            <p>
              {t('pages.reservation.successThanks')} <strong>{form.firstName}</strong>.{' '}
              {t('pages.reservation.successBody')}
            </p>
            <p className="reservation-success__ref">
              {t('pages.reservation.ref')} <strong>{reference}</strong>
            </p>
            <p className="reservation-success__note">
              {t('pages.reservation.advisor')} <strong>{form.email}</strong>.
              <br />
              <em>{t('pages.reservation.savedNote')}</em>
            </p>
            <div className="reservation-success__actions">
              <Link to="/" className="btn btn--primary">{t('pages.reservation.home')}</Link>
              <Link to="/destinations" className="btn btn--ghost">{t('pages.reservation.moreDest')}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page reservation-page">
      <section className="reservation-hero">
        <div className="container reservation-hero__inner">
          <span className="reservation-hero__eyebrow">{t('pages.reservation.eyebrow')}</span>
          <h1>{t('pages.reservation.title')}</h1>
          <p>
            {t('pages.reservation.heroSub')} {agencyInfo.name}.
          </p>
        </div>
      </section>

      <div className="container reservation-page__layout">
        <aside className="reservation-page__visual animate-fade-up">
          <div className="reservation-page__image-wrap reservation-page__image-wrap--support">
            <img
              src={images.conseillereContact}
              alt={t('pages.reservation.imgAlt')}
              decoding="async"
            />
          </div>

          <div className="reservation-summary">
            <h3>{t('pages.reservation.summary')}</h3>
            {(selectedPackage || selectedDestination) && sideImage && (
              <div className="reservation-summary__preview">
                <img src={sideImage} alt="" className="reservation-summary__thumb" />
              </div>
            )}
            {selectedPackage && (
              <p><strong>{selectedPackage.title}</strong></p>
            )}
            {selectedDestination && !selectedPackage && (
              <p><strong>{selectedDestination.name}</strong></p>
            )}
            {!selectedPackage && !selectedDestination && (
              <p className="reservation-summary__muted">{t('pages.reservation.summaryEmpty')}</p>
            )}
            {form.guests > 0 && (
              <p>
                {form.guests} {guestLabel}
              </p>
            )}
            <p className="reservation-summary__class">
              {t('pages.reservation.classSummary')} :{' '}
              <strong>
                {form.travelClass === 'PREMIERE_CLASSE'
                  ? t('pages.reservation.classFirst')
                  : t('pages.reservation.classSecond')}
              </strong>
            </p>
            {estimatedTotal > 0 && (
              <p className="reservation-summary__total">
                {t('pages.reservation.estimate')}{' '}
                <strong>{estimatedTotal.toLocaleString(priceLocale)} €</strong>
              </p>
            )}
            <p className="reservation-summary__note">{t('pages.reservation.note')}</p>
          </div>
        </aside>

        <form className="reservation-form animate-fade-up" onSubmit={handleSubmit}>
          {submitError && (
            <div className="reservation-form__error" role="alert">
              {submitError}
            </div>
          )}
          <fieldset>
            <legend>{t('pages.reservation.coords')}</legend>
            <div className="reservation-form__row">
              <label>
                {t('pages.reservation.firstName')}
                <input name="firstName" required value={form.firstName} onChange={handleChange} />
              </label>
              <label>
                {t('pages.reservation.lastName')}
                <input name="lastName" required value={form.lastName} onChange={handleChange} />
              </label>
            </div>
            <label>
              {t('pages.reservation.email')}
              <input type="email" name="email" required value={form.email} onChange={handleChange} />
            </label>
            <label>
              {t('pages.reservation.phone')}
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </label>
          </fieldset>

          <p className="reservation-form__train-note">{t('pages.reservation.trainServices')}</p>

          <fieldset>
            <legend>{t('pages.reservation.trip')}</legend>
            <div className="reservation-form__class-group" role="group" aria-labelledby="reservation-travel-class-label">
              <p id="reservation-travel-class-label" className="reservation-form__class-label">
                {t('pages.reservation.travelClass')}
              </p>
              <div className="reservation-form__class-options" role="radiogroup">
                <label className="reservation-form__class-option">
                  <input
                    type="radio"
                    name="travelClass"
                    value="PREMIERE_CLASSE"
                    checked={form.travelClass === 'PREMIERE_CLASSE'}
                    onChange={handleChange}
                  />
                  <span>{t('pages.reservation.classFirst')}</span>
                </label>
                <label className="reservation-form__class-option">
                  <input
                    type="radio"
                    name="travelClass"
                    value="DEUXIEME_CLASSE"
                    checked={form.travelClass === 'DEUXIEME_CLASSE'}
                    onChange={handleChange}
                  />
                  <span>{t('pages.reservation.classSecond')}</span>
                </label>
              </div>
            </div>
            <label>
              {t('pages.reservation.destination')}
              <select name="destinationId" value={form.destinationId} onChange={handleChange}>
                <option value="">{t('pages.reservation.optDest')}</option>
                {destinations.some((d) => !d.isExtraCity) && (
                  <optgroup label={t('pages.reservation.destCatalog')}>
                    {destinations
                      .filter((d) => !d.isExtraCity)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </optgroup>
                )}
                {destinations.some((d) => d.isExtraCity) && (
                  <optgroup label={t('pages.reservation.destOtherCities')}>
                    {destinations
                      .filter((d) => d.isExtraCity)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            </label>
            <label>
              {t('pages.reservation.package')}
              <select name="packageId" value={form.packageId} onChange={handleChange}>
                <option value="">{t('pages.reservation.optPkg')}</option>
                {packages
                  .filter(packageMatchesDestination)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {p.price} €
                    </option>
                  ))}
              </select>
            </label>
            <div className="reservation-form__row">
              <label>
                {t('pages.reservation.start')}
                <input type="date" name="startDate" required value={form.startDate} onChange={handleChange} />
              </label>
              <label>
                {t('pages.reservation.end')}
                <input type="date" name="endDate" required value={form.endDate} onChange={handleChange} />
              </label>
            </div>
            <label>
              {t('pages.reservation.guests')}
              <input
                type="number"
                name="guests"
                min={1}
                max={20}
                required
                value={form.guests}
                onChange={handleChange}
              />
            </label>
            <label>
              {t('pages.reservation.notes')}
              <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder={t('pages.reservation.phNotes')} />
            </label>
          </fieldset>

          <button type="submit" className="btn btn--accent btn--lg" disabled={submitting}>
            {submitting ? t('pages.reservation.submitting') : t('pages.reservation.confirm')}
          </button>
        </form>
      </div>
    </div>
  );
}
