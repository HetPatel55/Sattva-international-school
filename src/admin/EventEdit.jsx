import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, ImagePlus, X, Loader2, ExternalLink } from 'lucide-react';
import { api } from './api';
import { uploadImage } from './images';
import { useAdmin, eventState } from './adminContext';
import { ImageField } from './SchemaForm';
import { today } from '../data/site';

const EMPTY = { title: '', description: '', startDate: '', endDate: '', showFrom: '', showUntil: '', cover: null, published: true };

const DateInput = ({ id, label, value, onChange, help }) => (
  <div className="adm-field">
    <label className="adm-label" htmlFor={id}>
      {label}
      {help && <span className="adm-help">{help}</span>}
    </label>
    <input id={id} type="date" className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Album = ({ event, onEvent }) => {
  const { toast } = useAdmin();
  const input = useRef(null);
  const [progress, setProgress] = useState(null); // { done, total }

  const add = async (e) => {
    const files = [...(e.target.files ?? [])];
    e.target.value = '';
    if (!files.length) return;
    setProgress({ done: 0, total: files.length });
    const images = [];
    for (const file of files) {
      try {
        images.push(await uploadImage(file));
      } catch (err) {
        toast(`${file.name}: ${err.message}`, 'error');
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }
    try {
      if (images.length) {
        const { event: next } = await api(`/api/admin/events/${event.id}/photos`, { method: 'POST', body: { images } });
        onEvent(next);
        toast(`${images.length} photo${images.length > 1 ? 's' : ''} added to the album.`);
      }
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setProgress(null);
    }
  };

  const remove = async (photo) => {
    if (!window.confirm('Remove this photo from the album?')) return;
    try {
      const { event: next } = await api(`/api/admin/events/${event.id}/photos/${photo.id}`, { method: 'DELETE' });
      onEvent(next);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <section className="adm-card">
      <div className="adm-card__head">
        <h2>Photo album <span className="adm-count">{event.photos.length}</span></h2>
        <button type="button" className="adm-btn adm-btn--soft" onClick={() => input.current?.click()} disabled={Boolean(progress)}>
          {progress ? <Loader2 size={16} className="adm-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
          {progress ? `Uploading ${progress.done} of ${progress.total}…` : 'Add photos'}
        </button>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={add} />
      </div>
      <p className="adm-muted adm-small">Pick many photos at once from your phone. They’re made smaller automatically before uploading.</p>
      {event.photos.length ? (
        <ul className="adm-album">
          {event.photos.map((p) => (
            <li key={p.id}>
              <img src={p.thumb || p.src} alt="" loading="lazy" />
              <button type="button" className="adm-album__remove" onClick={() => remove(p)} aria-label="Remove photo"><X size={16} /></button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="adm-empty adm-empty--sm">No photos yet. After the event, add photos here — they appear on the event’s page and in Gallery → Events.</p>
      )}
    </section>
  );
};

const EventEdit = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { refresh, toast } = useAdmin();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState(isNew ? EMPTY : null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    api(`/api/admin/events/${id}`)
      .then(({ event: e }) => {
        setEvent(e);
        setForm({ ...EMPTY, ...e });
      })
      .catch((err) => setError(err.message));
  }, [id, isNew]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = { ...form };
      const { event: saved } = isNew
        ? await api('/api/admin/events', { method: 'POST', body })
        : await api(`/api/admin/events/${id}`, { method: 'PUT', body });
      toast(isNew ? 'Event created. You can add album photos below.' : 'Event saved — it’s live on the website.');
      refresh();
      if (isNew) navigate(`/admin/events/${saved.id}`, { replace: true });
      else {
        setEvent(saved);
        setForm({ ...EMPTY, ...saved });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete “${event.title}” and all its photos? This can’t be undone.`)) return;
    try {
      await api(`/api/admin/events/${id}`, { method: 'DELETE' });
      toast('Event deleted.');
      refresh();
      navigate('/admin/events');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  if (!form) {
    return error ? <div className="adm-page"><p className="adm-error">{error}</p></div>
      : <div className="adm-center adm-center--inline"><Loader2 size={24} className="adm-spin" aria-label="Loading" /></div>;
  }

  const state = eventState(form, today());

  return (
    <div className="adm-page">
      <Link to="/admin/events" className="adm-back"><ArrowLeft size={16} aria-hidden="true" /> All events</Link>
      <header className="adm-page__head">
        <h1>{isNew ? 'New event' : form.title || 'Event'}</h1>
        {!isNew && (
          <p className="adm-event-status">
            <span className={`adm-chip adm-chip--${state.key}`}>{state.label}</span>
            {event?.published && (
              <a href={`/events/${event.slug}`} target="_blank" rel="noopener" className="adm-link">
                View on website <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </p>
        )}
      </header>

      <form className="adm-card adm-form" onSubmit={save}>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ev-title">Title</label>
          <input id="ev-title" className="adm-input" required maxLength={120} placeholder="Diwali Celebration"
            value={form.title} onChange={(e) => set('title')(e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="ev-desc">Short description <span className="adm-help">One or two lines, shown under the title.</span></label>
          <textarea id="ev-desc" className="adm-input" rows={3} maxLength={1000}
            placeholder="Join us for rangoli, diya decoration and a cultural programme."
            value={form.description} onChange={(e) => set('description')(e.target.value)} />
        </div>

        <div className="adm-row-2">
          <DateInput id="ev-start" label="Event date" value={form.startDate} onChange={set('startDate')} />
          <DateInput id="ev-end" label="Ends on (if more than one day)" value={form.endDate} onChange={set('endDate')} />
        </div>

        <ImageField
          field={{ label: 'Poster / cover photo', help: 'E.g. a Happy Diwali poster. Shown whole on the home page, never cropped.' }}
          value={form.cover}
          onChange={set('cover')}
        />

        <fieldset className="adm-group">
          <legend className="adm-label">When should it show on the home page?</legend>
          <p className="adm-muted adm-small">Leave both empty to show it from now until the event is over. After that it moves to the Gallery automatically.</p>
          <div className="adm-row-2">
            <DateInput id="ev-from" label="Show from" value={form.showFrom} onChange={set('showFrom')} />
            <DateInput id="ev-until" label="Show until" value={form.showUntil} onChange={set('showUntil')} />
          </div>
        </fieldset>

        <div className="adm-field adm-field--toggle">
          <input id="ev-pub" type="checkbox" className="adm-switch" checked={form.published} onChange={(e) => set('published')(e.target.checked)} />
          <label className="adm-label" htmlFor="ev-pub">
            Published
            <span className="adm-help">Turn off to hide this event from the website without deleting it.</span>
          </label>
        </div>

        {error && <p className="adm-error" role="alert">{error}</p>}

        <div className="adm-form__actions">
          <button type="submit" className="adm-btn adm-btn--primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="adm-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            {isNew ? 'Create event' : 'Save event'}
          </button>
          {!isNew && (
            <button type="button" className="adm-btn adm-btn--danger" onClick={remove}>
              <Trash2 size={16} aria-hidden="true" /> Delete
            </button>
          )}
        </div>
        <p className="adm-muted adm-small">Events go live as soon as you save — no need to press Publish.</p>
      </form>

      {!isNew && event && <Album event={event} onEvent={(next) => { setEvent(next); refresh(); }} />}
    </div>
  );
};

export default EventEdit;
