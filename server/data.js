import { now } from './http.js';

// Content areas the admin panel may save (mirrors src/data/defaults.js).
export const CONTENT_KEYS = [
  'announcement', 'school', 'home', 'about', 'academics', 'campus',
  'admissions', 'gallery', 'quotes', 'voices', 'settings',
];

export const ENQUIRY_STATUSES = ['new', 'called', 'visit', 'admitted', 'closed'];

const parse = (text, fallback = null) => {
  try {
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

export const getMeta = async (db, key) =>
  (await db.prepare('SELECT value FROM meta WHERE key = ?').bind(key).first())?.value ?? null;

export const setMeta = (db, key, value) =>
  db.prepare('INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(key, String(value))
    .run();

// Any change to events bumps this, so visitors' pages pick it up.
export const touchEvents = (db) => setMeta(db, 'events_version', now());

const eventShape = (row, photos = []) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  description: row.description ?? '',
  startDate: row.start_date ?? '',
  endDate: row.end_date ?? '',
  showFrom: row.show_from ?? '',
  showUntil: row.show_until ?? '',
  cover: parse(row.cover),
  published: Boolean(row.published),
  photos,
});

const photosByEvent = async (db, ids) => {
  if (!ids.length) return new Map();
  const { results } = await db
    .prepare(`SELECT id, event_id, image FROM event_photos WHERE event_id IN (${ids.map(() => '?').join(',')}) ORDER BY sort, id`)
    .bind(...ids)
    .all();
  const map = new Map();
  for (const r of results) {
    const list = map.get(r.event_id) ?? [];
    list.push({ id: r.id, ...parse(r.image, {}) });
    map.set(r.event_id, list);
  }
  return map;
};

export const listEvents = async (db, { publishedOnly = false } = {}) => {
  const { results } = await db
    .prepare(`SELECT * FROM events ${publishedOnly ? 'WHERE published = 1' : ''} ORDER BY COALESCE(start_date, '') DESC, id DESC`)
    .all();
  const photos = await photosByEvent(db, results.map((r) => r.id));
  return results.map((r) => eventShape(r, photos.get(r.id) ?? []));
};

export const getEvent = async (db, id) => {
  const row = await db.prepare('SELECT * FROM events WHERE id = ?').bind(id).first();
  if (!row) return null;
  const photos = await photosByEvent(db, [row.id]);
  return eventShape(row, photos.get(row.id) ?? []);
};

// What visitors see: published content + published events, with a version
// string that changes whenever either does.
export const publishedPayload = async (db) => {
  const { results } = await db.prepare('SELECT key, published FROM content WHERE published IS NOT NULL').all();
  const content = Object.fromEntries(results.map((r) => [r.key, parse(r.published, {})]));
  const events = (await listEvents(db, { publishedOnly: true })).map((e) => ({ ...e, published: undefined }));
  const version = `${(await getMeta(db, 'content_version')) ?? 0}.${(await getMeta(db, 'events_version')) ?? 0}`;
  return { version, content, events };
};

// Deletes stored image files that are no longer referenced (best effort).
export const deleteImages = async (env, images) => {
  if (!env.MEDIA) return;
  const keys = images.flatMap((img) => (img?.key ? [img.key, img.thumbKey].filter(Boolean) : []));
  if (keys.length) await env.MEDIA.delete(keys).catch(() => {});
};
