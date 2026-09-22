import { clean, slugify } from './http.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const date = (v) => (typeof v === 'string' && DATE.test(v) ? v : null);

const image = (img) =>
  img && typeof img === 'object' && typeof img.src === 'string' && img.src.startsWith('/img/')
    ? JSON.stringify({
        key: clean(img.key, 200),
        thumbKey: clean(img.thumbKey ?? '', 200) || undefined,
        src: clean(img.src, 300),
        thumb: clean(img.thumb ?? img.src, 300),
        w: Number(img.w) || undefined,
        h: Number(img.h) || undefined,
        alt: clean(img.alt ?? '', 200) || undefined,
      })
    : null;

// Validates the admin's event form into database columns.
export const eventColumns = (body) => {
  const title = clean(body?.title, 120);
  if (!title) return { error: 'Please give the event a title.' };
  const start = date(body.startDate);
  const end = date(body.endDate);
  if (start && end && end < start) return { error: 'The end date is before the start date.' };
  const from = date(body.showFrom);
  const until = date(body.showUntil);
  if (from && until && until < from) return { error: '“Show on home page until” is before “from”.' };
  return {
    title,
    description: clean(body.description, 1000),
    start_date: start,
    end_date: end,
    show_from: from,
    show_until: until,
    cover: image(body.cover),
    published: body.published ? 1 : 0,
  };
};

export const photoImage = image;

// A readable, unique address such as /events/diwali-celebration-2026.
export const uniqueSlug = async (db, title, startDate, ignoreId = 0) => {
  const base = slugify(`${title}${startDate ? ` ${startDate.slice(0, 4)}` : ''}`);
  let slug = base;
  for (let n = 2; ; n += 1) {
    const taken = await db.prepare('SELECT id FROM events WHERE slug = ? AND id != ?').bind(slug, ignoreId).first();
    if (!taken) return slug;
    slug = `${base}-${n}`;
  }
};
