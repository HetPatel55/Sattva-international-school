// Guards every /api/admin/* route: a valid admin session is required, and
// changes must carry the X-Admin header (a custom header can't be sent from
// another website without permission, which blocks cross-site requests).
import { fail } from '../../../server/http.js';
import { isAdmin } from '../../../server/auth.js';

export const onRequest = async ({ request, env, next }) => {
  if (!(await isAdmin(request, env))) return fail(401, 'Please log in again.');
  if (request.method !== 'GET' && request.headers.get('x-admin') !== '1') return fail(403, 'Request blocked.');
  const res = await next();
  // Admin data is never cached or indexed.
  const out = new Response(res.body, res);
  out.headers.set('cache-control', 'no-store');
  out.headers.set('x-robots-tag', 'noindex');
  return out;
};
