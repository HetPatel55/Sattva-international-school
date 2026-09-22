// GET /img/<key> — serves uploaded photos from R2 with long-lived caching
// (every upload gets a new random key, so a file never changes in place).
export const onRequestGet = async ({ params, env, request }) => {
  const key = [].concat(params.path ?? []).join('/');
  if (!env.MEDIA || !key || key.includes('..')) return new Response('Not found', { status: 404 });

  const object = await env.MEDIA.get(key, { onlyIf: request.headers });
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  if (!('body' in object) || !object.body) return new Response(null, { status: 304, headers });
  return new Response(object.body, { headers });
};
