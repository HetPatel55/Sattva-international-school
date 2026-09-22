// Small helpers shared by the Cloudflare Pages Functions in /functions.

export const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers ?? {}),
    },
  });

export const fail = (status, message, extra = {}) => json({ error: message, ...extra }, { status });

export const readJson = async (request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

export const now = () => Date.now();

export const clientIp = (request) =>
  request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';

// Trim a string and cap its length; anything else becomes ''.
export const clean = (value, max = 500) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export const requireDb = (env) => {
  if (!env.DB) throw fail(503, 'The database is not connected.');
  return env.DB;
};

// Wraps a handler so thrown Responses (e.g. from requireDb) are returned and
// unexpected errors become a clean 500 instead of an HTML error page.
export const handle = (fn) => async (ctx) => {
  try {
    return await fn(ctx);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error(err);
    return fail(500, 'Something went wrong. Please try again.');
  }
};

// Simple sliding-window limiter backed by the `hits` table.
export const tooMany = async (db, scope, ip, limit, windowMs) => {
  const since = now() - windowMs;
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM hits WHERE scope = ? AND ip = ? AND at > ?')
    .bind(scope, ip, since)
    .first();
  return (row?.n ?? 0) >= limit;
};

export const recordHit = (db, scope, ip) =>
  db.prepare('INSERT INTO hits (scope, ip, at) VALUES (?, ?, ?)').bind(scope, ip, now()).run();

export const clearHits = (db, scope, ip) =>
  db.prepare('DELETE FROM hits WHERE scope = ? AND ip = ?').bind(scope, ip).run();

export const slugify = (text) =>
  String(text).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'event';
