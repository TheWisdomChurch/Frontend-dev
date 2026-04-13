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
  export const ScrollTrigger: any;
  const ScrollTrigger: any;
  export default ScrollTrigger;
}

declare module 'gsap/ScrollToPlugin' {
  export const ScrollToPlugin: any;
  const ScrollToPlugin: any;
  export default ScrollToPlugin;
}

declare module '@hookform/resolvers/zod' {
  export const zodResolver: any;
}

declare module 'react-hook-form' {
  import type * as React from 'react';

  export type FieldValues = Record<string, any>;
  export type SubmitHandler<TFieldValues extends FieldValues = FieldValues> = (
    data: TFieldValues,
    event?: React.BaseSyntheticEvent
  ) => any;
  export type UseFormHandleSubmit<
    TFieldValues extends FieldValues = FieldValues,
    TContext = undefined,
  > = (
    handler: SubmitHandler<TFieldValues>,
    onInvalid?: (errors: any, event?: React.BaseSyntheticEvent) => void
  ) => (event?: React.BaseSyntheticEvent) => Promise<void>;

  export function useForm<TFieldValues = any>(options?: any): any;
}
