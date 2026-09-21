import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { school, gallery, quotes } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import QuoteBand from '../components/QuoteBand';

const Lightbox = ({ items, index, onClose, onMove }) => {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const item = items[index];

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add('menu-open');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'ArrowRight') onMove(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
      previousFocus?.focus?.();
    };
  }, [onClose, onMove]);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onMove(dx > 0 ? -1 : 1);
        touchX.current = null;
      }}
    >
      <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close">
        <X size={24} aria-hidden="true" />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" className="lightbox__btn lightbox__prev" aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); onMove(-1); }}>
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="lightbox__btn lightbox__next" aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); onMove(1); }}>
            <ChevronRight size={26} aria-hidden="true" />
          </button>
        </>
      )}
      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        <figcaption>
          {item.alt}
          <span>{index + 1} / {items.length}</span>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
};

const Gallery = () => {
  usePageMeta('Gallery', `Photos of the campus, activities and events at ${school.name}.`);
  const categories = useMemo(() => ['All', ...new Set(gallery.map((g) => g.category))], []);
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
