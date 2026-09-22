// GET /api/admin/enquiries/export?… — the (filtered) inbox as a CSV file
// that opens directly in Excel (UTF-8 with BOM so ₹, – and Gujarati show).
import { handle, requireDb } from '../../../../server/http.js';
import { enquiryFilter } from '../../../../server/enquiries.js';

const STATUS = { new: 'New', called: 'Called', visit: 'Visit booked', admitted: 'Admitted', closed: 'Not interested' };
const cell = (v) => {
  const s = String(v ?? '');
  // Leading = + - @ would be run as a formula by Excel; prefix a quote.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export const onRequestGet = handle(async ({ request, env }) => {
  const db = requireDb(env);
  const { sql, args } = enquiryFilter(new URL(request.url));
  const { results } = await db.prepare(`SELECT * FROM enquiries ${sql} ORDER BY created_at DESC`).bind(...args).all();

  const header = ['Date', 'Type', 'Parent / name', 'Mobile', 'Email', "Child's name", 'Standard', 'Medium', 'Topic', 'Message', 'Status', 'Notes'];
  const rows = results.map((r) => [
    new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    r.type === 'admission' ? 'Admission' : 'General',
    r.name, r.phone, r.email, r.child, r.standard, r.medium, r.subject, r.message,
    STATUS[r.status] ?? r.status, r.notes,
  ]);
  const csv = String.fromCharCode(0xfeff) + [header, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
  const day = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="sattva-enquiries-${day}.csv"`,
    },
  });
});
