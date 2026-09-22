import { useEffect, useRef } from 'react';

// Cloudflare Turnstile spam check. "interaction-only" keeps it invisible for
// normal visitors; a small box only appears if Cloudflare needs a click.
// The default key is Cloudflare's public test key (always passes) for local use.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let loading;
const loadScript = () => {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return loading;
};

const Turnstile = ({ onToken, resetKey }) => {
  const box = useRef(null);
  const tokenCb = useRef(onToken);

  useEffect(() => {
    tokenCb.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let id;
    let cancelled = false;
    loadScript()
      .then((ts) => {
        if (cancelled || !box.current) return;
        id = ts.render(box.current, {
          sitekey: SITE_KEY,
          appearance: 'interaction-only',
          callback: (t) => tokenCb.current(t),
          'expired-callback': () => tokenCb.current(''),
          'error-callback': () => tokenCb.current(''),
        });
      })
      .catch(() => tokenCb.current(''));
    return () => {
      cancelled = true;
      if (id !== undefined) window.turnstile?.remove(id);
    };
  }, [resetKey]);

  return <div ref={box} className="turnstile" />;
};

export default Turnstile;
