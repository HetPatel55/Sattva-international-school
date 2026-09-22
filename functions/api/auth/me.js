// GET /api/auth/me — is the admin logged in? Also tells the admin panel
// whether this server has login set up at all.
import { json } from '../../../server/http.js';
import { authConfigured, isAdmin } from '../../../server/auth.js';

export const onRequestGet = async ({ request, env }) => {
  const admin = await isAdmin(request, env);
  return json({
    configured: authConfigured(env) && Boolean(env.DB),
    admin,
    email: admin ? env.ADMIN_EMAIL : null,
  });
};
