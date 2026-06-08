import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../packages/PackageCard';
import SectionHeader from '../ui/SectionHeader';
import { useLanguage } from '../../context/LanguageContext';
import { fetchPackagesCatalog } from '../../services/packageCatalog';

export default function PackagesSection() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPackagesCatalog({ featured: true })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHeader
          eyebrow={t('sectionPackages.eyebrow')}
          title={t('sectionPackages.title')}
          subtitle={t('sectionPackages.subtitle')}
        />
        {loading ? (
          <p className="section__loading">{t('common.loading')}</p>
        ) : (
          <div className="section__grid">
            {items.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        )}
        <div className="section__cta">
          <Link to="/packages" className="btn btn--primary">
            {t('sectionPackages.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
