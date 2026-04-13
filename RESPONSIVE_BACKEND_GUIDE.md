# Responsive Design & Backend Structure Implementation Guide

## 📋 Overview

This guide explains the new responsive design system, backend API structure, modal improvements, and how to use the new hooks and utilities.

---

## 🎯 1. Responsive Design System

### Screen Size Breakpoints

```typescript
- Mobile:   0-640px (phones)
- Tablet:   640-1024px (tablets)
- Desktop:  1024-1536px (computers)
- Large:    1536-2560px (large monitors)
- TV:       2560px+ (4K/8K displays)
```

### Using Responsive Configuration

```typescript
import {
  responsiveConfig,
  getScreenSize,
  getResponsiveClasses,
} from '@/lib/responsive';

// Get responsive classes for a component
const headingClass = responsiveConfig.heading.mobile; // 'text-2xl'
const headingClass = responsiveConfig.heading.tv; // 'text-6xl'

// Get responsive value based on screen size
const screenSize = getScreenSize(1920); // 'large'
const padding = getResponsiveClasses('padding', screenSize); // 'p-10'
```

### Applying Responsive Classes

```typescript
// In your component
<div className={`
  ${responsiveConfig.heading.mobile}
  sm:${responsiveConfig.heading.tablet}
  lg:${responsiveConfig.heading.desktop}
  xl:${responsiveConfig.heading.large}
  2xl:${responsiveConfig.heading.tv}
`}>
  Responsive Heading
</div>

// Or use the hook
import { useResponsive } from '@/hooks/useResponsive';

export function MyComponent() {
  const { getClasses, isMobile, isTV } = useResponsive();

  return (
    <div className={getClasses('heading')}>
      {isMobile && <p>Mobile view</p>}
      {isTV && <p>TV view</p>}
    </div>
  );
}
```

---

## 🪝 2. Responsive Hooks

### useResponsive Hook

Main hook for responsive design detection and utilities.

```typescript
import { useResponsive } from '@/hooks/useResponsive';

export function Component() {
  const {
    screenSize,        // 'mobile' | 'tablet' | 'desktop' | 'large' | 'tv'
    isMobile,         // boolean
    isTablet,         // boolean
    isDesktop,        // boolean
    isLarge,          // boolean
    isTV,             // boolean
    width,            // number
    height,           // number
    orientation,      // 'portrait' | 'landscape'
    isPortrait,       // boolean
    isLandscape,      // boolean
    isTouchDevice,    // boolean
    getClasses,       // (key) => string
    getValue,         // (config) => string
  } = useResponsive();

  return (
    <div>
      <h1 className={getClasses('heading')}>Screen: {screenSize}</h1>
      {isMobile && <MobileNav />}
      {!isMobile && <DesktopNav />}
    </div>
  );
}
```

### useIsAtLeast / useIsAtMost

Check if screen is at least or at most a certain size.

```typescript
const isDesktopOrBigger = useIsAtLeast('desktop');
const isTabletOrSmaller = useIsAtMost('tablet');

// Useful for conditional rendering
{isDesktopOrBigger && <DesktopFeature />}
```

### useShowOnScreenSize / useHideOnScreenSize

Conditionally render based on screen size.

```typescript
const showOnDesktop = useShowOnScreenSize('desktop');
const hideOnMobile = useHideOnScreenSize('mobile');

{showOnDesktop && <DesktopMenu />}
{hideOnMobile && <SecondaryNav />}
```

### useMediaQuery

Direct media query matching.

```typescript
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
const isPrintView = useMediaQuery('print');
const isLandscape = useMediaQuery('(orientation: landscape)');
```

---

## 🔌 3. Backend API Services

All API calls are made through service classes for consistency and type safety.

### Available Services

1. **apiClient** - Core HTTP client
2. **eventsService** - Event management
3. **eventRegistrationService** - Event registrations
4. **givingService** - Donations and giving

### Using API Services

```typescript
import {
  eventsService,
  eventRegistrationService,
  givingService,
} from '@/lib/api';

// Get upcoming events
const events = await eventsService.getUpcomingEvents(5);

// Submit event registration
const registration = await eventRegistrationService.submitRegistration({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  // ... other fields
});

// Process donation
const donation = await givingService.processDonation({
  amount: 50,
  currency: 'USD',
  method: 'card',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
});
```

### Error Handling

```typescript
try {
  const result = await eventsService.getEvents({ status: 'upcoming' });
} catch (error) {
  console.error('Failed to fetch events:', error.message);
  // Show error to user
}
```

### Authentication

```typescript
import { apiClient } from '@/lib/api';

// Set auth token
apiClient.setAuthToken('your-jwt-token');

// Clear auth token
apiClient.clearAuthToken();
```

---

## 📋 4. Modal Improvements

### Modal Responsive Configuration

Modals automatically adjust sizing based on screen size.

```typescript
import { getModalConfig, getModalSizeByType } from '@/lib/modal-responsive';
import { useResponsive } from '@/hooks/useResponsive';

export function MyModal({ isOpen, onClose }) {
  const { screenSize } = useResponsive();
  const modalConfig = getModalConfig(screenSize);

  // Modal max-width, height, padding automatically set
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={modalConfig.maxWidth}
    >
      {/* Content */}
    </BaseModal>
  );
}
```

### Modal Size Types

```typescript
// Compact modal (for quick confirmations)
<BaseModal size="compact" />

// Default modal (standard)
<BaseModal size="default" />

// Large modal (for forms with many fields)
<BaseModal size="large" />

// Fullscreen modal (maximizes available space)
<BaseModal size="fullscreen" />
```

### Prevent Page Refresh on Form Submission

Use the `useModalForm` hook for safe form handling:

```typescript
import { useModalForm } from '@/hooks/useModalForm';

export function MyFormModal({ isOpen, onClose }) {
  const { wrapHandleSubmit, isSubmitting } = useModalForm({
    onSuccess: () => {
      console.log('Form submitted successfully');
      onClose();
    },
    onError: (error) => {
      console.error('Form error:', error);
    },
  });

  const { handleSubmit } = useForm();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} isLoading={isSubmitting}>
      <form onSubmit={wrapHandleSubmit(handleSubmit, async (data) => {
        await submitData(data);
      })}>
        {/* Form fields */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </BaseModal>
  );
}
```

---

## 🎨 5. Component Spacing & Typography

### Use Responsive Spacing

```typescript
import { responsiveConfig } from '@/lib/responsive';

export function Section() {
  return (
    <section className={`
      ${responsiveConfig.section.mobile}
      sm:${responsiveConfig.section.tablet}
      lg:${responsiveConfig.section.desktop}
      xl:${responsiveConfig.section.large}
      2xl:${responsiveConfig.section.tv}
    `}>
      Content with responsive padding and margins
    </section>
  );
}
```

### Responsive Typography

```typescript
// Use the responsive heading style
<h1 className={`
  ${responsiveConfig.heading.mobile}
  sm:${responsiveConfig.heading.tablet}
  lg:${responsiveConfig.heading.desktop}
`}>
  Main Heading
</h1>

// Use responsive body text
<p className={`
  ${responsiveConfig.body.mobile}
  sm:${responsiveConfig.body.tablet}
  lg:${responsiveConfig.body.desktop}
`}>
  Body paragraph with responsive sizing
</p>
```

### Responsive Grid Layouts

```typescript
import { getGridCols } from '@/lib/responsive';
import { useResponsive } from '@/hooks/useResponsive';

export function CardGrid() {
  const { screenSize } = useResponsive();
  const gridCols = getGridCols(screenSize);

  return (
    <div className={`
      grid gap-4
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      2xl:grid-cols-5
    `}>
      {items.map(item => <Card key={item.id} {...item} />)}
    </div>
  );
}
```

---

## 🛠️ 6. Integration Examples

### Example 1: Event Registration Form Modal

```typescript
import { useResponsive } from '@/hooks/useResponsive';
import { useModalForm } from '@/hooks/useModalForm';
import { eventRegistrationService } from '@/lib/api';
import { BaseModal } from '@/components/ui/modals/ModalBase';

export function EventRegistrationModal({ event, isOpen, onClose }) {
  const { screenSize } = useResponsive();
  const { wrapHandleSubmit, isSubmitting, error } = useModalForm({
    onSuccess: () => {
      toast.success('Registration successful!');
      onClose();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { handleSubmit } = useForm();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Register for ${event.title}`}
      isLoading={isSubmitting}
    >
      <form onSubmit={wrapHandleSubmit(handleSubmit, async (data) => {
        await eventRegistrationService.submitRegistration({
          ...data,
          event_id: event.id,
        });
      })}>
        {/* Form fields */}
        {error && <p className="text-red-400">{error.message}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </BaseModal>
  );
}
```

### Example 2: Responsive Event Listing

```typescript
import { useResponsive } from '@/hooks/useResponsive';
import { responsiveConfig } from '@/lib/responsive';
import { eventsService } from '@/lib/api';

export function EventsList() {
  const { screenSize, getClasses } = useResponsive();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const result = await eventsService.getUpcomingEvents(10);
        setEvents(result);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, []);

  return (
    <section className={getClasses('section')}>
      <h2 className={getClasses('heading')}>Upcoming Events</h2>

      <div className={`
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
      `}>
        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            imageHeight={getClasses('image')}
          />
        ))}
      </div>
    </section>
  );
}
```

---

## 📱 7. Testing Responsive Design

### Test Across Breakpoints

```typescript
// Mobile (640px)
// Tablet (1024px)
// Desktop (1536px)
// Large (2560px)
// TV (3840px+)
```

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Click Device Emulation icon
3. Select device or custom dimensions
4. Verify responsive behavior

### Manual Testing Checklist

- [ ] Mobile layout (376px)
- [ ] Tablet portrait (768px)
- [ ] Tablet landscape (1024px)
- [ ] Desktop (1440px)
- [ ] Large monitor (1920px)
- [ ] 4K TV (3840px)
- [ ] Touch device interaction
- [ ] Landscape/portrait orientation

---

## 🔄 8. Migration from Old System

### Old vs New

```typescript
// OLD - Limited responsive options
const padding = responsive.padding[viewport];

// NEW - Full screen size support
const padding = getResponsiveClasses('padding', screenSize);

// OLD - Limited hooks
useWindowSize();

// NEW - Enhanced hooks with many utilities
useResponsive();
useIsAtLeast();
useShowOnScreenSize();
useMediaQuery();
```

### Update Components Gradually

1. Start with high-traffic components
2. Use `useResponsive()` hook
3. Apply responsive classes
4. Test across devices
5. Fix any layout issues

---

## 📚 Additional Resources

- Tailwind CSS Responsive Design: https://tailwindcss.com/docs/responsive-design
- WCAG Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Mobile Testing Checklist: https://developers.google.com/web/tools/chrome-devtools/device-mode/
- Screen Size Statistics: https://gs.statcounter.com/

---

## ✅ Checklist for Implementation

- [x] Created backend API service layer
- [x] Enhanced responsive design system
- [x] Created responsive utility hooks
- [x] Improved modal responsiveness
- [x] Created modal form safety hook
- [ ] Update existing components to use new system
- [ ] Test all responsive breakpoints
- [ ] Deploy to production
- [ ] Monitor for issues

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-13  
**Status**: Ready for Implementation
