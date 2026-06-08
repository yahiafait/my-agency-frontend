import './SectionHeader.css';

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center', titleId }) {
  return (
    <div className={`section-header section-header--${align} animate-fade-up`}>
      {eyebrow && <span className="section-header__eyebrow">{eyebrow}</span>}
      <h2 id={titleId} className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </div>
  );
}
