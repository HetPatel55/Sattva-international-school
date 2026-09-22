// Single admin account. The email and a PBKDF2 hash of the password come from
// secrets (ADMIN_EMAIL, ADMIN_PASSWORD_HASH, SESSION_SECRET); the password
// itself is never stored anywhere. Sessions are signed, HttpOnly cookies.

const enc = new TextEncoder();
const COOKIE = 'sattva_admin';
const SESSION_DAYS = 7;
export const ITERATIONS = 100000; // Cloudflare Workers' PBKDF2 maximum

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex) => new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));

// Constant-time comparison so response timing reveals nothing.
const same = (a, b) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const derive = async (password, salt, iterations) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  return toHex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
};

// Format: pbkdf2:<iterations>:<salt hex>:<hash hex>
export const hashPassword = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2:${ITERATIONS}:${toHex(salt)}:${await derive(password, salt, ITERATIONS)}`;
};

export const verifyPassword = async (password, stored = '') => {
  const [scheme, iterations, salt, hash] = stored.split(':');
  if (scheme !== 'pbkdf2' || !salt || !hash) return false;
  return same(await derive(password, fromHex(salt), Number(iterations)), hash);
};

const hmac = async (secret, message) => {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
};

// The password hash is part of the signed message, so changing the password
// logs out every existing session.
const sessionMessage = (env, exp) => `${env.ADMIN_EMAIL}|${exp}|${(env.ADMIN_PASSWORD_HASH || '').slice(-16)}`;

export const createSessionCookie = async (env, request) => {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const token = `${exp}.${await hmac(env.SESSION_SECRET, sessionMessage(env, exp))}`;
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}${secure}`;
};

export const clearSessionCookie = (request) => {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
};

export const authConfigured = (env) => Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD_HASH && env.SESSION_SECRET);

export const isAdmin = async (request, env) => {
  if (!authConfigured(env)) return false;
  const cookie = request.headers.get('cookie') ?? '';
  const token = cookie.split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return same(sig, await hmac(env.SESSION_SECRET, sessionMessage(env, exp)));
};

export const emailMatches = (env, email) =>
  same(String(email).trim().toLowerCase(), String(env.ADMIN_EMAIL).trim().toLowerCase());
