import { Link } from 'react-router-dom';
import { Check, Landmark, Languages, Split, FlaskConical, BarChart3, Laptop, ArrowRight } from 'lucide-react';
import { school, stages, activities, quotes } from '../data/site';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import QuoteBand from '../components/QuoteBand';
import CtaBand from '../components/CtaBand';

const overview = [
  { icon: Landmark, tone: 'red', title: 'GSEB curriculum', text: `Affiliated with the ${school.boardFull}, with board examinations in Std 10 and Std 12.` },
  { icon: Languages, tone: 'green', title: 'English & Gujarati medium', text: 'Every standard is offered in both mediums, so families can choose what suits their child.' },
  { icon: Split, tone: 'blue', title: 'Science & Commerce', text: 'Two streams in Std 11 and 12, each with focused subjects and dedicated teachers.' },
];

const streams = [
  {
    name: 'Science',
    icon: FlaskConical,
    tone: 'purple',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    text: 'Theory and regular practicals in our dedicated physics, chemistry and biology labs.',
  },
  {
    name: 'Commerce',
    icon: BarChart3,
    tone: 'orange',
    subjects: ['Accountancy', 'Economics', 'Statistics', 'Organisation of Commerce & Management'],
    text: 'A strong grounding in business, finance and economics.',
  },
];

const computerTopics = ['Computer fundamentals', 'History of computers', 'MS Word', 'MS Excel', 'Paint', 'HTML & CSS basics'];

const Academics = () => {
  usePageMeta('Academics', `GSEB academics at ${school.name} — JrKG, SrKG, Balvatika, Std 1–12, Science and Commerce, English and Gujarati medium.`);

  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="JrKG to Std 12, the GSEB way"
        lead="A complete school journey under one roof — in English or Gujarati medium, with Science and Commerce in Std 11 and 12."
      >
        <nav className="jump-links" aria-label="Jump to a stage">
          {stages.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`jump-link tone-${s.tone}`}>
              {s.name}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* ---------- Overview ---------- */}
      <section className="section section--white">
        <div className="container">
          <ul className="overview-grid">
            {overview.map((o, i) => {
              const Icon = o.icon;
              return (
                <Reveal as="li" key={o.title} className={`overview-card tone-${o.tone}`} delay={i * 80}>
                  <span className="icon-badge"><Icon size={22} aria-hidden="true" /></span>
                  <h2>{o.title}</h2>
                  <p>{o.text}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Stages ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our stages" title="Four stages, one steady journey" />
          <div className="stage-list">
            {stages.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal as="article" key={s.id} id={s.id} className={`stage tone-${s.tone}`}>
                  <header className="stage__head">
                    <span className="icon-badge"><Icon size={24} aria-hidden="true" /></span>
                    <div>
                      <p className="stage__count">Stage {i + 1}</p>
                      <h3>{s.name}</h3>
                    </div>
                  </header>
                  <div className="chip-row">
                    {s.standards.map((std) => <span key={std} className="chip">{std}</span>)}
                  </div>
                  <p className="stage__summary">{s.summary}</p>
                  <ul className="check-list">
                    {s.details.map((d) => (
                      <li key={d}>
                        <Check size={18} aria-hidden="true" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Streams ---------- */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead
            eyebrow="Std 11 & 12"
            title="Choose your stream"
            lead="After Std 10, students continue with us in the Science or Commerce stream, preparing for the Std 12 GSEB board examination."
          />
          <div className="stream-grid">
            {streams.map((st, i) => {
              const Icon = st.icon;
              return (
                <Reveal key={st.name} className={`stream-card tone-${st.tone}`} delay={i * 100}>
                  <div className="stream-card__head">
                    <span className="icon-badge"><Icon size={24} aria-hidden="true" /></span>
                    <h3>{st.name}</h3>
                  </div>
                  <p>{st.text}</p>
                  <p className="stream-card__label">Main subjects</p>
                  <div className="chip-row">
                    {st.subjects.map((sub) => <span key={sub} className="chip chip--white">{sub}</span>)}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Computer education ---------- */}
      <section className="section">
        <div className="container split">
          <div>
            <SectionHead
              eyebrow="Computer education"
              title="Practical computer skills in our computer lab"
              lead="Following the GSEB curriculum, students learn step by step — from what a computer is to building their first web page."
            />
          </div>
          <Reveal className="topic-card">
            <span className="icon-badge tone-blue"><Laptop size={22} aria-hidden="true" /></span>
            <ul className="topic-list">
              {computerTopics.map((t) => (
                <li key={t}>
                  <Check size={18} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Activities in the timetable ---------- */}
      <section className="section section--white">
        <div className="container">
          <SectionHead
            eyebrow="Part of every week"
            title="Activities built into the timetable"
            lead="Alongside academics, every student takes part in:"
            align="center"
          />
          <Reveal as="ul" className="activity-pills">
            {activities.map((a) => {
              const Icon = a.icon;
              return (
                <li key={a.title} className={`activity-pill tone-${a.tone}`}>
                  <span className="icon-badge"><Icon size={18} aria-hidden="true" /></span>
                  {a.title}
                </li>
              );
            })}
          </Reveal>
          <Reveal className="center-link">
            <Link to="/campus-life" className="text-link">
              See campus life <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <QuoteBand {...quotes.academics} />
      <CtaBand />
    </>
  );
};

export default Academics;
