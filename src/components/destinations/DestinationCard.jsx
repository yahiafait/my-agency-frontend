import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import './DestinationCard.css';

export default function DestinationCard({ destination }) {
  const { id, name, city, country, imageUrl, priceFrom, rating, featured } = destination;
  const { t, priceLocale } = useLanguage();

  return (
    <article className={`dest-card${featured ? ' dest-card--featured' : ''}`}>
      <div className="dest-card__media">
        {imageUrl ? (
          <img src={resolveMediaUrl(imageUrl)} alt={name} loading="lazy" />
        ) : (
          <div className="dest-card__placeholder" aria-hidden="true" />
        )}
        {featured && <span className="dest-card__badge">{t('common.popular')}</span>}
      </div>
      <div className="dest-card__body">
        <div className="dest-card__meta">
          <span>{city}, {country}</span>
          <span className="dest-card__rating">★ {rating?.toFixed(1)}</span>
        </div>
        <h3>{name}</h3>
        <div className="dest-card__footer">
          <p>
            {t('common.fromShort')}{' '}
            <strong>{Number(priceFrom).toLocaleString(priceLocale)} €</strong>
          </p>
          <Link to={`/destinations/${id}`} className="btn btn--primary btn--sm">
            {t('common.discover')}
          </Link>
        </div>
      </div>
    </article>
  );
}
