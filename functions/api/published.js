// GET /api/published — published content + events for visitors' pages.
import { json, handle, requireDb } from '../../server/http.js';
import { publishedPayload } from '../../server/data.js';

export const onRequestGet = handle(async ({ env }) => json(await publishedPayload(requireDb(env))));
