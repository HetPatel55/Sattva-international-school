import { Compass, Eye } from 'lucide-react';
import { useContent } from '../content/context';
import usePageMeta from '../hooks/usePageMeta';
import Photo from '../components/Photo';
import { ratioOf } from '../data/forms';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import QuoteBand from '../components/QuoteBand';
import CtaBand from '../components/CtaBand';

// Sets the Sanskrit word "sattva" in italics wherever the story mentions it.
const withSattva = (text) =>
  text.split(/(\bsattva\b)/).map((part, i) => (part === 'sattva' ? <em key={i}>sattva</em> : part));

const About = () => {
  const { school, about, home, values, milestones, houses, quotes } = useContent();
  usePageMeta('About Us', `About ${school.name} — a GSEB school in Singarwa, Ahmedabad, founded in ${school.founded}.`);

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A young school with deep roots"
        lead={`Founded in ${school.founded} in Singarwa, Ahmedabad, SATTVA blends value-based learning with a modern education — from JrKG to Std 12.`}
      />

      {/* ---------- Story ---------- */}
      <section className="section">
        <div className="container story">
          <div className="story__text">
            <SectionHead eyebrow="Our story" title="Why SATTVA?" />
            <Reveal>
              {about.story.map((para) => <p key={para}>{withSattva(para)}</p>)}
            </Reveal>
          </div>
          <Reveal className="story__media">
            <Photo
              image={home.heroImage}
              sizes="(min-width: 1024px) 560px, 100vw"
              loading="lazy"
              style={{ aspectRatio: ratioOf(home.heroImage) }}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- Mission & vision ---------- */}
      <section className="section section--white">
        <div className="container">
          <div className="mv">
            <Reveal className="mv__card">
              <span className="icon-badge tone-green"><Compass size={22} aria-hidden="true" /></span>
              <h2>Our mission</h2>
              <p>{about.mission}</p>
            </Reveal>
            <Reveal className="mv__card" delay={100}>
              <span className="icon-badge tone-blue"><Eye size={22} aria-hidden="true" /></span>
              <h2>Our vision</h2>
              <p>{about.vision}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our values" title="What we stand for" align="center" />
          <ul className="value-grid">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal as="li" key={v.title} className={`value-card tone-${v.tone}`} delay={i * 70}>
                  <span className="icon-badge"><Icon size={22} aria-hidden="true" /></span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Journey ---------- */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Our journey" title="Growing year by year" />
          <ol className="timeline">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} className="timeline__item" delay={i * 80}>
                <span className="timeline__year">{m.year}</span>
                <div className="timeline__card">
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Houses ---------- */}
      <section className="section">
        <div className="container houses">
          <SectionHead
            eyebrow="House system"
            title={`${houses.total} houses, one school family`}
            lead={`Every class in every standard is divided into the same ${houses.total} houses — ${houses.phrase}. The houses bring students of different ages together, building teamwork, leadership and healthy competition.`}
          />
          <Reveal className="houses__art" aria-hidden="true">
            <span className="tone-red" />
            <span className="tone-green" />
            <span className="tone-blue" />
            <span className="tone-orange" />
          </Reveal>
        </div>
      </section>

      <QuoteBand {...quotes.about} />
      <CtaBand />
    </>
  );
};

export default About;
