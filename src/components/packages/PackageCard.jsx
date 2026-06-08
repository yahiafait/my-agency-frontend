import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './PackageCard.css';

export default function PackageCard({ pkg }) {
  const dest = pkg.destination;
  const { t, priceLocale } = useLanguage();

  return (
    <article className="pkg-card">
      <div className="pkg-card__media">
        <img src={pkg.imageUrl} alt={pkg.title} loading="lazy" />
        <span className="pkg-card__days">
          {pkg.durationDays} {t('common.days')}
        </span>
      </div>
      <div className="pkg-card__body">
        {dest && <p className="pkg-card__loc">{dest.city}, {dest.country}</p>}
        <h3>{pkg.title}</h3>
        <p className="pkg-card__desc">{pkg.description}</p>
        <div className="pkg-card__footer">
          <p>
            {t('common.fromShort')}{' '}
            <strong>{Number(pkg.price).toLocaleString(priceLocale)} €</strong>
          </p>
          <Link
            to={`/reservation?package=${pkg.id}&destination=${pkg.destinationId}`}
            className="btn btn--primary btn--sm"
          >
            {t('common.book')}
          </Link>
        </div>
      </div>
    </article>
  );
}
