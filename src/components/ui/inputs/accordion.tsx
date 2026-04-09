'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AccordionProps {
  className?: string;
  children: React.ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string;
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
} | null>(null);

const Accordion: React.FC<AccordionProps> = ({
  className = '',
  children,
  type = 'single',
  defaultValue,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(
    defaultValue ? [defaultValue] : []
  );

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value]);
    } else {
      setOpenItems(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  className = '',
  children,
}) => {
  const context = React.useContext(AccordionContext);
  const isOpen = context?.openItems.includes(value) || false;

  return (
    <div
      className={cn('border-b border-gray-200 last:border-b-0', className)}
      data-state={isOpen ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
};

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className = '',
  children,
  ...props
}) => {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(ItemContext);

  if (!context || !itemContext) {
    throw new Error('AccordionTrigger must be used within AccordionItem');
  }

  const isOpen = context.openItems.includes(itemContext.value);

  return (
    <button
      type="button"
      className={cn(
        'flex flex-1 items-center justify-between w-full py-4 font-medium transition-all hover:underline text-left',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      onClick={() => context.toggleItem(itemContext.value)}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-4 w-4 shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
};

const AccordionContent: React.FC<AccordionContentProps> = ({
  className = '',
  children,
  ...props
}) => {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(ItemContext);

  if (!context || !itemContext) {
    throw new Error('AccordionContent must be used within AccordionItem');
  }

  const isOpen = context.openItems.includes(itemContext.value);

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      )}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </div>
  );
};

// Context for item value
const ItemContext = React.createContext<{ value: string }>({ value: '' });

// Helper component to wrap item content
const AccordionItemWrapper: React.FC<AccordionItemProps> = ({
  value,
  children,
  ...props
}) => {
  return (
    <ItemContext.Provider value={{ value }}>
      <AccordionItem value={value} {...props}>
        {children}
      </AccordionItem>
    </ItemContext.Provider>
  );
};

export {
  Accordion,
  AccordionItemWrapper as AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
