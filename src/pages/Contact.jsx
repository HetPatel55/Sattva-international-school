import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useContent } from '../content/context';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import EnquiryForm from '../components/EnquiryForm';

const Contact = () => {
  const { school } = useContent();
  usePageMeta('Contact Us', `Call, email or visit ${school.name} in Singarwa, Ahmedabad.`);
  const { address } = school;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would love to hear from you"
        lead="Call us, write to us, or visit the campus during office hours."
      />

      <section className="section section--white">
        <div className="container">
          <ul className="contact-grid">
            <Reveal as="li" className="contact-card tone-green">
              <span className="icon-badge"><Phone size={22} aria-hidden="true" /></span>
              <h2>Call us</h2>
              {school.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`}>
                  <span>{p.label}</span> {p.display}
                </a>
              ))}
            </Reveal>
            <Reveal as="li" className="contact-card tone-blue" delay={70}>
              <span className="icon-badge"><Mail size={22} aria-hidden="true" /></span>
              <h2>Email us</h2>
              {school.emails.map((e) => (
                <a key={e.address} href={`mailto:${e.address}`}>
                  <span>{e.label}</span> {e.address}
                </a>
              ))}
            </Reveal>
            <Reveal as="li" className="contact-card tone-red" delay={140}>
              <span className="icon-badge"><MapPin size={22} aria-hidden="true" /></span>
              <h2>Visit us</h2>
              <address>
                {address.lines.map((l) => <span key={l}>{l},</span>)}
                <span>{address.city}, {address.state} – {address.pin}</span>
              </address>
              <a href={school.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                Get directions <ExternalLink size={14} aria-hidden="true" />
              </a>
            </Reveal>
            <Reveal as="li" className="contact-card tone-orange" delay={210}>
              <span className="icon-badge"><Clock size={22} aria-hidden="true" /></span>
              <h2>Office hours</h2>
              <dl className="hours">
                {school.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Send a message" title="Have a question?" lead="Send us a message and we will call you back." />
          <div className="contact-layout">
            <Reveal className="form-card">
              <EnquiryForm variant="general" />
            </Reveal>
            <Reveal className="map-card">
              <iframe
                title={`Map showing ${school.name}`}
                src={school.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
