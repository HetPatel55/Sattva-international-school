// POST /api/auth/logout
import { json } from '../../../server/http.js';
import { clearSessionCookie } from '../../../server/auth.js';

export const onRequestPost = ({ request }) => json({ ok: true }, { headers: { 'set-cookie': clearSessionCookie(request) } });
