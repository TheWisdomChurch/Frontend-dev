// Type declarations for lucide-react
declare module 'lucide-react' {
  import type React from 'react';

  interface LucideProps extends React.SVGAttributes<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number;
    className?: string;
  }

  // Export all icon components
  export const Home: React.FC<LucideProps>;
  export const Menu: React.FC<LucideProps>;
  export const X: React.FC<LucideProps>;
  export const ArrowRight: React.FC<LucideProps>;
  export const Calendar: React.FC<LucideProps>;
  export const MapPin: React.FC<LucideProps>;
  export const Play: React.FC<LucideProps>;
  export const BookOpenCheck: React.FC<LucideProps>;
  export const CalendarDays: React.FC<LucideProps>;
  export const HeartHandshake: React.FC<LucideProps>;
  export const Radio: React.FC<LucideProps>;
  export const Sparkles: React.FC<LucideProps>;
  export const Users: React.FC<LucideProps>;
  export const Laptop2: React.FC<LucideProps>;
  export const Moon: React.FC<LucideProps>;
  export const Sun: React.FC<LucideProps>;

  // Generic icon component
  export const createIcon: (name: string) => React.FC<LucideProps>;
}
