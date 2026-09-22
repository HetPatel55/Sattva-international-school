import { useCallback, useMemo, useState } from 'react';
import { useContent } from '../content/context';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import QuoteBand from '../components/QuoteBand';
import Lightbox from '../components/Lightbox';

const Gallery = () => {
  const { school, gallery, quotes } = useContent();
  usePageMeta('Gallery', `Photos of the campus, activities and events at ${school.name}.`);
  const categories = useMemo(() => ['All', ...new Set(gallery.map((g) => g.category))], [gallery]);
  const [active, setActive] = useState('All');
  const [open, setOpen] = useState(null);

  const items = active === 'All' ? gallery : gallery.filter((g) => g.category === active);
  const count = items.length;
  // Stable callbacks so the lightbox's focus/keyboard effect runs once per opening
  const move = useCallback((dir) => setOpen((i) => (i + dir + count) % count), [count]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Life at SATTVA, in pictures"
        lead="A look at our campus, our classrooms and the moments our students remember."
      />

      <section className="section section--white">
        <div className="container">
          <div className="filter-bar" role="group" aria-label="Filter photos">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-bar__btn${active === c ? ' is-active' : ''}`}
                aria-pressed={active === c}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <ul className="photo-grid">
            {items.map((g, i) => (
              <li key={g.src}>
                <button type="button" className="photo-grid__item" onClick={() => setOpen(i)}>
                  <img src={g.thumb ?? g.src} alt={g.alt} loading="lazy" width="800" height="450" />
                  <span className="photo-grid__caption">{g.alt}</span>
                  {g.placeholder && <span className="photo-grid__sample">Sample photo</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {open !== null && <Lightbox items={items} index={open} onClose={close} onMove={move} />}

      <QuoteBand {...quotes.gallery} />
    </>
  );
};

export default Gallery;
