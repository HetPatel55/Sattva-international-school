import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Route, Routes, Link } from 'react-router-dom';
import { LayoutDashboard, Inbox, CalendarDays, FileText, LogOut, ExternalLink, UploadCloud, Loader2 } from 'lucide-react';
import { AdminContext } from './adminContext';
import { api, setExpiredHandler } from './api';
import Login from './Login';
import Dashboard from './Dashboard';
import Enquiries from './Enquiries';
import Events from './Events';
import EventEdit from './EventEdit';
import ContentList from './ContentList';
import ContentEdit from './ContentEdit';
import './admin.css';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, badge: 'new' },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/content', label: 'Website', icon: FileText },
];

// Keeps search engines out of the admin panel and restores the page on exit.
const useAdminDocument = () => {
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    const title = document.title;
    document.title = 'Admin | SATTVA International School';
    document.body.classList.add('adm-body');
    return () => {
      robots.remove();
      document.title = title;
      document.body.classList.remove('adm-body');
    };
  }, []);
};

const Toasts = ({ items }) => (
  <div className="adm-toasts" role="status" aria-live="polite">
    {items.map((t) => (
      <p key={t.id} className={`adm-toast adm-toast--${t.kind}`}>{t.message}</p>
    ))}
  </div>
);

const Shell = ({ email, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const toastId = useRef(0);

  const toast = useCallback((message, kind = 'ok') => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((list) => [...list, { id, message, kind }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4500);
  }, []);

  const refresh = useCallback(() => api('/api/admin/stats').then(setStats).catch(() => {}), []);
  useEffect(() => {
    refresh();
  }, [refresh]);

  const publish = async () => {
    setPublishing(true);
    try {
      await api('/api/admin/publish', { method: 'POST' });
      toast('Published! Visitors now see your changes.');
      refresh();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setPublishing(false);
    }
  };

  const pending = stats?.unpublishedChanges ?? 0;
  const value = useMemo(() => ({ stats, refresh, toast, logout: onLogout }), [stats, refresh, toast, onLogout]);

  return (
    <AdminContext.Provider value={value}>
      <div className="adm-shell">
        <header className="adm-top">
          <Link to="/admin" className="adm-brand">
            <img src="/brand/logo.png" alt="SATTVA International School" width="782" height="200" />
            <span>Admin</span>
          </Link>
          <div className="adm-top__actions">
            <button
              type="button"
              className={`adm-btn ${pending ? 'adm-btn--primary' : 'adm-btn--soft'}`}
              onClick={publish}
              disabled={!pending || publishing}
              title={pending ? 'Show your saved changes on the website' : 'Everything saved is already live'}
            >
              {publishing ? <Loader2 size={16} className="adm-spin" aria-hidden="true" /> : <UploadCloud size={16} aria-hidden="true" />}
              {pending ? `Publish (${pending})` : 'All live'}
            </button>
            <a href="/" target="_blank" rel="noopener" className="adm-icon-btn adm-hide-sm" aria-label="View website"><ExternalLink size={18} /></a>
            <button type="button" className="adm-icon-btn" onClick={onLogout} aria-label={`Log out (${email})`} title={`Log out (${email})`}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <nav className="adm-nav" aria-label="Admin">
          {NAV.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink key={to} to={to} end={end} className="adm-nav__link">
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
              {badge === 'new' && stats?.enquiries.new > 0 && <b className="adm-badge">{stats.enquiries.new}</b>}
            </NavLink>
          ))}
        </nav>

        <main className="adm-main">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventEdit />} />
            <Route path="content" element={<ContentList />} />
            <Route path="content/:key" element={<ContentEdit />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
        <Toasts items={toasts} />
      </div>
    </AdminContext.Provider>
  );
};

const AdminApp = () => {
  useAdminDocument();
  const [me, setMe] = useState({ loading: true });

  const check = useCallback(
    () =>
      fetch('/api/auth/me', { headers: { Accept: 'application/json' } })
        .then((res) => (res.headers.get('content-type')?.includes('json') ? res.json() : { configured: false }))
        .catch(() => ({ configured: false }))
        .then((data) => setMe({ loading: false, ...data })),
    [],
  );

  useEffect(() => {
    check();
    setExpiredHandler(() => setMe((m) => ({ ...m, admin: false })));
  }, [check]);

  const logout = useCallback(async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setMe((m) => ({ ...m, admin: false, email: null }));
  }, []);

  if (me.loading) {
    return <div className="adm-center"><Loader2 size={28} className="adm-spin" aria-label="Loading" /></div>;
  }
  if (!me.configured) {
    return (
      <div className="adm-center">
        <div className="adm-card adm-login">
          <img src="/brand/logo.png" alt="SATTVA International School" className="adm-login__logo" />
          <h1>Admin panel not available</h1>
          <p className="adm-muted">This copy of the website isn’t connected to its database yet, so the admin panel can’t be used here.</p>
          <a href="/" className="adm-btn adm-btn--soft">Back to the website</a>
        </div>
      </div>
    );
  }
  if (!me.admin) return <Login onDone={check} />;
  return <Shell email={me.email} onLogout={logout} />;
};

export default AdminApp;
