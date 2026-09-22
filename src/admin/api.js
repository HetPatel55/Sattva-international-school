// Fetch wrapper for the admin API. Adds the X-Admin header the server
// requires for changes, parses JSON errors, and reports expired logins.

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let onExpired = () => {};
export const setExpiredHandler = (fn) => {
  onExpired = fn;
};

export const api = async (path, { method = 'GET', body, form } = {}) => {
  const headers = { Accept: 'application/json' };
  if (method !== 'GET') headers['X-Admin'] = '1';
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(path, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined), credentials: 'same-origin' });
  } catch {
    throw new ApiError('Could not reach the server. Check your internet connection.', 0);
  }

  const isJson = res.headers.get('content-type')?.includes('json');
  const data = isJson ? await res.json().catch(() => ({})) : {};
  if (res.status === 401 && path.startsWith('/api/admin/')) onExpired();
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status}).`, res.status);
  if (!isJson) throw new ApiError('The server is not available.', res.status);
  return data;
};

// Triggers a browser download for a GET endpoint (CSV export, backup).
export const download = (path) => {
  const a = document.createElement('a');
  a.href = path;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
};
