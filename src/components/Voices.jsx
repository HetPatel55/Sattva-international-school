import { Quote } from 'lucide-react';
import { useContent } from '../content/context';
import SectionHead from './SectionHead';
import Reveal from './Reveal';

// "Children's voices": appears only once real entries are added in the admin panel.
const Voices = () => {
  const { voices } = useContent();
  const items = voices.filter((v) => v.quote?.trim());
  if (!items.length) return null;

  return (
    <section className="section section--white" aria-labelledby="voices-title">
      <div className="container">
        <SectionHead eyebrow="Children’s voices" title="In their own words" id="voices-title" />
        <ul className="voices">
          {items.map((v, i) => (
            <Reveal as="li" key={`${v.name}-${i}`} className="voice" delay={(i % 3) * 80}>
              <Quote size={28} aria-hidden="true" className="voice__mark" />
              <blockquote>{v.quote}</blockquote>
              {(v.name || v.role) && (
                <p className="voice__by">
                  <strong>{v.name}</strong>
                  {v.role && <span>{v.role}</span>}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Voices;
