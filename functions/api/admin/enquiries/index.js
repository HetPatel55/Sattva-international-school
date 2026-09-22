// GET /api/admin/enquiries?status=&type=&standard=&q=&page= — the inbox
import { json, handle, requireDb } from '../../../../server/http.js';
import { enquiryFilter, enquiryShape } from '../../../../server/enquiries.js';

const PAGE = 30;

export const onRequestGet = handle(async ({ request, env }) => {
  const db = requireDb(env);
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const { sql, args } = enquiryFilter(url);

  const [{ results }, total, counts] = await Promise.all([
    db.prepare(`SELECT * FROM enquiries ${sql} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...args, PAGE, (page - 1) * PAGE).all(),
    db.prepare(`SELECT COUNT(*) AS n FROM enquiries ${sql}`).bind(...args).first(),
    db.prepare('SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status').all(),
  ]);

  return json({
    enquiries: results.map(enquiryShape),
    total: total?.n ?? 0,
    page,
    pages: Math.max(1, Math.ceil((total?.n ?? 0) / PAGE)),
    counts: Object.fromEntries(counts.results.map((r) => [r.status, r.n])),
  });
});
