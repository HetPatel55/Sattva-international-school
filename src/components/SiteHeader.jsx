import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { nav, school } from '../data/site';

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  const phone = school.phones[0];

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-bar">
        <Link to="/" className="brand" aria-label={`${school.name} — home`} onClick={close}>
          <img src="/brand/logo.png" alt={school.name} width="782" height="200" />
        </Link>

        <nav className="main-nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="main-nav__link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/admissions#enquiry" className="btn btn--primary btn--sm header-cta" onClick={close}>
          Apply now
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} inert={!open}>
        <nav aria-label="Mobile">
          <ul className="mobile-menu__list">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="mobile-menu__link" onClick={close}>
                  {item.label}
                  <ArrowRight size={18} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__actions">
          <Link to="/admissions#enquiry" className="btn btn--primary btn--block" onClick={close}>
            Admission enquiry
          </Link>
          <a href={`tel:${phone.tel}`} className="btn btn--outline btn--block">
            <Phone size={18} aria-hidden="true" /> Call {phone.display}
          </a>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
