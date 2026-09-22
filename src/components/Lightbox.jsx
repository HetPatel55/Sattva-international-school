import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Full-screen photo viewer shared by the Gallery and event albums.
// Keyboard (Esc, ←, →), swipe on touch screens, focus returns on close.
// Pass stable `onClose`/`onMove` callbacks so focus isn't reset each render.
const Lightbox = ({ items, index, onClose, onMove }) => {
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const item = items[index];

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add('menu-open');
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'ArrowRight') onMove(1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('menu-open');
      previousFocus?.focus?.();
    };
  }, [onClose, onMove]);

  if (!item) return null;

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onMove(dx > 0 ? -1 : 1);
        touchX.current = null;
      }}
    >
      <button ref={closeRef} type="button" className="lightbox__btn lightbox__close" onClick={onClose} aria-label="Close">
        <X size={24} aria-hidden="true" />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" className="lightbox__btn lightbox__prev" aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); onMove(-1); }}>
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
          <button type="button" className="lightbox__btn lightbox__next" aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); onMove(1); }}>
            <ChevronRight size={26} aria-hidden="true" />
          </button>
        </>
      )}
      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        <figcaption>
          {item.alt}
          <span>{index + 1} / {items.length}</span>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
};

export default Lightbox;
