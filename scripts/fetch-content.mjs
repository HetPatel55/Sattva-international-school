// Runs before `vite build`. When CONTENT_API_URL is set (at go-live, the live
// site's address), the latest published content is saved into
// src/data/published.json and built into the pages, so visitors and search
// engines get it without waiting for the API. Without it, or if the request
// fails, the build simply uses what is already there (or the defaults).
import { writeFileSync } from 'node:fs';

const base = process.env.CONTENT_API_URL?.replace(/\/+$/, '');
if (!base) {
  console.log('[content] CONTENT_API_URL not set — building with the built-in content.');
  process.exit(0);
}

try {
  const res = await fetch(`${base}/api/published`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  writeFileSync(new URL('../src/data/published.json', import.meta.url), JSON.stringify(data));
  console.log(`[content] Built with published content version ${data.version}.`);
} catch (err) {
  console.warn(`[content] Could not fetch published content (${err.message}) — building with the built-in content.`);
}
