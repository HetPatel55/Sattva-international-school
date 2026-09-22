import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, CalendarDays, Images, Loader2 } from 'lucide-react';
import { api } from './api';
import { eventState } from './adminContext';
import { today } from '../data/site';
import { formatRange } from '../data/dates';

const Events = () => {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/events').then((d) => setEvents(d.events)).catch((err) => setError(err.message));
  }, []);

  const day = today();

  return (
    <div className="adm-page">
      <header className="adm-page__head adm-page__head--row">
        <div>
          <h1>Events</h1>
          <p className="adm-muted">Posters for festivals and school events. Each one shows on the home page for the dates you choose, and its photos go into the Gallery.</p>
        </div>
        <Link to="/admin/events/new" className="adm-btn adm-btn--primary"><CalendarPlus size={16} aria-hidden="true" /> Add event</Link>
      </header>

      {error && <p className="adm-error">{error}</p>}
      {!events && !error && <div className="adm-center adm-center--inline"><Loader2 size={24} className="adm-spin" aria-label="Loading" /></div>}

      {events && (events.length ? (
        <ul className="adm-events">
          {events.map((e) => {
            const state = eventState(e, day);
            return (
              <li key={e.id}>
                <Link to={`/admin/events/${e.id}`} className="adm-event">
                  <span className="adm-event__media">
                    {e.cover ? <img src={e.cover.thumb || e.cover.src} alt="" /> : <CalendarDays size={28} aria-hidden="true" />}
                  </span>
                  <span className="adm-event__body">
                    <b>{e.title}</b>
                    <small>{e.startDate ? formatRange(e.startDate, e.endDate) : 'No date set'}</small>
                    <span className="adm-event__meta">
                      <span className={`adm-chip adm-chip--${state.key}`}>{state.label}</span>
                      <span className="adm-muted"><Images size={14} aria-hidden="true" /> {e.photos.length}</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="adm-empty">
          <p>No events yet.</p>
          <p className="adm-muted">Add your first one, e.g. “Diwali Celebration” with a Happy Diwali poster.</p>
        </div>
      ))}
    </div>
  );
};

export default Events;
