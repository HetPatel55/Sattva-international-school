// PUT /api/admin/content/:key { data } — save one content area as a draft.
// Visitors only see it after Publish.
import { json, fail, readJson, handle, requireDb, now } from '../../../../server/http.js';
import { CONTENT_KEYS } from '../../../../server/data.js';

export const onRequestPut = handle(async ({ request, env, params }) => {
  const db = requireDb(env);
  if (!CONTENT_KEYS.includes(params.key)) return fail(404, 'Unknown section.');

  const body = await readJson(request);
  if (!body || typeof body.data !== 'object' || body.data === null || Array.isArray(body.data)) {
    return fail(400, 'Invalid content.');
  }
  const draft = JSON.stringify(body.data);
  if (draft.length > 200_000) return fail(413, 'This section is too large to save.');

  await db
    .prepare(
      `INSERT INTO content (key, draft, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET draft = excluded.draft, updated_at = excluded.updated_at`,
    )
    .bind(params.key, draft, now())
    .run();
  return json({ ok: true });
});

// DELETE /api/admin/content/:key — discard unpublished changes to this area
// (back to what visitors see now; never-published areas go back to the defaults).
export const onRequestDelete = handle(async ({ env, params }) => {
  const db = requireDb(env);
  if (!CONTENT_KEYS.includes(params.key)) return fail(404, 'Unknown section.');
  await db.batch([
    db.prepare('DELETE FROM content WHERE key = ? AND published IS NULL').bind(params.key),
    db.prepare('UPDATE content SET draft = published WHERE key = ? AND published IS NOT NULL').bind(params.key),
  ]);
  return json({ ok: true });
});
