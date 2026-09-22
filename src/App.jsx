import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
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
const EventAlbum = lazy(() => import('./pages/EventAlbum'));
const NotFound = lazy(() => import('./pages/NotFound'));
// The admin panel is its own bundle, so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const PageLoader = () => (
  <div className="page-loader" role="status" aria-label="Loading page">
    <span />
  </div>
);

const PublicLayout = () => (
  <>
    <a href="#main" className="skip-link">Skip to main content</a>
    <SiteHeader />
    <main id="main">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </main>
    <SiteFooter />
  </>
);

const App = () => (
  <BrowserRouter>
    <ScrollManager />
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/campus-life" element={<CampusLife />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events/:slug" element={<EventAlbum />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
