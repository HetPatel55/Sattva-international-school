// Turns stored content (plain data from ./defaults.js or the admin panel) into
// what the pages render: icons resolved, stage ids derived, event photos merged
// into the gallery. Pages read it through `useContent()`.

import { defaults } from './defaults';
import { iconFor } from './icons';

// Form submissions are also emailed via formsubmit.co to this address.
export const ENQUIRY_EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/thehetpatel143@gmail.com';

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Campus Life', to: '/campus-life' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
];

export const slugify = (text) =>
  String(text).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Each stored area overrides the defaults field by field, so newly added
// fields always have a value even if the saved copy predates them.
export const mergeContent = (stored = {}) =>
  Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, { ...value, ...(stored[key] ?? {}) }]),
  );

const withIcon = (item) => ({ ...item, icon: iconFor(item.icon) });

// ['A', 'B', 'C'] → 'A, B and C'
export const listPhrase = (items) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;

// Local calendar date as YYYY-MM-DD (event dates are stored the same way).
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const eventEnd = (e) => e.endDate || e.startDate || '';
export const isOnHome = (e, day = today()) => {
  const until = e.showUntil || eventEnd(e);
  return (!e.showFrom || day >= e.showFrom) && (!until || day <= until);
};
export const isPast = (e, day = today()) => Boolean(eventEnd(e)) && eventEnd(e) < day;

export const resolveContent = (stored, events = []) => {
  const c = mergeContent(stored);
  const stages = c.academics.stages.map((s) => ({ ...withIcon(s), id: slugify(s.name) }));

  // Photos from events appear in the gallery under "Events".
  const eventPhotos = events.flatMap((e) =>
    e.photos.map((p) => ({ ...p, alt: p.alt || e.title, category: 'Events', event: e.slug })),
  );

  // "Mon – Fri 8 AM – 6 PM · Sat 8 AM – 5 PM" from the editable opening hours
  const hoursSummary = c.school.hours
    .filter((h) => h.time && !/closed/i.test(h.time))
    .map((h) => `${h.days} ${h.time}`.replace(/(Mon|Tue|Wednes|Thurs|Fri|Satur|Sun)[a-z]*day/g, (_, d) => d.slice(0, 3)).replace(/:00 /g, ' '))
    .join(' · ');

  return {
    raw: c,
    school: { ...c.school, hoursSummary },
    home: c.home,
    about: c.about,
    announcement: c.announcement,
    admissions: c.admissions,
    settings: c.settings,
    voices: c.voices.items,
    quotes: c.quotes,
    stages,
    streams: c.academics.streams.map(withIcon),
    computerTopics: c.academics.computerTopics,
    whyChoose: c.home.whyChoose,
    facilities: c.campus.facilities.map(withIcon),
    activities: c.campus.activities.map(withIcon),
    annualFunction: c.campus.annualFunction,
    festivals: c.campus.festivals,
    houses: {
      ...c.campus.houses,
      // "including Glory and Prestige" until every house has a name
      phrase:
        c.campus.houses.named.length >= Number(c.campus.houses.total)
          ? listPhrase(c.campus.houses.named)
          : `including ${listPhrase(c.campus.houses.named)}`,
    },
    values: c.about.values.map(withIcon),
    milestones: c.about.milestones,
    admissionSteps: c.admissions.steps,
    documents: c.admissions.documents,
    faqs: c.admissions.faqs,
    // Real photos first; stock "Sample photo" placeholders always go last.
    gallery: [
      ...c.gallery.photos.filter((p) => !p.placeholder),
      ...eventPhotos,
      ...c.gallery.photos.filter((p) => p.placeholder),
    ],
    events,
  };
};
