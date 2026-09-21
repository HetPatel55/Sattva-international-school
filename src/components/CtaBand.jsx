import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { school } from '../data/site';
import TileMotif from './TileMotif';
import Reveal from './Reveal';

// Small logo marks scattered on the cream background around the band.
// Positions live in CSS (.cta-scatter__n) so each breakpoint can move or hide them.
const SCATTER = 8;

const CtaBand = ({
  title = 'Come and see SATTVA for yourself',
  text = 'Visit the campus, meet our teachers and find the right standard and medium for your child.',
}) => (
  <section className="section cta-section">
    <div className="cta-scatter" aria-hidden="true">
      {Array.from({ length: SCATTER }, (_, i) => (
        <TileMotif key={i} className={`cta-scatter__item cta-scatter__${i + 1}`} />
      ))}
    </div>
    <div className="container">
      <Reveal className="cta-band">
        <div className="cta-band__text">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-band__actions">
          <Link to="/admissions#enquiry" className="btn btn--primary">
            Admission enquiry <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a href={`tel:${school.phones[0].tel}`} className="btn btn--outline-light">
            <Phone size={18} aria-hidden="true" /> {school.phones[0].display}
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

export default CtaBand;
