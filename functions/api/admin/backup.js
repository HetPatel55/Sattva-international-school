// GET /api/admin/backup — everything in the database as one JSON download
// (content, events and their photo references, enquiries).
import { handle, requireDb } from '../../../server/http.js';

export const onRequestGet = handle(async ({ env }) => {
  const db = requireDb(env);
  const [content, events, photos, enquiries, meta] = await Promise.all(
    ['content', 'events', 'event_photos', 'enquiries', 'meta'].map((t) => db.prepare(`SELECT * FROM ${t}`).all().then((r) => r.results)),
  );
  const day = new Date().toISOString().slice(0, 10);
  const body = JSON.stringify({ exportedAt: new Date().toISOString(), content, events, eventPhotos: photos, enquiries, meta }, null, 2);
  return new Response(body, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="sattva-backup-${day}.json"`,
    },
  });
});
