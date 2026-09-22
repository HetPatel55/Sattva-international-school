// GET / PUT / DELETE /api/admin/events/:id
import { json, fail, readJson, handle, requireDb, now } from '../../../../server/http.js';
import { getEvent, touchEvents, deleteImages } from '../../../../server/data.js';
import { eventColumns, uniqueSlug } from '../../../../server/events.js';

export const onRequestGet = handle(async ({ env, params }) => {
  const event = await getEvent(requireDb(env), Number(params.id));
  return event ? json({ event }) : fail(404, 'Event not found.');
});

export const onRequestPut = handle(async ({ request, env, params }) => {
  const db = requireDb(env);
  const id = Number(params.id);
  const before = await getEvent(db, id);
  if (!before) return fail(404, 'Event not found.');

  const cols = eventColumns(await readJson(request));
  if (cols.error) return fail(400, cols.error);

  // Keep the address stable once published so shared links keep working.
  const slug = before.published ? before.slug : await uniqueSlug(db, cols.title, cols.start_date, id);
  await db
    .prepare(
      `UPDATE events SET slug = ?, title = ?, description = ?, start_date = ?, end_date = ?, show_from = ?, show_until = ?,
       cover = ?, published = ?, updated_at = ? WHERE id = ?`,
    )
    .bind(slug, cols.title, cols.description, cols.start_date, cols.end_date, cols.show_from, cols.show_until, cols.cover, cols.published, now(), id)
    .run();

  // A replaced poster's old files are no longer needed.
  const newCover = cols.cover ? JSON.parse(cols.cover) : null;
  if (before.cover?.key && before.cover.key !== newCover?.key) await deleteImages(env, [before.cover]);

  await touchEvents(db);
  return json({ event: await getEvent(db, id) });
});

export const onRequestDelete = handle(async ({ env, params }) => {
  const db = requireDb(env);
  const id = Number(params.id);
  const event = await getEvent(db, id);
  if (!event) return fail(404, 'Event not found.');
  await db.batch([
    db.prepare('DELETE FROM event_photos WHERE event_id = ?').bind(id),
    db.prepare('DELETE FROM events WHERE id = ?').bind(id),
  ]);
  await deleteImages(env, [event.cover, ...event.photos]);
  await touchEvents(db);
  return json({ ok: true });
});
