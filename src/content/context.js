import { createContext, useContext } from 'react';

export const ContentContext = createContext(null);

// Everything pages render: school details, sections, events and `backend`
// (true once the site's own API has answered).
export const useContent = () => useContext(ContentContext);
