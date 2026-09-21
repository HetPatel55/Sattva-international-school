import { useEffect } from 'react';
import { school } from '../data/site';

// Sets the document title and meta description for each page.
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${school.name}` : `${school.name} | GSEB School in Singarwa, Ahmedabad`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
