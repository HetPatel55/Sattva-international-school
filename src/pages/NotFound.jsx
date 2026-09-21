import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import TileMotif from '../components/TileMotif';

const NotFound = () => {
  usePageMeta('Page not found');
  return (
    <section className="section not-found">
      <div className="container not-found__inner">
        <TileMotif size={96} />
        <h1>We couldn’t find that page</h1>
        <p className="lead">The page may have moved. Try the home page or get in touch with us.</p>
        <div className="hero-buttons">
          <Link to="/" className="btn btn--ink">Go to home page</Link>
          <Link to="/contact" className="btn btn--outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
