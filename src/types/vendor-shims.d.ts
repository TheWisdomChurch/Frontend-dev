declare module 'framer-motion' {
  export const AnimatePresence: any;
  export const motion: any;
}

declare module 'gsap' {
  export const gsap: any;
  export default gsap;
  export namespace gsap {
    type Context = any;
    namespace core {
      type Timeline = any;
    }
  }
}

declare module 'gsap/ScrollTrigger' {
  const ScrollTrigger: any;
  export default ScrollTrigger;
}

declare module 'gsap/ScrollToPlugin' {
  const ScrollToPlugin: any;
  export default ScrollToPlugin;
}

declare module '@hookform/resolvers/zod' {
  export const zodResolver: any;
}

declare module 'react-hook-form' {
  export function useForm<TFieldValues = any>(options?: any): any;
}
