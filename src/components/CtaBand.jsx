import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { useContent } from '../content/context';
import Reveal from './Reveal';

const CtaBand = ({
  title = 'Come and see SATTVA for yourself',
  text = 'Visit the campus, meet our teachers and find the right standard and medium for your child.',
}) => {
  const { school } = useContent();
  const phone = school.phones[0];

  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          {/* Faint full logo (mark + SATTVA name) as a watermark behind the content */}
          <img className="cta-band__watermark" src="/brand/logo-light.png" alt="" width="782" height="200" loading="lazy" />
          <div className="cta-band__text">
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/admissions#enquiry" className="btn btn--primary">
              Admission enquiry <ArrowRight size={18} aria-hidden="true" />
            </Link>
            {phone && (
              <a href={`tel:${phone.tel}`} className="btn btn--outline-light">
                <Phone size={18} aria-hidden="true" /> {phone.display}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CtaBand;
