import Reveal from './Reveal';

const SectionHead = ({ eyebrow, title, lead, align = 'left', light = false, id }) => (
  <Reveal className={`section-head section-head--${align}${light ? ' section-head--light' : ''}`}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2 id={id}>{title}</h2>
    {lead && <p className="lead">{lead}</p>}
  </Reveal>
);

export default SectionHead;
