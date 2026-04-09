// components/contexts/HeaderContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface HeaderContextType {
  isHeaderScrolled: boolean;
  setIsHeaderScrolled: (scrolled: boolean) => void;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
  mobileOpenDropdown: string | null;
  setMobileOpenDropdown: (dropdown: string | null) => void;
  isSheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  closeAllDropdowns: () => void;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(
    null
  );
  const [isSheetOpen, setSheetOpen] = useState(false);

  const closeAllDropdowns = useCallback(() => {
    setActiveDropdown(null);
    setMobileOpenDropdown(null);
    setSheetOpen(false);
  }, []);

  return (
    <HeaderContext.Provider
      value={{
        isHeaderScrolled,
        setIsHeaderScrolled,
        activeDropdown,
        setActiveDropdown,
        mobileOpenDropdown,
        setMobileOpenDropdown,
        isSheetOpen,
        setSheetOpen,
        closeAllDropdowns,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
};
