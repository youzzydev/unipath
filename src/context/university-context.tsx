'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UniversityWithCoordsAndIntelligence } from '@/types';

interface UniversityContextValue {
  selectedUniversity: UniversityWithCoordsAndIntelligence | null;
  setSelectedUniversity: (university: UniversityWithCoordsAndIntelligence | null) => void;
  hoveredUniversity: string | null;
  setHoveredUniversity: (slug: string | null) => void;
}

const UniversityContext = createContext<UniversityContextValue | undefined>(undefined);

interface UniversityProviderProps {
  children: ReactNode;
  initialUniversity?: UniversityWithCoordsAndIntelligence | null;
}

export function UniversityProvider({ 
  children, 
  initialUniversity = null 
}: UniversityProviderProps) {
  const [selectedUniversity, setSelectedUniversityState] = useState<UniversityWithCoordsAndIntelligence | null>(initialUniversity);
  const [hoveredUniversity, setHoveredUniversity] = useState<string | null>(null);

  const setSelectedUniversity = useCallback((university: UniversityWithCoordsAndIntelligence | null) => {
    setSelectedUniversityState(university);
  }, []);

  return (
    <UniversityContext.Provider 
      value={{
        selectedUniversity,
        setSelectedUniversity,
        hoveredUniversity,
        setHoveredUniversity,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
}
