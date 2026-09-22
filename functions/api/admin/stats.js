// GET /api/admin/stats — numbers for the dashboard
import { json, handle, requireDb } from '../../../server/http.js';
import { getMeta, listEvents } from '../../../server/data.js';
import { enquiryShape } from '../../../server/enquiries.js';

// Midnight in India, as a timestamp, so "today" matches the school's day.
const istMidnight = (daysAgo = 0) => {
  const ist = new Date(Date.now() + 5.5 * 3600e3);
  ist.setUTCHours(0, 0, 0, 0);
  return ist.getTime() - 5.5 * 3600e3 - daysAgo * 864e5;
};

export const onRequestGet = handle(async ({ env }) => {
  const db = requireDb(env);
  const count = async (where = '', ...args) =>
    (await db.prepare(`SELECT COUNT(*) AS n FROM enquiries ${where}`).bind(...args).first())?.n ?? 0;

  const [total, fresh, today, week, byStandard, recent, changed, events] = await Promise.all([
    count(),
    count("WHERE status = 'new'"),
    count('WHERE created_at >= ?', istMidnight()),
    count('WHERE created_at >= ?', istMidnight(6)),
    db.prepare("SELECT standard, COUNT(*) AS n FROM enquiries WHERE type = 'admission' AND standard != '' GROUP BY standard ORDER BY n DESC LIMIT 6").all(),
    db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5').all(),
    db.prepare('SELECT COUNT(*) AS n FROM content WHERE published IS NULL OR published != draft').first(),
    listEvents(db),
  ]);

  return json({
    enquiries: { total, new: fresh, today, week, byStandard: byStandard.results, recent: recent.results.map(enquiryShape) },
    unpublishedChanges: changed?.n ?? 0,
    lastPublish: Number(await getMeta(db, 'last_publish')) || null,
    events: events.map(({ id, title, startDate, endDate, showFrom, showUntil, published, cover, photos }) => ({
      id, title, startDate, endDate, showFrom, showUntil, published, hasCover: Boolean(cover), photoCount: photos.length,
    })),
  });
});
