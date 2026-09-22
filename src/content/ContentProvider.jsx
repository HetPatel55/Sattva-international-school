import { useEffect, useMemo, useState } from 'react';
import { ContentContext } from './context';
import { resolveContent } from '../data/site';

// Published content baked in at build time by scripts/fetch-content.mjs.
// The file is optional: without it the site renders the defaults.
const baked = Object.values(import.meta.glob('../data/published.json', { eager: true, import: 'default' }))[0] ?? null;

const ContentProvider = ({ children }) => {
  const [data, setData] = useState({
    content: baked?.content ?? {},
    events: baked?.events ?? [],
    version: baked?.version ?? null,
    backend: false,
    ready: false, // true once the live check has finished, either way
  });

  // Pick up anything published since this build. When there is no API (e.g.
  // a plain static host) the request fails and the built-in content stays.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/published', { headers: { Accept: 'application/json' } })
      .then((res) => (res.ok && res.headers.get('content-type')?.includes('json') ? res.json() : null))
      .then((live) => {
        if (cancelled) return;
        if (!live) return setData((prev) => ({ ...prev, ready: true }));
        setData((prev) =>
          live.version === prev.version
            ? { ...prev, backend: true, ready: true }
            : { content: live.content ?? {}, events: live.events ?? [], version: live.version, backend: true, ready: true },
        );
      })
      .catch(() => {
        if (!cancelled) setData((prev) => ({ ...prev, ready: true }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ ...resolveContent(data.content, data.events), backend: data.backend, ready: data.ready }),
    [data],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export default ContentProvider;
