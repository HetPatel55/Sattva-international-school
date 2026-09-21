import TileMotif from './TileMotif';

const PageHero = ({ eyebrow, title, lead, children }) => (
  <section className="page-hero">
    <div className="container page-hero__inner">
      <div className="page-hero__text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
      <TileMotif className="page-hero__motif" />
    </div>
  </section>
);

export default PageHero;
