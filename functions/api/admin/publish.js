// POST /api/admin/publish — make every saved draft live. Visitors' pages pick
// it up on their next visit; if a deploy hook is configured the static site is
// rebuilt too (search engines then see the new content in the page itself).
import { json, handle, requireDb, now } from '../../../server/http.js';
import { setMeta } from '../../../server/data.js';

export const onRequestPost = handle(async ({ env }) => {
  const db = requireDb(env);
  const t = now();
  await db.batch([
    db.prepare('UPDATE content SET published = draft, published_at = ? WHERE published IS NULL OR published != draft').bind(t),
  ]);
  await setMeta(db, 'content_version', t);
  await setMeta(db, 'last_publish', t);

  let rebuild = 'not-configured';
  if (env.DEPLOY_HOOK_URL) {
    const res = await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' }).catch(() => null);
    rebuild = res?.ok ? 'started' : 'failed';
  }
  return json({ ok: true, publishedAt: t, rebuild });
});
