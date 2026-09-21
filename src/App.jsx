import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';

// Home loads immediately; other pages load on demand.
const About = lazy(() => import('./pages/About'));
const Academics = lazy(() => import('./pages/Academics'));
const CampusLife = lazy(() => import('./pages/CampusLife'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="page-loader" role="status" aria-label="Loading page">
    <span />
  </div>
);

const App = () => (
  <BrowserRouter>
    <ScrollManager />
    <a href="#main" className="skip-link">Skip to main content</a>
    <SiteHeader />
    <main id="main">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/campus-life" element={<CampusLife />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <SiteFooter />
  </BrowserRouter>
);

export default App;
