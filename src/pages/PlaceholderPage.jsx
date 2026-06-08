export default function PlaceholderPage({ title, description }) {
  return (
    <section className="section page-header-offset">
      <div className="container section__header">
        <h1 className="section__title">{title}</h1>
        <p className="section__subtitle">{description}</p>
      </div>
    </section>
  );
}
