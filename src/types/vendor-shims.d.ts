/* eslint-disable @typescript-eslint/no-unused-vars */
declare module 'framer-motion' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const AnimatePresence: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const motion: any;
}

declare module 'gsap' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const gsap: any;
  export default gsap;
  export namespace gsap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Context = any;
    namespace core {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type Timeline = any;
    }
  }
}

declare module 'gsap/ScrollTrigger' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ScrollTrigger: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ScrollTrigger: any;
  export default ScrollTrigger;
}

declare module 'gsap/ScrollToPlugin' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const ScrollToPlugin: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ScrollToPlugin: any;
  export default ScrollToPlugin;
}

declare module '@hookform/resolvers/zod' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const zodResolver: any;
}

declare module 'react-hook-form' {
  import type * as React from 'react';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type FieldValues = Record<string, any>;
  export type SubmitHandler<TFieldValues extends FieldValues = FieldValues> = (
    data: TFieldValues,
    event?: React.BaseSyntheticEvent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => any;
  export type UseFormHandleSubmit<
    TFieldValues extends FieldValues = FieldValues,
    TContext = undefined,
  > = (
    handler: SubmitHandler<TFieldValues>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onInvalid?: (errors: any, event?: React.BaseSyntheticEvent) => void
  ) => (event?: React.BaseSyntheticEvent) => Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useForm<TFieldValues = any>(options?: any): any;
}
