// hooks/useResponsive.ts
import { useMemo } from 'react';
import { getHeroResponsiveStyles,responsive } from '@/lib/responsivee';

export function useResponsive() {
  const heroStyles = useMemo(() => getHeroResponsiveStyles(), []);
  
  return {
    // Main responsive config
    config: responsive,
    
    // Hero section specific styles
    hero: heroStyles,
    
    // Helper to combine all hero classes
    getHeroClasses: () => ({
      title: Object.values(heroStyles.title).join(' '),
      subtitle: Object.values(heroStyles.subtitle).join(' '),
      description: Object.values(heroStyles.description).join(' '),
      button: Object.values(heroStyles.button).join(' '),
      container: Object.values(heroStyles.container).join(' '),
    }),
    
    // Get specific hero style
    getHeroStyle: <T extends keyof typeof responsive['hero']>(key: T) => {
      const style = heroStyles[key];
      if (typeof style === 'string') {
        return style;
      }
      return Object.values(style).join(' ');
    }
  };
}