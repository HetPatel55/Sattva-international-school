import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, MessageCircle, Mail, Search, FileSpreadsheet, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { api, download } from './api';
import { useAdmin, STATUS_LABELS, timeAgo } from './adminContext';
import { STANDARDS } from '../data/forms';

const STATUSES = Object.keys(STATUS_LABELS);

const EnquiryCard = ({ q, open, onToggle, onChange, onDelete }) => {
  const [notes, setNotes] = useState(q.notes);
  const [saving, setSaving] = useState(false);
  const wa = `https://wa.me/91${q.phone}`;

  const saveNotes = async () => {
    if (notes === q.notes) return;
    setSaving(true);
    await onChange({ notes });
    setSaving(false);
  };

  return (
    <li className={`adm-enq${open ? ' is-open' : ''}${q.status === 'new' ? ' is-new' : ''}`}>
      <button type="button" className="adm-enq__head" onClick={onToggle} aria-expanded={open}>
        <span className="adm-enq__who">
          <b>{q.name}</b>
          <small>
            {q.type === 'admission'
              ? [q.standard, q.medium && `${q.medium} medium`].filter(Boolean).join(' · ') || 'Admission'
              : q.subject || 'General'}
            {' · '}
            {timeAgo(q.createdAt)}
          </small>
        </span>
        <span className={`adm-chip adm-chip--${q.status}`}>{STATUS_LABELS[q.status]}</span>
        <ChevronDown size={18} aria-hidden="true" className="adm-enq__chev" />
      </button>

      <div className="adm-enq__quick">
        <a href={`tel:+91${q.phone}`} className="adm-btn adm-btn--soft adm-btn--sm"><Phone size={15} aria-hidden="true" /> {q.phone}</a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--soft adm-btn--sm"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a>
        <select
          className="adm-input adm-input--sm"
          aria-label={`Status for ${q.name}`}
          value={q.status}
          onChange={(e) => onChange({ status: e.target.value })}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {open && (
        <div className="adm-enq__body">
          <dl className="adm-dl">
            <div><dt>Type</dt><dd>{q.type === 'admission' ? 'Admission enquiry' : 'General message'}</dd></div>
            {q.child && <div><dt>Child</dt><dd>{q.child}</dd></div>}
            {q.standard && <div><dt>Standard</dt><dd>{q.standard}</dd></div>}
            {q.medium && <div><dt>Medium</dt><dd>{q.medium}</dd></div>}
            {q.subject && <div><dt>Topic</dt><dd>{q.subject}</dd></div>}
            {q.email && <div><dt>Email</dt><dd><a href={`mailto:${q.email}`}><Mail size={14} aria-hidden="true" /> {q.email}</a></dd></div>}
            <div><dt>Received</dt><dd>{new Date(q.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</dd></div>
          </dl>
          {q.message && <p className="adm-enq__msg">{q.message}</p>}
          <div className="adm-field">
            <label className="adm-label" htmlFor={`notes-${q.id}`}>Notes (only you see these)</label>
            <textarea id={`notes-${q.id}`} className="adm-input" rows={3} value={notes}
              placeholder="e.g. Called on Monday, visiting Saturday 10 AM" onChange={(e) => setNotes(e.target.value)} onBlur={saveNotes} />
            {notes !== q.notes && (
              <button type="button" className="adm-btn adm-btn--soft adm-btn--sm" onClick={saveNotes} disabled={saving}>
                {saving ? 'Saving…' : 'Save notes'}
              </button>
            )}
          </div>
          <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={onDelete}>
            <Trash2 size={15} aria-hidden="true" /> Delete enquiry
          </button>
        </div>
      )}
    </li>
  );
};

const Enquiries = () => {
  const { refresh, toast } = useAdmin();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(params.get('q') ?? '');
  const openId = Number(params.get('open')) || null;

  const filters = new URLSearchParams();
  for (const k of ['status', 'type', 'standard', 'q', 'page']) if (params.get(k)) filters.set(k, params.get(k));
  const query = filters.toString();

  const load = useCallback(() => {
    api(`/api/admin/enquiries${query ? `?${query}` : ''}`)
      .then((d) => { setData(d); setError(''); })
      .catch((err) => setError(err.message));
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  // Search as you type, after a short pause.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get('q') ?? '') === search) return;
      const next = new URLSearchParams(params);
      if (search) next.set('q', search); else next.delete('q');
      next.delete('page');
      setParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [search, params, setParams]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (key !== 'page') next.delete('page');
    if (value) next.set(key, value); else next.delete(key);
    next.delete('open');
    setParams(next);
  };

  const toggle = (id) => {
    const next = new URLSearchParams(params);
    if (openId === id) next.delete('open'); else next.set('open', id);
    setParams(next, { replace: true });
  };

  const update = async (q, patch) => {
    try {
      const { enquiry } = await api(`/api/admin/enquiries/${q.id}`, { method: 'PATCH', body: patch });
      setData((d) => ({ ...d, enquiries: d.enquiries.map((x) => (x.id === q.id ? enquiry : x)) }));
      if (patch.status) {
        toast(`Marked as “${STATUS_LABELS[patch.status]}”.`);
        refresh();
      } else toast('Notes saved.');
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const remove = async (q) => {
    if (!window.confirm(`Delete the enquiry from ${q.name}? This can’t be undone.`)) return;
    try {
      await api(`/api/admin/enquiries/${q.id}`, { method: 'DELETE' });
      toast('Enquiry deleted.');
      load();
      refresh();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const status = params.get('status') ?? '';
  const counts = data?.counts ?? {};
  const all = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="adm-page">
      <header className="adm-page__head adm-page__head--row">
        <h1>Enquiries</h1>
        <button type="button" className="adm-btn adm-btn--soft" onClick={() => download(`/api/admin/enquiries/export${query ? `?${query}` : ''}`)}>
          <FileSpreadsheet size={16} aria-hidden="true" /> Excel
        </button>
      </header>

      <div className="adm-chips" role="group" aria-label="Filter by status">
        <button type="button" className={`adm-filter${!status ? ' is-on' : ''}`} onClick={() => setFilter('status', '')}>All <b>{all}</b></button>
        {STATUSES.map((s) => (
          <button key={s} type="button" className={`adm-filter${status === s ? ' is-on' : ''}`} onClick={() => setFilter('status', s)}>
            {STATUS_LABELS[s]} <b>{counts[s] ?? 0}</b>
          </button>
        ))}
      </div>

      <div className="adm-toolbar">
        <label className="adm-search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Search name, phone, message…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search enquiries" />
        </label>
        <select className="adm-input" aria-label="Type" value={params.get('type') ?? ''} onChange={(e) => setFilter('type', e.target.value)}>
          <option value="">All types</option>
          <option value="admission">Admission</option>
          <option value="general">General</option>
        </select>
        <select className="adm-input" aria-label="Standard" value={params.get('standard') ?? ''} onChange={(e) => setFilter('standard', e.target.value)}>
          <option value="">All standards</option>
          {STANDARDS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {error && <p className="adm-error">{error}</p>}
      {!data && !error && <div className="adm-center adm-center--inline"><Loader2 size={24} className="adm-spin" aria-label="Loading" /></div>}

      {data && (
        data.enquiries.length ? (
          <>
            <ul className="adm-enqs">
              {data.enquiries.map((q) => (
                <EnquiryCard key={`${q.id}-${q.updatedAt}`} q={q} open={openId === q.id}
                  onToggle={() => toggle(q.id)} onChange={(patch) => update(q, patch)} onDelete={() => remove(q)} />
              ))}
            </ul>
            {data.pages > 1 && (
              <nav className="adm-pager" aria-label="Pages">
                <button type="button" className="adm-btn adm-btn--soft" disabled={data.page <= 1} onClick={() => setFilter('page', String(data.page - 1))}>Previous</button>
                <span>Page {data.page} of {data.pages}</span>
                <button type="button" className="adm-btn adm-btn--soft" disabled={data.page >= data.pages} onClick={() => setFilter('page', String(data.page + 1))}>Next</button>
              </nav>
            )}
          </>
        ) : (
          <p className="adm-empty">{query ? 'No enquiries match these filters.' : 'No enquiries yet. They appear here as soon as a parent sends a form on the website.'}</p>
        )
      )}
    </div>
  );
};

export default Enquiries;
