import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight } from 'lucide-react';
import { useContent } from '../content/context';

// Optional strip above the navbar ("Admissions open for 2027–28"), switched on in the admin panel.
const AnnouncementBar = ({ onNavigate }) => {
  const { announcement: a } = useContent();
  if (!a.enabled || !a.text?.trim()) return null;

  const internal = a.linkUrl?.startsWith('/');
  const link = a.linkUrl && (
    internal ? (
      <Link to={a.linkUrl} onClick={onNavigate}>
        {a.linkLabel || 'Learn more'} <ArrowRight size={14} aria-hidden="true" />
      </Link>
    ) : (
      <a href={a.linkUrl} target="_blank" rel="noopener noreferrer">
        {a.linkLabel || 'Learn more'} <ArrowRight size={14} aria-hidden="true" />
      </a>
    )
  );

  return (
    <div className="announce" role="region" aria-label="Announcement">
      <div className="container announce__inner">
        <Megaphone size={16} aria-hidden="true" className="announce__icon" />
        <p>{a.text}</p>
        {link}
      </div>
    </div>
  );
};

export default AnnouncementBar;
