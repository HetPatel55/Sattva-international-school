import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { api } from './api';
import { SCHEMAS, AREA_ORDER } from './schemas';

const ContentList = () => {
  const [areas, setAreas] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/admin/content').then((d) => setAreas(d.areas)).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <h1>Website content</h1>
        <p className="adm-muted">
          Edit a section and press <b>Save</b>. Changes stay private until you press <b>Publish</b> at the top —
          then everyone sees them.
        </p>
      </header>

      {error && <p className="adm-error">{error}</p>}
      {!areas && !error && <div className="adm-center adm-center--inline"><Loader2 size={24} className="adm-spin" aria-label="Loading" /></div>}

      {areas && (
        <ul className="adm-areas">
          {AREA_ORDER.map((key) => (
            <li key={key}>
              <Link to={`/admin/content/${key}`} className="adm-area">
                <span>
                  <b>{SCHEMAS[key].title}</b>
                  <small>{SCHEMAS[key].description}</small>
                </span>
                {areas[key]?.changed && <span className="adm-chip adm-chip--scheduled">Not published</span>}
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContentList;
