// POST /api/admin/events/:id/photos { images: [...] } — add album photos
// (already uploaded through /api/admin/upload).
import { json, fail, readJson, handle, requireDb, now } from '../../../../../server/http.js';
import { getEvent, touchEvents } from '../../../../../server/data.js';
import { photoImage } from '../../../../../server/events.js';

export const onRequestPost = handle(async ({ request, env, params }) => {
  const db = requireDb(env);
  const id = Number(params.id);
  if (!(await db.prepare('SELECT id FROM events WHERE id = ?').bind(id).first())) return fail(404, 'Event not found.');

  const body = await readJson(request);
  const images = (Array.isArray(body?.images) ? body.images : []).map(photoImage).filter(Boolean).slice(0, 100);
  if (!images.length) return fail(400, 'No photos received.');

  const last = await db.prepare('SELECT COALESCE(MAX(sort), 0) AS s FROM event_photos WHERE event_id = ?').bind(id).first();
  const t = now();
  await db.batch(
    images.map((img, i) =>
      db.prepare('INSERT INTO event_photos (event_id, image, sort, created_at) VALUES (?, ?, ?, ?)').bind(id, img, last.s + i + 1, t),
    ),
  );
  await db.prepare('UPDATE events SET updated_at = ? WHERE id = ?').bind(t, id).run();
  await touchEvents(db);
  return json({ event: await getEvent(db, id) }, { status: 201 });
});
