// Event dates are stored as 'YYYY-MM-DD' strings (no time zone surprises).
const parse = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const fmt = (s, opts) => new Intl.DateTimeFormat('en-IN', opts).format(parse(s));

export const formatDate = (s) => (s ? fmt(s, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

// "28 Oct 2026", "28–30 Oct 2026", "30 Oct – 2 Nov 2026", "30 Dec 2026 – 2 Jan 2027"
export const formatRange = (start, end) => {
  if (!start) return '';
  if (!end || end === start) return formatDate(start);
  const [a, b] = [parse(start), parse(end)];
  if (a.getFullYear() !== b.getFullYear()) return `${formatDate(start)} – ${formatDate(end)}`;
  if (a.getMonth() !== b.getMonth()) {
    return `${fmt(start, { day: 'numeric', month: 'short' })} – ${formatDate(end)}`;
  }
  return `${a.getDate()}–${formatDate(end)}`;
};
