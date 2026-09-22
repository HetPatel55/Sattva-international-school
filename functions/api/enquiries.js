// POST /api/enquiries — admission and contact forms save here.
// Protected by Turnstile, a honeypot field and a per-visitor rate limit.
import { json, fail, readJson, handle, requireDb, clean, clientIp, tooMany, recordHit, now } from '../../server/http.js';

const verifyTurnstile = async (env, token, ip) => {
  if (!env.TURNSTILE_SECRET) return true; // not configured (e.g. first local run)
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip !== 'local') body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const out = await res.json().catch(() => ({}));
  return out.success === true;
};

export const onRequestPost = handle(async ({ request, env }) => {
  const db = requireDb(env);
  const data = await readJson(request);
  if (!data) return fail(400, 'Invalid request.');

  // Bots fill every field; people never see this one. Pretend it worked.
  if (clean(data.website)) return json({ ok: true });

  const ip = clientIp(request);
  if (await tooMany(db, 'enquiry', ip, 8, 60 * 60 * 1000)) {
    return fail(429, 'Too many enquiries from this connection. Please call the school instead.');
  }
  if (!(await verifyTurnstile(env, clean(data.token, 2048), ip))) {
    return fail(403, 'Spam check failed. Please try again.');
  }

  const type = data.type === 'general' ? 'general' : 'admission';
  const enquiry = {
    name: clean(data.name, 80),
    phone: clean(data.phone, 10).replace(/\D/g, ''),
    email: clean(data.email, 120),
    child: clean(data.child, 80),
    standard: clean(data.standard, 40),
    medium: clean(data.medium, 20),
    subject: clean(data.subject, 60),
    message: clean(data.message, 2000),
  };

  if (!enquiry.name || !/^[6-9]\d{9}$/.test(enquiry.phone)) return fail(400, 'Please enter your name and a valid mobile number.');
  if (type === 'admission' && !enquiry.standard) return fail(400, 'Please choose a standard.');
  if (type === 'general' && (!enquiry.subject || !enquiry.message)) return fail(400, 'Please choose a topic and write a message.');
  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return fail(400, 'Please enter a valid email address.');

  const t = now();
  await db
    .prepare(
      `INSERT INTO enquiries (type, name, phone, email, child, standard, medium, subject, message, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', '', ?, ?)`,
    )
    .bind(type, enquiry.name, enquiry.phone, enquiry.email, enquiry.child, enquiry.standard, enquiry.medium, enquiry.subject, enquiry.message, t, t)
    .run();
  await recordHit(db, 'enquiry', ip);

  return json({ ok: true }, { status: 201 });
});
