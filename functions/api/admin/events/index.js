// GET  /api/admin/events — all events (published or not), newest first
// POST /api/admin/events — create an event
import { json, fail, readJson, handle, requireDb, now } from '../../../../server/http.js';
import { listEvents, getEvent, touchEvents } from '../../../../server/data.js';
import { eventColumns, uniqueSlug } from '../../../../server/events.js';

export const onRequestGet = handle(async ({ env }) => json({ events: await listEvents(requireDb(env)) }));

export const onRequestPost = handle(async ({ request, env }) => {
  const db = requireDb(env);
  const cols = eventColumns(await readJson(request));
  if (cols.error) return fail(400, cols.error);

  const t = now();
  const slug = await uniqueSlug(db, cols.title, cols.start_date);
  const res = await db
    .prepare(
      `INSERT INTO events (slug, title, description, start_date, end_date, show_from, show_until, cover, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(slug, cols.title, cols.description, cols.start_date, cols.end_date, cols.show_from, cols.show_until, cols.cover, cols.published, t, t)
    .run();
  await touchEvents(db);
  return json({ event: await getEvent(db, res.meta.last_row_id) }, { status: 201 });
});
