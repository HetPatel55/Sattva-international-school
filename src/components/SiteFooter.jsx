import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { nav, school, stages } from '../data/site';

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src="/brand/logo-light.png" alt={school.name} width="782" height="200" loading="lazy" />
          <p>
            A GSEB-affiliated school in Singarwa, Ahmedabad, teaching JrKG to Std 12 in English and
            Gujarati medium, with Science and Commerce streams.
          </p>
          {school.social.length > 0 && (
            <ul className="site-footer__social">
              {school.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="site-footer__heading">Explore</h2>
          <ul className="site-footer__links">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">Standards</h2>
          <ul className="site-footer__links">
            {stages.map((s) => (
              <li key={s.id}>
                <Link to={`/academics#${s.id}`}>
                  {s.name} <span>· {s.standards.join(', ')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">Contact</h2>
          <ul className="site-footer__contact">
            <li>
              <MapPin size={18} aria-hidden="true" />
              <a href={school.mapUrl} target="_blank" rel="noopener noreferrer">
                {school.address.lines.join(', ')}, {school.address.city} – {school.address.pin}
              </a>
            </li>
            {school.phones.map((p) => (
              <li key={p.tel}>
                <Phone size={18} aria-hidden="true" />
                <a href={`tel:${p.tel}`}>{p.display}</a>
              </li>
            ))}
            <li>
              <Mail size={18} aria-hidden="true" />
              <a href={`mailto:${school.emails[0].address}`}>{school.emails[0].address}</a>
            </li>
            <li>
              <Clock size={18} aria-hidden="true" />
              <span>Mon – Fri 8 AM – 6 PM · Sat 8 AM – 5 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p>© {year} {school.name}. All rights reserved.</p>
          <a href={school.mapUrl} target="_blank" rel="noopener noreferrer">
            Get directions <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
