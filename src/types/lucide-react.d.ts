declare module 'lucide-react' {
  import * as React from 'react';

  export type LucideIcon = React.FC<
    React.SVGProps<SVGSVGElement> & {
      size?: number | string;
      color?: string;
      strokeWidth?: number | string;
    }
  >;

  export const Activity: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const Bell: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Calendar: LucideIcon;
  export const CalendarClock: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Church: LucideIcon;
  export const Clock: LucideIcon;
  export const Copy: LucideIcon;
  export const Eye: LucideIcon;
  export const Gift: LucideIcon;
  export const Home: LucideIcon;
  export const Loader2: LucideIcon;
  export const MapPin: LucideIcon;
  export const Menu: LucideIcon;
  export const Minus: LucideIcon;
  export const Pause: LucideIcon;
  export const Phone: LucideIcon;
  export const PictureInPicture: LucideIcon;
  export const Play: LucideIcon;
  export const PlayCircle: LucideIcon;
  export const Plus: LucideIcon;
  export const Quote: LucideIcon;
  export const Radio: LucideIcon;
  export const Search: LucideIcon;
  export const Share2: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Trash2: LucideIcon;
  export const Users: LucideIcon;
  export const Video: LucideIcon;
  export const X: LucideIcon;
}
