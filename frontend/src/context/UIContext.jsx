import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext(null);

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [forceDesktop, setForceDesktop] = useState(localStorage.getItem('vps-force-desktop') === 'true');

  useEffect(() => {
    // Apply a global class to the document root to allow CSS overrides
    if (forceDesktop) {
      document.documentElement.classList.add('force-desktop');
    } else {
      document.documentElement.classList.remove('force-desktop');
    }
    // Persist preference
    localStorage.setItem('vps-force-desktop', forceDesktop);
  }, [forceDesktop]);

  return (
    <UIContext.Provider value={{ forceDesktop, setForceDesktop }}>
      {children}
    </UIContext.Provider>
  );
};
