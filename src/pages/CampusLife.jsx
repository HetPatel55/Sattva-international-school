import { Sparkles, PartyPopper, Flag, MapPin } from 'lucide-react';
import { useContent } from '../content/context';
import usePageMeta from '../hooks/usePageMeta';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import CtaBand from '../components/CtaBand';
import Photo from '../components/Photo';
import { ratioOf } from '../data/forms';

const CampusLife = () => {
  const { school, home, facilities, activities, annualFunction: showcase, festivals, houses } = useContent();
  usePageMeta('Campus Life', `Facilities, activities, annual function, festivals and the house system at ${school.name}.`);

  return (
    <>
      <PageHero
        eyebrow="Campus life"
        title="A campus full of learning and life"
        lead="Labs, auditoriums and air-conditioned classrooms — plus art, dance, karate, skating, yoga and celebrations all year round."
      />

      {/* ---------- Facilities ---------- */}
      <section className="section section--white">
        <div className="container">
          <SectionHead eyebrow="Facilities" title="Everything our students need" />
          <ul className="facility-grid">
            {facilities.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal as="li" key={f.title} className="facility-card" delay={(i % 3) * 70}>
                  <span className="icon-badge icon-badge--soft"><Icon size={24} aria-hidden="true" /></span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              );
            })}
          </ul>
          <Reveal className="photo-strip">
            <Photo
              image={home.campusImage}
              sizes="(min-width: 1180px) 1180px, 100vw"
              loading="lazy"
              style={{ aspectRatio: ratioOf(home.campusImage) }}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- Activities ---------- */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Activities"
            title="Seven activities, every child"
            lead="These run alongside academics for all our students, helping each child find what they love."
          />
          <ul className="activity-grid">
            {activities.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal as="li" key={a.title} className={`activity-card tone-${a.tone}`} delay={(i % 2) * 70}>
                  <span className="icon-badge"><Icon size={22} aria-hidden="true" /></span>
                  <div>
                    <h3>{a.title}</h3>
                    <p>{a.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------- Annual function & festivals ---------- */}
      <section className="section section--sand">
        <div className="container event-grid">
          <Reveal className="event-card event-card--feature tone-orange">
            <span className="icon-badge"><Sparkles size={24} aria-hidden="true" /></span>
            <p className="eyebrow">Every year</p>
            <h2>Annual Function</h2>
            <p>
              The highlight of our school year. Our students take the stage to
              show their families what they have learned.
            </p>
            <div className="chip-row">
              {showcase.map((s) => <span key={s} className="chip chip--white">{s}</span>)}
            </div>
          </Reveal>

          <Reveal className="event-card tone-crimson" delay={100}>
            <span className="icon-badge"><PartyPopper size={24} aria-hidden="true" /></span>
            <p className="eyebrow">All year round</p>
            <h2>Festivals</h2>
            <p>We celebrate every Indian and Gujarati festival at school, keeping our students close to their culture and traditions.</p>
            <div className="chip-row">
              {festivals.map((f) => <span key={f} className="chip chip--white">{f}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Houses & transport ---------- */}
      <section className="section">
        <div className="container two-col">
          <Reveal className="info-card tone-purple">
            <span className="icon-badge"><Flag size={24} aria-hidden="true" /></span>
            <h2>House System</h2>
            <p>
              Every class in every standard is divided into the same {houses.total} houses — {houses.phrase}. Houses bring students of different ages together and build teamwork,
              leadership and healthy competition.
            </p>
          </Reveal>
          <Reveal className="info-card tone-blue" delay={100}>
            <span className="icon-badge"><MapPin size={24} aria-hidden="true" /></span>
            <h2>School transport</h2>
            <p>Our GPS-enabled buses pick up and drop students across:</p>
            <div className="chip-row">
              {school.transportAreas.map((a) => <span key={a} className="chip">{a}</span>)}
              <span className="chip">and nearby areas</span>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
};

export default CampusLife;
