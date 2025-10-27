'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
  undefined
);

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({ open, setOpen }),
    [open, setOpen]
  );

  return (
    <SheetContext.Provider value={contextValue}>
      {children}
    </SheetContext.Provider>
  );
};

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
};

interface SheetTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const SheetTrigger: React.FC<SheetTriggerProps> = ({ children, asChild }) => {
  const { setOpen } = useSheet();

  const handleClick = () => {
    setOpen(true);
  };

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

interface SheetCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const SheetClose: React.FC<SheetCloseProps> = ({ children, asChild }) => {
  const { setOpen } = useSheet();

  const handleClick = () => {
    setOpen(false);
  };

  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<{
      onClick?: React.MouseEventHandler;
    }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

const SheetPortal: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

type SheetOverlayProps = React.HTMLAttributes<HTMLDivElement>;

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = useSheet();

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 bg-black/80 animate-in fade-in-0',
          className
        )}
        {...props}
      />
    );
  }
);
SheetOverlay.displayName = 'SheetOverlay';

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right';
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => {
    const { open, setOpen } = useSheet();

    // Close on escape key
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [open, setOpen]);

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setOpen(false);
      }
    };

    const getPositionStyles = () => {
      const baseStyles =
        'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out animate-in duration-500';

      const positions = {
        top: 'inset-x-0 top-0 border-b slide-in-from-top',
        bottom: 'inset-x-0 bottom-0 border-t slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l slide-in-from-right sm:max-w-sm',
      };

      return cn(baseStyles, positions[side]);
    };

    if (!open) return null;

    return (
      <SheetPortal>
        <SheetOverlay onClick={handleOverlayClick}>
          <div
            ref={ref}
            className={cn(getPositionStyles(), className)}
            {...props}
          >
            {children}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              type="button"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </SheetOverlay>
      </SheetPortal>
    );
  }
);
SheetContent.displayName = 'SheetContent';

type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const SheetHeader: React.FC<SheetHeaderProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>;

const SheetFooter: React.FC<SheetFooterProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

type SheetTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
);
SheetTitle.displayName = 'SheetTitle';

type SheetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
