import { useEffect } from 'react';
import { useContent } from '../content/context';

// Sets the document title and meta description for each page.
export default function usePageMeta(title, description) {
  const { school } = useContent();
  useEffect(() => {
    document.title = title ? `${title} | ${school.name}` : `${school.name} | GSEB School in Singarwa, Ahmedabad`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description, school.name]);
}
