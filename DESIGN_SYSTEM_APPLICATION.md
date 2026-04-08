# Design System Application Plan

## Overview

Systematically apply unified design system across all pages to improve aesthetics, consistency, and user engagement.

## Design System Available

- **Colors**: Primary (#F7DE12), Secondary (#FFB81C), Success, Error, Warning, Info + grayscale
- **Typography**: 9 scales from Display (64px) to XS (11px)
- **Spacing**: 8px base unit ($space-1 to $space-20)
- **Buttons**: 7 variants × 5 sizes + states

## Implementation Priority

### Phase 1: Core Pages (Homepage & Main Features)

- [ ] Home (page.tsx) - Hero + sections
- [ ] HeroMain - Button CTAs, spacing
- [ ] HeroHighlights - Card styling
- [ ] WhatWeDo - Service box styling
- [ ] EventsShowcase - Event cards
- [ ] Testimonials - Testimonial cards
- [ ] Leadership - Leader cards
- [ ] JoinUs - CTA section
- [ ] OnlineGiving - Donation UI

### Phase 2: Secondary Pages

- [ ] About page
- [ ] Resources page
- [ ] Store page
- [ ] Contact page
- [ ] Events pages (weekly, special)
- [ ] Ministry pages

### Phase 3: Forms & Modals

- [ ] All form pages
- [ ] Modal styling
- [ ] Input fields
- [ ] Button consistency

## UX Improvements

1. **Visual Hierarchy**: Use typography scales + spacing consistently
2. **Color Usage**:
   - Primary button = Primary color (#F7DE12) with black text
   - Secondary = Secondary color (#FFB81C)
   - Accent = Use for highlights
3. **Spacing**: Use $space-\* consistently (no hardcoded px)
4. **Mobile**: Ensure all breakpoints work
5. **Engagement**:
   - Clear CTAs with primary color
   - Hover states with subtle animations
   - Loading states for async operations
   - Error/success feedback

## CSS Variables to Use

```scss
// Colors
$color-primary: #f7de12;
$color-secondary: #1f2937;
$color-accent: #f7de12;

// Spacing
$space-1: 8px;
$space-2: 16px;
$space-3: 24px;
$space-4: 32px;
$space-5: 40px;
$space-6: 48px;

// Typography
$font-size-h1: 64px;
$font-size-h2: 48px;
$font-size-h3: 32px;
$font-size-h4: 24px;
$font-size-body: 16px;
```

## Success Metrics

- All pages use design system
- No hardcoded colors (except in utilities/legacy)
- Consistent spacing throughout
- Mobile responsive (320px+)
- Clear visual hierarchy
- 3+ CTA buttons per major page
- Loading/error states implemented
