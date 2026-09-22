import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Undo2, Loader2 } from 'lucide-react';
import { api } from './api';
import { useAdmin } from './adminContext';
import { SCHEMAS } from './schemas';
import { Fields } from './SchemaForm';
import { defaults } from '../data/defaults';

const ContentEdit = () => {
  const { key } = useParams();
  const schema = SCHEMAS[key];
  const { refresh, toast } = useAdmin();
  const [saved, setSaved] = useState(null); // { data, changed }
  const [value, setValue] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!schema) return;
    api('/api/admin/content')
      .then(({ areas }) => {
        // Saved fields override the defaults, so new fields always have a value.
        const data = { ...defaults[key], ...(areas[key]?.data ?? {}) };
        setSaved({ data, changed: Boolean(areas[key]?.changed) });
        setValue(data);
      })
      .catch((err) => setError(err.message));
  }, [key, schema]);

  const dirty = useMemo(() => saved && JSON.stringify(value) !== JSON.stringify(saved.data), [saved, value]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!schema) return <div className="adm-page"><p className="adm-error">Unknown section.</p></div>;

  const save = async () => {
    setBusy(true);
    try {
      await api(`/api/admin/content/${key}`, { method: 'PUT', body: { data: value } });
      setSaved({ data: value, changed: true });
      toast('Saved. Press Publish at the top to show it on the website.');
      refresh();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const discard = async () => {
    if (!window.confirm('Throw away the changes that are not published yet?')) return;
    try {
      await api(`/api/admin/content/${key}`, { method: 'DELETE' });
      const { areas } = await api('/api/admin/content');
      const data = { ...defaults[key], ...(areas[key]?.data ?? {}) };
      setSaved({ data, changed: false });
      setValue(data);
      toast('Changes discarded.');
      refresh();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  return (
    <div className="adm-page adm-page--form">
      <Link to="/admin/content" className="adm-back"><ArrowLeft size={16} aria-hidden="true" /> Website content</Link>
      <header className="adm-page__head">
        <h1>{schema.title}</h1>
        <p className="adm-muted">{schema.description}</p>
      </header>

      {error && <p className="adm-error">{error}</p>}
      {!value && !error && <div className="adm-center adm-center--inline"><Loader2 size={24} className="adm-spin" aria-label="Loading" /></div>}

      {value && (
        <>
          <div className="adm-card adm-form">
            <Fields fields={schema.fields} value={value} onChange={setValue} />
          </div>

          <div className="adm-savebar">
            <p>{dirty ? 'You have unsaved changes.' : saved.changed ? 'Saved — not published yet.' : 'Everything here is live.'}</p>
            {saved.changed && !dirty && (
              <button type="button" className="adm-btn adm-btn--ghost" onClick={discard}>
                <Undo2 size={16} aria-hidden="true" /> Discard
              </button>
            )}
            <button type="button" className="adm-btn adm-btn--primary" onClick={save} disabled={!dirty || busy}>
              {busy ? <Loader2 size={16} className="adm-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentEdit;
