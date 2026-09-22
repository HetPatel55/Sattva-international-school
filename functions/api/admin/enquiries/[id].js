// PATCH /api/admin/enquiries/:id { status?, notes? } · DELETE /api/admin/enquiries/:id
import { json, fail, readJson, handle, requireDb, clean, now } from '../../../../server/http.js';
import { ENQUIRY_STATUSES } from '../../../../server/data.js';
import { enquiryShape } from '../../../../server/enquiries.js';

export const onRequestPatch = handle(async ({ request, env, params }) => {
  const db = requireDb(env);
  const id = Number(params.id);
  const row = await db.prepare('SELECT * FROM enquiries WHERE id = ?').bind(id).first();
  if (!row) return fail(404, 'Enquiry not found.');

  const body = (await readJson(request)) ?? {};
  const status = ENQUIRY_STATUSES.includes(body.status) ? body.status : row.status;
  const notes = typeof body.notes === 'string' ? clean(body.notes, 4000) : row.notes;

  await db.prepare('UPDATE enquiries SET status = ?, notes = ?, updated_at = ? WHERE id = ?').bind(status, notes, now(), id).run();
  return json({ enquiry: enquiryShape({ ...row, status, notes, updated_at: now() }) });
});

export const onRequestDelete = handle(async ({ env, params }) => {
  const db = requireDb(env);
  const res = await db.prepare('DELETE FROM enquiries WHERE id = ?').bind(Number(params.id)).run();
  return res.meta.changes ? json({ ok: true }) : fail(404, 'Enquiry not found.');
});
