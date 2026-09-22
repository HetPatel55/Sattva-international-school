// DELETE /api/admin/events/:id/photos/:photoId — remove one album photo
import { json, fail, handle, requireDb, now } from '../../../../../../server/http.js';
import { getEvent, touchEvents, deleteImages } from '../../../../../../server/data.js';

export const onRequestDelete = handle(async ({ env, params }) => {
  const db = requireDb(env);
  const id = Number(params.id);
  const photoId = Number(params.photoId);
  const row = await db.prepare('SELECT image FROM event_photos WHERE id = ? AND event_id = ?').bind(photoId, id).first();
  if (!row) return fail(404, 'Photo not found.');

  await db.prepare('DELETE FROM event_photos WHERE id = ?').bind(photoId).run();
  await db.prepare('UPDATE events SET updated_at = ? WHERE id = ?').bind(now(), id).run();
  await deleteImages(env, [JSON.parse(row.image)]);
  await touchEvents(db);
  return json({ event: await getEvent(db, id) });
});
