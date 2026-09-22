// Sets the admin login for local development in .dev.vars (gitignored).
// Only a hash of the password is saved — never the password itself.
//
//   node scripts/set-admin.mjs <email>            (asks for the password)
//   node scripts/set-admin.mjs <email> <password>
//
// At go-live the same three values are added as Cloudflare secrets instead.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { hashPassword } from '../server/auth.js';

const FILE = new URL('../.dev.vars', import.meta.url);
const [email, passwordArg] = process.argv.slice(2);

if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/set-admin.mjs <email> [password]');
  process.exit(1);
}

let password = passwordArg;
if (!password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  password = await rl.question('New admin password: ');
  rl.close();
}
if (!password || password.length < 8) {
  console.error('Please use a password of at least 8 characters.');
  process.exit(1);
}

const vars = new Map();
if (existsSync(FILE)) {
  for (const line of readFileSync(FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) vars.set(m[1], m[2]);
  }
}

vars.set('ADMIN_EMAIL', email.trim().toLowerCase());
vars.set('ADMIN_PASSWORD_HASH', await hashPassword(password));
if (!vars.get('SESSION_SECRET')) vars.set('SESSION_SECRET', randomBytes(32).toString('hex'));
// Cloudflare's public test secret (always passes) until real keys exist.
if (!vars.get('TURNSTILE_SECRET')) vars.set('TURNSTILE_SECRET', '1x0000000000000000000000000000000AA');

writeFileSync(FILE, `${[...vars].map(([k, v]) => `${k}=${v}`).join('\n')}\n`);
console.log(`Admin login saved for ${vars.get('ADMIN_EMAIL')} in .dev.vars (password stored as a hash only).`);
