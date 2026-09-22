// Runs the website with its backend on this computer:
//   - the API (functions/) with a simulated database and photo storage, on :8788
//   - the Vite dev site on :5173, which forwards /api and /img to the API
// Nothing is sent to Cloudflare. Stop with Ctrl+C.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const isWin = process.platform === 'win32';
const npx = isWin ? 'npx.cmd' : 'npx';

if (!existsSync(new URL('.dev.vars', root))) {
  console.warn('\n  No admin login yet. Run:  node scripts/set-admin.mjs <email>\n');
}

// wrangler serves a static folder too; the real pages come from Vite.
if (!existsSync(new URL('dist', root))) {
  mkdirSync(new URL('dist', root));
  writeFileSync(new URL('dist/index.html', root), '<!doctype html><title>API</title>');
}

// Create the tables in the local database (safe to repeat).
const init = spawnSync(npx, ['wrangler', 'd1', 'execute', 'sattva', '--local', '--file=schema.sql'], {
  cwd: root, stdio: 'inherit', shell: isWin,
});
if (init.status !== 0) process.exit(init.status ?? 1);

const run = (name, args, env = {}) => {
  const child = spawn(npx, args, { cwd: root, stdio: 'inherit', shell: isWin, env: { ...process.env, ...env } });
  child.on('exit', (code) => {
    console.log(`\n[${name}] stopped${code ? ` (code ${code})` : ''}`);
    process.exit(code ?? 0);
  });
  return child;
};

const api = run('api', ['wrangler', 'pages', 'dev', 'dist', '--port', '8788', '--ip', '127.0.0.1', '--show-interactive-dev-session=false']);
const site = run('site', ['vite'], { SATTVA_API: 'http://127.0.0.1:8788' });

const stop = () => {
  api.kill();
  site.kill();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
