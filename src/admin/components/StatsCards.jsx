import { IconInbox, IconLoader, IconCheck } from '../icons/AdminIcons';
import './StatsCards.css';

/** Cartes KPI pour le bandeau du dashboard. */
export default function StatsCards({ total, nouveau, enCours, traite, totalLabel = 'Total messages' }) {
  const cards = [
    { label: totalLabel, value: total, icon: IconInbox, tone: 'neutral' },
    { label: 'Nouveaux', value: nouveau, icon: IconInbox, tone: 'blue' },
    { label: 'En cours', value: enCours, icon: IconLoader, tone: 'amber' },
    { label: 'Traités', value: traite, icon: IconCheck, tone: 'green' },
  ];

  return (
    <div className="admin-stats-grid">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <article key={c.label} className={`admin-stat-card admin-stat-card--${c.tone}`}>
            <div className="admin-stat-card__icon" aria-hidden>
              <Icon />
            </div>
            <div>
              <p className="admin-stat-card__label">{c.label}</p>
              <p className="admin-stat-card__value">{c.value}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
