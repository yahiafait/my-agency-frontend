import { useEffect, useState } from 'react';
import PackageCard from '../components/packages/PackageCard';
import PageHeader from '../components/ui/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { fetchPackagesCatalog } from '../services/packageCatalog';

export default function Packages() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPackagesCatalog()
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

  return (
    <div className="page">
      <div className="container">
        <PageHeader
          eyebrow={t('pages.packages.eyebrow')}
          title={t('pages.packages.title')}
          subtitle={t('pages.packages.subtitle')}
        />
        {loading ? (
          <p className="section__loading">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="section__empty">{t('pages.packages.empty')}</p>
        ) : (
          <div className="section__grid">
            {items.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
