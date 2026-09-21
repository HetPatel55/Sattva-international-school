import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Sparkles, PartyPopper, Flag } from 'lucide-react';
import { school, stages, whyChoose, facilities, activities, festivals, houses, quotes } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import TileMotif from '../components/TileMotif';
import QuoteBand from '../components/QuoteBand';
import CtaBand from '../components/CtaBand';

const facts = [
  { value: 'GSEB', label: 'Affiliated board' },
  { value: 'JrKG – 12', label: 'All standards, one campus' },
  { value: '2 mediums', label: 'English & Gujarati' },
  { value: '2 streams', label: 'Science & Commerce' },
  { value: '15:1', label: 'Student–teacher ratio' },
];

const Home = () => {
  usePageMeta(
    null,
    'SATTVA International School, Singarwa, Ahmedabad — GSEB school from JrKG to Std 12 in English and Gujarati medium, with Science and Commerce streams.',
  );
  const phone = school.phones[0];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__text">
            <p className="eyebrow">{school.board} school · Singarwa, Ahmedabad</p>
            <h1 className="hero__title">
              Rooted in values.
              <br />
              <em>Ready for tomorrow.</em>
            </h1>
            <p className="lead hero__lead">
              GSEB education from JrKG to Std 12 in English and Gujarati medium, with Science and Commerce
              streams — on a modern campus in Singarwa.
            </p>
            <div className="hero__actions">
              <Link to="/admissions#enquiry" className="btn btn--primary">
                Admission enquiry <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a href={`tel:${phone.tel}`} className="btn btn--outline">
                <Phone size={18} aria-hidden="true" /> {phone.display}
              </a>
            </div>
          </div>

          <figure className="hero__media">
            <div className="hero__frame">
              <img
                src="/photos/campus-front.jpg"
                srcSet="/photos/campus-front-800.jpg 800w, /photos/campus-front.jpg 1280w"
                sizes="(min-width: 1024px) 600px, 100vw"
                width="1280"
                height="720"
                alt="The SATTVA International School building in Singarwa, Ahmedabad"
                fetchPriority="high"
              />
            </div>
            <TileMotif className="hero__motif" />
            <figcaption className="hero__caption">Our campus in Singarwa, Ahmedabad</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------- Key facts ---------- */}
      <section className="facts" aria-label="Key facts">
        <div className="container">
          <ul className="facts__list">
            {facts.map((f, i) => (
              <Reveal as="li" key={f.label} className="facts__item" delay={i * 60}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Stages ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Academics"
            title="One school, from JrKG to Std 12"
            lead="Your child can grow with us through every stage of the GSEB system — no change of school, no fresh start."
          />
          <ol className="journey">
            {stages.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal as="li" key={s.id} className={`journey__step tone-${s.tone}`} delay={i * 80}>
                  <span className="journey__badge">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div className="journey__body">
                    <p className="journey__count">Stage {i + 1}</p>
                    <h3>{s.name}</h3>
                    <div className="chip-row">
                      {s.standards.map((std) => (
                        <span key={std} className="chip">{std}</span>
                      ))}
                    </div>
                    <p>{s.summary}</p>
                    <Link to={`/academics#${s.id}`} className="text-link">
                      Learn more <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------- Why SATTVA ---------- */}
      <section className="section section--white">
        <div className="container why">
          <div className="why__intro">
            <SectionHead
              eyebrow="Why SATTVA"
              title="What parents value most about us"
              lead="Good teaching, a safe and comfortable campus, and time for every child."
            />
            <Reveal>
              <Link to="/about" className="btn btn--ink">
                About our school <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <ul className="why__list">
            {whyChoose.map((item, i) => (
              <Reveal as="li" key={item.title} className="why__item" delay={(i % 2) * 80}>
                <span className="why__check">
                  <Check size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Campus ---------- */}
      <section className="section">
        <div className="container campus">
          <Reveal className="campus__media">
            <img
              src="/photos/campus-garden.jpg"
              srcSet="/photos/campus-garden-800.jpg 800w, /photos/campus-garden.jpg 1280w"
              sizes="(min-width: 1024px) 560px, 100vw"
              width="1280"
              height="720"
              alt="The SATTVA campus with its green wall, classrooms and playground"
              loading="lazy"
            />
          </Reveal>
          <div className="campus__text">
            <SectionHead
              eyebrow="Our campus"
              title="Built for learning, comfort and safety"
            />
            <ul className="feature-list">
              {facilities.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal as="li" key={f.title} className="feature-list__item" delay={i * 60}>
                    <span className="icon-badge icon-badge--soft">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>{f.title}</h3>
                      <p>{f.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Life at SATTVA ---------- */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead
            eyebrow="Campus life"
            title="Learning that goes beyond the classroom"
            lead="Every child takes part in activities that build confidence, fitness and creativity."
            align="center"
          />
          <Reveal as="ul" className="activity-pills">
            {activities.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.title} className={`activity-pill tone-${a.tone}`}>
                  <span className="icon-badge">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  {a.title}
                </li>
              );
            })}
          </Reveal>

          <div className="life-cards">
            <Reveal className="life-card tone-orange">
              <span className="icon-badge"><Sparkles size={22} aria-hidden="true" /></span>
              <h3>Annual Function</h3>
              <p>Every year our students take the stage — dance, karate, anchoring and commentary — in front of their families.</p>
            </Reveal>
            <Reveal className="life-card tone-crimson" delay={80}>
              <span className="icon-badge"><PartyPopper size={22} aria-hidden="true" /></span>
              <h3>Festivals</h3>
              <p>We celebrate every Indian and Gujarati festival together at school.</p>
              <div className="chip-row">
                {festivals.map((f) => <span key={f} className="chip chip--white">{f}</span>)}
              </div>
            </Reveal>
            <Reveal className="life-card tone-purple" delay={160}>
              <span className="icon-badge"><Flag size={22} aria-hidden="true" /></span>
              <h3>House System</h3>
              <p>
                Every student, in every standard, belongs to one of {houses.total} houses — including{' '}
                {houses.named.join(' and ')} — building teamwork and healthy competition.
              </p>
            </Reveal>
          </div>

          <Reveal className="center-link">
            <Link to="/campus-life" className="text-link">
              Explore campus life <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <QuoteBand {...quotes.home} />
      <CtaBand />
    </>
  );
};

export default Home;
