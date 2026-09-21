import { Phone, Mail, Clock, FileCheck2 } from 'lucide-react';
import { school, stages, admissionSteps, documents, faqs, quotes } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import EnquiryForm from '../components/EnquiryForm';
import Faq from '../components/Faq';
import QuoteBand from '../components/QuoteBand';

const Admissions = () => {
  usePageMeta('Admissions', `Admissions at ${school.name} — JrKG, SrKG, Balvatika and Std 1–12. Send an enquiry or call +91 97144 81717.`);
  const phone = school.phones[0];
  const admissionsEmail = school.emails.find((e) => e.label === 'Admissions') ?? school.emails[0];

  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Join the SATTVA family"
        lead="We welcome enquiries for every standard from JrKG to Std 12, in English and Gujarati medium."
      >
        <div className="hero-buttons">
          <a href="#enquiry" className="btn btn--primary">Send an enquiry</a>
          <a href={`tel:${phone.tel}`} className="btn btn--outline">
            <Phone size={18} aria-hidden="true" /> {phone.display}
          </a>
        </div>
      </PageHero>

      {/* ---------- Standards offered ---------- */}
      <section className="section section--white">
        <div className="container">
          <SectionHead eyebrow="Who can apply" title="Standards we offer" />
          <ul className="offer-grid">
            {stages.map((s, i) => (
              <Reveal as="li" key={s.id} className={`offer-card tone-${s.tone}`} delay={i * 70}>
                <h3>{s.name}</h3>
                <p>{s.standards.join(' · ')}</p>
                {s.id === 'higher-secondary' && <p className="offer-card__note">Science & Commerce</p>}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="How it works"
            title="Four simple steps"
            lead="Our admissions team will guide you through each step."
          />
          <ol className="steps">
            {admissionSteps.map((step, i) => (
              <Reveal as="li" key={step.title} className="steps__item" delay={i * 80}>
                <span className="steps__num">{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Enquiry form + documents ---------- */}
      <section className="section section--sand" id="enquiry">
        <div className="container">
          <SectionHead
            eyebrow="Admission enquiry"
            title="Tell us about your child"
            lead="Fill in this short form and we will call you back."
          />
          <div className="enquiry">
            <Reveal className="form-card">
              <EnquiryForm variant="admission" />
            </Reveal>

            <aside className="enquiry__side">
              <Reveal className="side-card">
                <span className="icon-badge tone-green"><FileCheck2 size={22} aria-hidden="true" /></span>
                <h3>Documents usually needed</h3>
                <ul className="doc-list">
                  {documents.map((d) => <li key={d}>{d}</li>)}
                </ul>
                <p className="side-card__note">The admissions office will confirm the exact list for your child’s standard.</p>
              </Reveal>

              <Reveal className="side-card" delay={100}>
                <h3>Talk to us</h3>
                <ul className="contact-lines">
                  <li>
                    <Phone size={18} aria-hidden="true" />
                    <a href={`tel:${phone.tel}`}>{phone.display}</a>
                  </li>
                  <li>
                    <Mail size={18} aria-hidden="true" />
                    <a href={`mailto:${admissionsEmail.address}`}>{admissionsEmail.address}</a>
                  </li>
                  <li>
                    <Clock size={18} aria-hidden="true" />
                    <span>Mon – Fri 8 AM – 6 PM, Sat 8 AM – 5 PM</span>
                  </li>
                </ul>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="container faq-layout">
          <SectionHead eyebrow="FAQ" title="Questions parents often ask" />
          <Reveal>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      <QuoteBand {...quotes.admissions} />
    </>
  );
};

export default Admissions;
