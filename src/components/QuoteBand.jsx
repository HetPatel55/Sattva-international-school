import { Quote } from 'lucide-react';
import Reveal from './Reveal';

const QuoteBand = ({ text, by }) => (
  <section className="quote-band" aria-label="Quote">
    <Reveal className="container quote-band__inner">
      <Quote className="quote-band__mark" size={40} aria-hidden="true" />
      <blockquote>
        <p>{text}</p>
        <footer>— {by}</footer>
      </blockquote>
    </Reveal>
  </section>
);

export default QuoteBand;
