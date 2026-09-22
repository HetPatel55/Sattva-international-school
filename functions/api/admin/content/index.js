// GET /api/admin/content — every saved content area (draft), plus whether it
// has changes that visitors can't see yet.
import { json, handle, requireDb } from '../../../../server/http.js';
import { getMeta } from '../../../../server/data.js';

export const onRequestGet = handle(async ({ env }) => {
  const db = requireDb(env);
  const { results } = await db.prepare('SELECT key, draft, published, updated_at FROM content').all();
  const areas = Object.fromEntries(
    results.map((r) => [r.key, { data: JSON.parse(r.draft), updatedAt: r.updated_at, changed: r.draft !== r.published }]),
  );
  return json({ areas, lastPublish: Number(await getMeta(db, 'last_publish')) || null });
});
