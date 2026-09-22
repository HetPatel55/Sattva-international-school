// Builds the WHERE clause for the enquiry inbox filters.
export const enquiryFilter = (url) => {
  const p = url.searchParams;
  const where = [];
  const args = [];
  if (p.get('status')) { where.push('status = ?'); args.push(p.get('status')); }
  if (p.get('type')) { where.push('type = ?'); args.push(p.get('type')); }
  if (p.get('standard')) { where.push('standard = ?'); args.push(p.get('standard')); }
  if (p.get('q')) {
    const q = `%${p.get('q').trim().slice(0, 60)}%`;
    where.push('(name LIKE ? OR phone LIKE ? OR email LIKE ? OR child LIKE ? OR message LIKE ?)');
    args.push(q, q, q, q, q);
  }
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', args };
};

export const enquiryShape = (r) => ({
  id: r.id,
  type: r.type,
  name: r.name,
  phone: r.phone,
  email: r.email,
  child: r.child,
  standard: r.standard,
  medium: r.medium,
  subject: r.subject,
  message: r.message,
  status: r.status,
  notes: r.notes,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});
