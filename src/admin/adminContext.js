import { createContext, useContext } from 'react';

// Shared admin state: { stats, refresh(), toast(message, kind), logout() }
export const AdminContext = createContext(null);
export const useAdmin = () => useContext(AdminContext);

// Human-friendly helpers used across admin pages.
export const STATUS_LABELS = {
  new: 'New',
  called: 'Called',
  visit: 'Visit booked',
  admitted: 'Admitted',
  closed: 'Not interested',
};

export const timeAgo = (ts) => {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} day${d > 1 ? 's' : ''} ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const eventState = (e, day) => {
  const end = e.endDate || e.startDate || '';
  const until = e.showUntil || end;
  if (!e.published) return { key: 'hidden', label: 'Hidden' };
  if (e.showFrom && day < e.showFrom) return { key: 'scheduled', label: `On home page from ${e.showFrom}` };
  if (!until || day <= until) return { key: 'live', label: 'On home page now' };
  return { key: 'past', label: 'Past — in Gallery' };
};
