import { Link } from 'react-router-dom';
import { CalendarDays, Images, ArrowRight } from 'lucide-react';
import { useContent } from '../content/context';
import { isOnHome, today } from '../data/site';
import { formatRange } from '../data/dates';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import Photo from './Photo';

// "Happening at SATTVA": events inside their home-page date window. The date is
// checked in the visitor's browser, so posters appear and disappear on time.
// With nothing to show, this renders nothing and the home page is unchanged.
const HomeEvents = () => {
  const { events } = useContent();
  const day = today();
  const list = events
    .filter((e) => isOnHome(e, day))
    .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));

  if (!list.length) return null;

  return (
    <section className="events-home" aria-labelledby="events-home-title">
      <div className="container">
        <SectionHead eyebrow="Events" title="Happening at SATTVA" id="events-home-title" />
        <ul className={`event-posts${list.length === 1 ? ' event-posts--single' : ''}`}>
          {list.map((e, i) => (
            <Reveal as="li" key={e.id} className="event-post" delay={i * 80}>
              {e.cover && (
                <div className="event-post__media">
                  <Photo image={e.cover} alt={e.title} sizes="(min-width: 1024px) 420px, 85vw" loading={i ? 'lazy' : undefined} />
                </div>
              )}
              <div className="event-post__body">
                {e.startDate && (
                  <p className="event-post__date">
                    <CalendarDays size={16} aria-hidden="true" /> {formatRange(e.startDate, e.endDate)}
                  </p>
                )}
                <h3>{e.title}</h3>
                {e.description && <p className="event-post__text">{e.description}</p>}
                {e.photos.length > 0 && (
                  <Link to={`/events/${e.slug}`} className="text-link">
                    <Images size={16} aria-hidden="true" /> View photos ({e.photos.length})
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomeEvents;
