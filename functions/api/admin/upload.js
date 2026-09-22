// POST /api/admin/upload (multipart: file, thumb?, w, h) — stores a photo in R2.
// The admin panel resizes and compresses photos in the browser first, so a
// typical upload is a few hundred KB.
import { json, fail, handle } from '../../../server/http.js';

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX = 6 * 1024 * 1024;

export const onRequestPost = handle(async ({ request, env }) => {
  if (!env.MEDIA) return fail(503, 'Photo storage is not connected.');
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') return fail(400, 'No photo received.');
  if (!TYPES[file.type]) return fail(415, 'Please upload a JPG, PNG or WebP image.');
  if (file.size > MAX) return fail(413, 'This photo is too large (max 6 MB).');

  const d = new Date();
  const base = `uploads/${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}`;
  const key = `${base}.${TYPES[file.type]}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type } });

  let thumbKey = null;
  const thumb = form.get('thumb');
  if (thumb && typeof thumb !== 'string' && TYPES[thumb.type] && thumb.size <= MAX) {
    thumbKey = `${base}-thumb.${TYPES[thumb.type]}`;
    await env.MEDIA.put(thumbKey, thumb.stream(), { httpMetadata: { contentType: thumb.type } });
  }

  const w = Number(form.get('w')) || undefined;
  const h = Number(form.get('h')) || undefined;
  return json(
    { key, thumbKey, src: `/img/${key}`, thumb: thumbKey ? `/img/${thumbKey}` : `/img/${key}`, w, h },
    { status: 201 },
  );
});
