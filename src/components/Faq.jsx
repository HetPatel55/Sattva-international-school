import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Accordion with a height animation (grid rows 0fr → 1fr), one answer open at a time.
const Faq = ({ items }) => {
  const [open, setOpen] = useState(null);
  const uid = useId();

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div key={item.q} className={`faq__item${isOpen ? ' is-open' : ''}`}>
            <h3 className="faq__q">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <ChevronDown size={20} aria-hidden="true" className="faq__icon" />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className="faq__panel" inert={!isOpen}>
              <div className="faq__inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Faq;
