import { useEffect, useRef, useState } from 'react';

// Fades its content in the first time it scrolls into view.
const Reveal = ({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) => {
  const ref = useRef(null);
  // Browsers without IntersectionObserver simply show the content straight away
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window));

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
