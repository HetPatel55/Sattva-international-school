// POST /api/auth/login { email, password } — the single admin account.
// Five wrong tries from one connection lock logins for 15 minutes.
import { json, fail, readJson, handle, requireDb, clientIp, tooMany, recordHit, clearHits } from '../../../server/http.js';
import { authConfigured, verifyPassword, emailMatches, createSessionCookie } from '../../../server/auth.js';

const LIMIT = 5;
const WINDOW = 15 * 60 * 1000;

export const onRequestPost = handle(async ({ request, env }) => {
  if (!authConfigured(env)) return fail(503, 'Admin login is not set up on this server.');
  const db = requireDb(env);
  const ip = clientIp(request);

  if (await tooMany(db, 'login', ip, LIMIT, WINDOW)) {
    return fail(429, 'Too many wrong attempts. Please wait 15 minutes and try again.');
  }

  const body = await readJson(request);
  const email = typeof body?.email === 'string' ? body.email : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  // Always run the (slow) hash check so timing doesn't reveal a wrong email.
  const passwordOk = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
  if (!passwordOk || !emailMatches(env, email)) {
    await recordHit(db, 'login', ip);
    return fail(401, 'Wrong email or password.');
  }

  await clearHits(db, 'login', ip);
  return json({ ok: true }, { headers: { 'set-cookie': await createSessionCookie(env, request) } });
});
