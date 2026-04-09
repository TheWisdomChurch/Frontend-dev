/* eslint-disable @typescript-eslint/no-explicit-any */

// components/ui/Sheet.tsx
'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { createPortal } from 'react-dom';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
  undefined
);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context)
    throw new Error('Sheet compound components must be used within <Sheet>');
  return context;
};

/* ========================================== */
/*               Root Sheet                  */
/* ========================================== */
interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : uncontrolledOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const value = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
};

/* ========================================== */
/*               Trigger                     */
/* ========================================== */
interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild = false, children, ...props }, ref) => {
    const { setOpen } = useSheet();

    if (asChild && React.isValidElement(children)) {
      const childProps: any = {
        onClick: (e: React.MouseEvent) => {
          (children.props as any)?.onClick?.(e);
          setOpen(true);
        },
      };
      return React.cloneElement(children, childProps);
    }

    return (
      <button ref={ref} type="button" onClick={() => setOpen(true)} {...props}>
        {children}
      </button>
    );
  }
);
SheetTrigger.displayName = 'SheetTrigger';

/* ========================================== */
/*               Overlay                     */
/* ========================================== */
interface SheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
}

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, overlayClassName, ...props }, ref) => {
    const { open, setOpen } = useSheet();

    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          overlayClassName
        )}
        onClick={() => setOpen(false)}
        {...props}
      />,
      document.body
    );
  }
);
SheetOverlay.displayName = 'SheetOverlay';

/* ========================================== */
/*               Content                     */
/* ========================================== */
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  disableOutsideClose?: boolean;
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  (
    { side = 'right', className, children, disableOutsideClose, ...props },
    ref
  ) => {
    const { open, setOpen } = useSheet();
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Combine refs properly
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Focus trap + first focus
    React.useEffect(() => {
      if (!open) return;

      const handleTab = (e: KeyboardEvent) => {
        const el = contentRef.current;
        if (!el) return;

        const focusable = el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      const firstFocusable = contentRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();

      return () => document.removeEventListener('keydown', handleTab);
    }, [open]);

    // Escape key
    React.useEffect(() => {
      const handler = (e: KeyboardEvent) =>
        e.key === 'Escape' && setOpen(false);
      if (open) document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [open, setOpen]);

    if (!open) return null;

    const positionClasses = {
      top: 'inset-x-0 top-0 rounded-b-3xl slide-in-from-top-1/2',
      bottom: 'inset-x-0 bottom-0 rounded-t-3xl slide-in-from-bottom-1/2',
      left: 'inset-y-0 left-0 w-full max-w-md rounded-r-3xl slide-in-from-left-full',
      right:
        'inset-y-0 right-0 w-full max-w-md rounded-l-3xl slide-in-from-right-full',
    }[side];

    return (
      <>
        <SheetOverlay />
        {createPortal(
          <div
            ref={mergedRef}
            className={cn(
              'fixed z-50 bg-background shadow-2xl transition-all duration-500',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              positionClasses,
              className
            )}
            {...props}
          >
            <div className="flex h-full flex-col">
              {children}
              <button
                onClick={() => setOpen(false)}
                className={cn(
                  'absolute right-6 top-6 rounded-full p-2 opacity-70 transition-all',
                  'hover:opacity-100 hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary',
                  'disabled:pointer-events-none'
                )}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }
);
SheetContent.displayName = 'SheetContent';

/* ========================================== */
/*           Header / Footer / Title         */
/* ========================================== */
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-3 border-b border-border/50 px-8 py-6',
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse gap-4 border-t border-border/50 px-8 py-6 sm:flex-row sm:justify-end',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-2xl font-bold tracking-tight', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

/* ========================================== */
/*                  Export                   */
/* ========================================== */
export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
};
