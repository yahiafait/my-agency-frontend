import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import PackageCard from '../components/packages/PackageCard';
import { useLanguage } from '../context/LanguageContext';
import { fetchDestinationById } from '../services/destinationCatalog';
import { fetchPackagesCatalog } from '../services/packageCatalog';
import './DestinationDetail.css';

export default function DestinationDetail() {
  const { t, priceLocale } = useLanguage();
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [relatedPackages, setRelatedPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetchDestinationById(id),
      fetchPackagesCatalog({ destinationId: id }),
    ]).then(([dest, pkgs]) => {
      if (!cancelled) {
        setDestination(dest);
        setRelatedPackages(pkgs);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page dest-detail">
        <div className="container" style={{ padding: '3rem 0' }}>
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const priceStr = `${Number(destination.priceFrom).toLocaleString(priceLocale)} €`;

  return (
    <div className="page dest-detail">
      <div className="dest-detail__hero">
        <img src={destination.imageUrl} alt={destination.name} />
        <div className="dest-detail__hero-overlay">
          <div className="container dest-detail__hero-content">
            <Link to="/destinations" className="dest-detail__back">
              ← {t('pages.destDetail.back')}
            </Link>
            <span className="dest-detail__location">
              {destination.city}, {destination.country}
            </span>
            <h1>{destination.name}</h1>
            <div className="dest-detail__meta">
              <span className="dest-detail__rating">★ {destination.rating}</span>
              <span>
                {t('common.from')} {priceStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container dest-detail__body">
        <div className="dest-detail__grid">
          <div className="dest-detail__main">
            <section>
              <h2>{t('pages.destDetail.about')}</h2>
              <p className="dest-detail__desc">{destination.longDescription}</p>
            </section>

            {destination.highlights?.length > 0 && (
              <section>
                <h2>{t('pages.destDetail.highlights')}</h2>
                <ul className="dest-detail__highlights">
                  {destination.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            {destination.gallery?.length > 1 && (
              <section>
                <h2>{t('pages.destDetail.gallery')}</h2>
                <div className="dest-detail__gallery">
                  {destination.gallery.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="dest-detail__aside">
            <div className="dest-detail__info-card">
              {destination.bestSeason && (
                <p>
                  <strong>{t('pages.destDetail.bestSeason')}</strong>
                  <br />
                  {destination.bestSeason}
                </p>
              )}
              {destination.durationSuggestion && (
                <p>
                  <strong>{t('pages.destDetail.duration')}</strong>
                  <br />
                  {destination.durationSuggestion}
                </p>
              )}
              <Link to="/reservation" className="btn btn--primary btn--lg">
                {t('pages.destDetail.book')}
              </Link>
            </div>
          </aside>
        </div>

        {relatedPackages.length > 0 && (
          <section className="dest-detail__packages">
            <h2>{t('pages.destDetail.packages')}</h2>
            <div className="section__grid">
              {relatedPackages.map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
