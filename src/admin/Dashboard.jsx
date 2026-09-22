import { Link } from 'react-router-dom';
import { Inbox, CalendarPlus, School, Images, Download, FileSpreadsheet, ArrowRight, Loader2 } from 'lucide-react';
import { useAdmin, STATUS_LABELS, timeAgo, eventState } from './adminContext';
import { download } from './api';
import { today } from '../data/site';

const Stat = ({ label, value, to, accent }) => {
  const body = (
    <>
      <strong>{value}</strong>
      <span>{label}</span>
    </>
  );
  return to ? (
    <Link to={to} className={`adm-stat${accent ? ' adm-stat--accent' : ''}`}>{body}</Link>
  ) : (
    <div className="adm-stat">{body}</div>
  );
};

const Dashboard = () => {
  const { stats } = useAdmin();
  if (!stats) return <div className="adm-center adm-center--inline"><Loader2 size={24} className="adm-spin" aria-label="Loading" /></div>;

  const { enquiries: e } = stats;
  const day = today();
  const current = stats.events.filter((ev) => ['live', 'scheduled'].includes(eventState(ev, day).key));

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <h1>Dashboard</h1>
        {stats.unpublishedChanges > 0 && (
          <p className="adm-note">
            You have saved changes in {stats.unpublishedChanges} section{stats.unpublishedChanges > 1 ? 's' : ''} that
            visitors can’t see yet. Press <b>Publish</b> at the top when you’re ready.
          </p>
        )}
      </header>

      <section className="adm-stats" aria-label="Enquiries">
        <Stat label="New enquiries" value={e.new} to="/admin/enquiries?status=new" accent={e.new > 0} />
        <Stat label="Today" value={e.today} />
        <Stat label="Last 7 days" value={e.week} />
        <Stat label="All enquiries" value={e.total} to="/admin/enquiries" />
      </section>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card__head">
            <h2>Latest enquiries</h2>
            <Link to="/admin/enquiries" className="adm-link">See all <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {e.recent.length ? (
            <ul className="adm-list">
              {e.recent.map((q) => (
                <li key={q.id}>
                  <Link to={`/admin/enquiries?open=${q.id}`} className="adm-list__row">
                    <span>
                      <b>{q.name}</b>
                      <small>{q.type === 'admission' ? q.standard || 'Admission' : q.subject || 'General'} · {timeAgo(q.createdAt)}</small>
                    </span>
                    <span className={`adm-chip adm-chip--${q.status}`}>{STATUS_LABELS[q.status]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="adm-muted">No enquiries yet. They appear here as soon as a parent sends the form on the website.</p>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card__head">
            <h2>Events on the home page</h2>
            <Link to="/admin/events" className="adm-link">All events <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>
          {current.length ? (
            <ul className="adm-list">
              {current.map((ev) => (
                <li key={ev.id}>
                  <Link to={`/admin/events/${ev.id}`} className="adm-list__row">
                    <span>
                      <b>{ev.title}</b>
                      <small>{eventState(ev, day).label}</small>
                    </span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="adm-muted">Nothing on the home page right now — it looks exactly as usual.</p>
          )}
          {e.byStandard.length > 0 && (
            <>
              <h3 className="adm-subhead">Most asked-about standards</h3>
              <ul className="adm-bars">
                {e.byStandard.map((s) => (
                  <li key={s.standard}>
                    <span>{s.standard}</span>
                    <span className="adm-bars__track"><span style={{ width: `${(s.n / e.byStandard[0].n) * 100}%` }} /></span>
                    <b>{s.n}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <section className="adm-card">
        <h2>Quick actions</h2>
        <div className="adm-actions">
          <Link to="/admin/events/new" className="adm-action"><CalendarPlus size={20} aria-hidden="true" /> Add an event</Link>
          <Link to="/admin/enquiries?status=new" className="adm-action"><Inbox size={20} aria-hidden="true" /> Call new enquiries</Link>
          <Link to="/admin/content/gallery" className="adm-action"><Images size={20} aria-hidden="true" /> Change gallery photos</Link>
          <Link to="/admin/content/school" className="adm-action"><School size={20} aria-hidden="true" /> Edit school details</Link>
          <button type="button" className="adm-action" onClick={() => download('/api/admin/enquiries/export')}>
            <FileSpreadsheet size={20} aria-hidden="true" /> Enquiries to Excel
          </button>
          <button type="button" className="adm-action" onClick={() => download('/api/admin/backup')}>
            <Download size={20} aria-hidden="true" /> Download backup
          </button>
        </div>
        {stats.lastPublish && <p className="adm-muted adm-small">Website last published {timeAgo(stats.lastPublish)}.</p>}
      </section>
    </div>
  );
};

export default Dashboard;
