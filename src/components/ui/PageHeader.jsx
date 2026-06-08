import './PageHeader.css';

export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="page-header animate-fade-up">
      {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </header>
  );
}
