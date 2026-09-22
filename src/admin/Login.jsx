import { useState } from 'react';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { api } from './api';

const Login = ({ onDone }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth/login', { method: 'POST', body: { email, password } });
      await onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="adm-center">
      <form className="adm-card adm-login" onSubmit={submit}>
        <img src="/brand/logo.png" alt="SATTVA International School" className="adm-login__logo" width="782" height="200" />
        <h1>Admin login</h1>
        <p className="adm-muted">Manage enquiries, events and website content.</p>

        <div className="adm-field">
          <label className="adm-label" htmlFor="adm-email">Email</label>
          <input id="adm-email" className="adm-input" type="email" autoComplete="username" required
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="adm-password">Password</label>
          <div className="adm-password">
            <input id="adm-password" className="adm-input" type={show ? 'text' : 'password'} autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="adm-icon-btn" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="adm-error" role="alert">{error}</p>}

        <button type="submit" className="adm-btn adm-btn--primary adm-btn--block" disabled={busy}>
          {busy ? <Loader2 size={18} className="adm-spin" aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
};

export default Login;
