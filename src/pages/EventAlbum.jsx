import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useContent } from '../content/context';
import { formatRange } from '../data/dates';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import Lightbox from '../components/Lightbox';
import NotFound from './NotFound';

const EventAlbum = () => {
  const { slug } = useParams();
  const { events, ready } = useContent();
  const event = events.find((e) => e.slug === slug);
  usePageMeta(event?.title ?? 'Event', event?.description || undefined);

  const photos = event?.photos.map((p) => ({ ...p, alt: p.alt || event.title })) ?? [];
  const count = photos.length;
  const [open, setOpen] = useState(null);
  const move = useCallback((dir) => setOpen((i) => (i + dir + count) % count), [count]);
  const close = useCallback(() => setOpen(null), []);

  if (!event) {
    return ready ? <NotFound /> : <div className="page-loader" role="status" aria-label="Loading"><span /></div>;
  }

  return (
    <>
      <PageHero eyebrow="Event" title={event.title} lead={event.description}>
        {event.startDate && (
          <p className="album-date">
            <CalendarDays size={18} aria-hidden="true" /> {formatRange(event.startDate, event.endDate)}
          </p>
        )}
      </PageHero>

      <section className="section section--white">
        <div className="container">
          {count ? (
            <ul className="photo-grid">
              {photos.map((p, i) => (
                <li key={p.src}>
                  <button type="button" className="photo-grid__item" onClick={() => setOpen(i)}>
                    <img src={p.thumb ?? p.src} alt={p.alt} loading="lazy" width="800" height="450" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lead">Photos from this event will be added soon.</p>
          )}
          <p className="center-link">
            <Link to="/gallery" className="text-link">
              <ArrowLeft size={16} aria-hidden="true" /> Back to the gallery
            </Link>
          </p>
        </div>
      </section>

      {open !== null && <Lightbox items={photos} index={open} onClose={close} onMove={move} />}
    </>
  );
};

export default EventAlbum;
