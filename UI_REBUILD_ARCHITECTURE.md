# Wisdom House UI Rebuild Architecture

## Project Overview
Complete professional redesign of the Wisdom House frontend application with enhanced animations, responsive design, optimized performance, and modern visual hierarchy.

---

## 1. DESIGN SYSTEM

### 1.1 Color Palette (Maintained from Existing Scheme)
```
Primary: #F7DE12 (Gold/Yellow)
Primary Dark: #D4BC0F
Secondary: #1F2937 (Dark Gray)
Background: #000000 (Black)
Text Primary: #FFFFFF
Text Secondary: #D1D5DB (Light Gray)
Text Tertiary: #9CA3AF (Muted Gray)
Accent: #F7DE12
Error: #EF4444
Success: #10B981
Warning: #F59E0B
Info: #3B82F6
Border: #E5E7EB (Light)
Surface: #FFFFFF / #030303
```

### 1.2 Typography Scale
```
- Display: 48px - 64px (Hero titles)
- Headline 1: 36px - 48px (Section titles)
- Headline 2: 28px - 32px (Subsection titles)
- Headline 3: 20px - 24px (Card titles)
- Body Large: 18px (Main content)
- Body: 16px (Default)
- Body Small: 14px (Secondary content)
- Caption: 12px (Metadata, labels)

Font Families:
- Display/Headlines: Bricolage (Var font)
- Body: Inter / SF Pro Text
- Serif (Optional emphasis): Playfair
```

### 1.3 Spacing System (8px base)
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 80px
```

### 1.4 Border Radius
```
None: 0px
sm: 4px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

---

## 2. ANIMATION SYSTEM

### 2.1 Motion Tokens
```
Duration:
- Fast: 150ms (UI interactions)
- Normal: 300ms (Transitions)
- Slow: 500ms (Complex animations)
- Slower: 800ms (Entrance animations)

Easing:
- ease-out: Cubic-bezier(0.24, 0, 0.8, 1) - Exit animations
- ease-in: Cubic-bezier(0.24, 0, 0.8, 1) - Entrance
- ease-in-out: Cubic-bezier(0.4, 0, 0.2, 1) - Complex
- linear: Linear transitions
```

### 2.2 Animation Library
- **Framer Motion**: Component-level animations
- **GSAP**: ScrollTrigger, complex scroll animations
- **CSS Keyframes**: Persistent background animations
- **Intersection Observer**: Lazy animation triggers

### 2.3 Animation Types
```
1. Lazy Load Animations
   - Fade + Slide (elements enter viewport)
   - Stagger effect (multiple elements)

2. Scroll-Trigger Animations
   - Parallax effects
   - Progress indicators
   - Reveal on scroll

3. Interactive Animations
   - Button hover states
   - Card elevations
   - Micro-interactions

4. Page Transitions
   - Fade + Slide entrance
   - Smooth exit transitions
```

---

## 3. COMPONENT STRUCTURE

### 3.1 New Directory Structure
```
src/
├── components/
│   ├── ui/
│   │   ├── Homepage/
│   │   │   ├── Hero/
│   │   │   │   ├── HeroSection.tsx (NEW - refactored)
│   │   │   │   ├── HeroContent.tsx (Title, subtitle, CTA)
│   │   │   │   └── HeroSlideshow.tsx (New professional slideshow)
│   │   │   ├── Hero Highlights/
│   │   │   │   ├── HighlightsSection.tsx
│   │   │   │   └── HighlightCard.tsx
│   │   │   ├── Sections/
│   │   │   │   ├── WhatWeDo.tsx
│   │   │   │   ├── Events.tsx
│   │   │   │   ├── Leadership.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   ├── OnlineGiving.tsx
│   │   │   │   └── JoinUs.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx (NEW - Professional header)
│   │   │   ├── Navigation.tsx (Responsive nav)
│   │   │   ├── Footer.tsx (Professional)
│   │   │   └── SkipLink.tsx
│   │   ├── Loader/
│   │   │   ├── Loader.tsx (Fixed video loading)
│   │   │   └── LoaderStyles.scss
│   │   ├── Cards/
│   │   │   ├── BaseCard.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   └── LeadershipCard.tsx
│   │   ├── Buttons/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   └── ButtonGroup.tsx
│   │   ├── Forms/
│   │   │   ├── FormInput.tsx
│   │   │   ├── FormSelect.tsx
│   │   │   └── FormSubmitButton.tsx
│   │   └── Effects/
│   │       ├── GradientBg.tsx
│   │       ├── AnimatedBg.tsx
│   │       └── ParallaxSection.tsx
│   ├── styles/
│   │   ├── _variables.scss (NEW - Design tokens)
│   │   ├── _animations.scss (Enhanced animations)
│   │   ├── _components.scss (Component styles)
│   │   ├── _utilities.scss (Utility classes)
│   │   ├── _responsive.scss (Media queries)
│   │   └── globals.scss (Main entry)
│   └── hooks/
│       ├── useScrollAnimation.ts
│       ├── useMediaQuery.ts
│       ├── useInView.ts
│       └── useWindowSize.ts
```

### 3.2 Component Responsibilities

**HeroSection**: Clean, professional hero with:
- Optimized video/image background
- Clear typography hierarchy
- Call-to-action buttons
- Responsive design
- Smooth animations

**Cards**: Reusable card component with:
- Consistent spacing
- Hover animations
- Professional shadows
- Flexible content slots

**Layout Components**: Header, Footer, Navigation with:
- Sticky navigation
- Mobile hamburger menu
- Professional styling
- Quick links

---

## 4. ROUTE REBUILD PLAN

### 4.1 Home Page (/)
```
1. Loader (Fixed)
2. Header/Navigation
3. Hero Section
   - Background video/image
   - Main title
   - Subtitle
   - CTA buttons
   - Scroll indicator
4. Hero Highlights (3-4 cards)
   - What we believe
   - Key values
   - Quick links
5. What We Do Section
6. Events Showcase (3-4 featured)
7. Leadership Section
   - Senior Pastor
   - Associate Pastors (if applicable)
8. Testimonials (Carousel/Grid)
9. Online Giving CTA
10. Join Us CTA
11. Footer
```

### 4.2 About Page (/about)
```
1. Header/Navigation
2. Hero Section (Subtitled "About Us")
3. Church History Timeline
4. Mission & Vision Cards
5. Core Values Grid
6. Leadership Section (Extended)
7. Church Statistics
8. Community Impact
9. Footer
```

### 4.3 Leadership Page (/leadership)
```
1. Header/Navigation
2. Hero Section (Subtitled "Our Leaders")
3. Leadership Grid/Cards
   - Senior Pastor
   - Associate Pastors
   - Board Members
4. Each card includes:
   - Professional image
   - Name + Title
   - Bio
   - Contact info (if applicable)
5. Footer
```

### 4.4 Testimonies Page (/testimonies)
```
1. Header/Navigation
2. Hero Section (Subtitled "Testimonies")
3. Testimonial Grid
   - Name + Role
   - Quote
   - Avatar
   - Read More link
4. Testimonial Detail Modal
5. Submit Testimonial Form
6. Footer
```

### 4.5 Events Pages (/events, /events/weekly, /events/upcoming, /events/special)
```
1. Header/Navigation
2. Hero Section (Subtitled "Events")
3. Event Filter Tabs
4. Event Card Grid
   - Image
   - Title
   - Date/Time
   - Location
   - CTA (Register/Learn More)
5. Event Detail Page
6. Event Registration Form
7. Footer
```

### 4.6 Resources Page (/resources, /resources/blogs, /resources/sermons, /resources/publications, /resources/store)
```
1. Header/Navigation
2. Hero Section
3. Resource Type Tabs/Navigation
4. Resource Card Grid
5. Resource Detail View
6. Related Resources
7. Footer
```

### 4.7 Other Pages
- Contact (/contact)
- Ministries (/ministries with sub-routes)
- Pastoral (/pastoral)
- Checkout (/checkout)
- Order Confirmation (/order-confirmation)
- Terms (/terms)
- Cookies (/cookies)

---

## 5. RESPONSIVE DESIGN BREAKPOINTS

```
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px+

Key Changes:
- Mobile: Single column, larger touch targets
- Tablet: 2 columns, optimized spacing
- Desktop: 3+ columns, full featured layout
```

---

## 6. PERFORMANCE OPTIMIZATIONS

### 6.1 Image Optimization
- Use Next.js Image component
- Implement lazy loading
- WebP with fallbacks
- Responsive images (srcSet)
- Optimized dimensions

### 6.2 Video Optimization
- Stream video in chunks
- Multiple format support (mp4, webm)
- Preload="metadata" (not auto)
- Poster image
- Fallback static image

### 6.3 Bundle Optimization
- Code splitting per route
- Dynamic imports for heavy components
- Tree-shaking enabled
- Asset compression

### 6.4 Loading Strategy
- Loader with proper video handling
- Incremental page load
- Skeleton screens (optional)
- Intersection Observer for lazy animations

---

## 7. ACCESSIBILITY (WCAG 2.1 AA)

### 7.1 Requirements
- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast ratio ≥ 4.5:1
- Alt text for all images
- Semantic HTML
- Skip links
- Form labels

### 7.2 Animation Considerations
- Respect prefers-reduced-motion
- Disable animations for users who prefer reduced motion
- No auto-playing animations on entrance

---

## 8. STYLING ARCHITECTURE

### 8.1 SCSS Organization
```
_variables.scss
  - Design tokens (colors, spacing, fonts)
  
_animations.scss
  - Keyframes
  - Animation definitions
  - Transition utilities
  
_components.scss
  - Component-specific styles
  - BEM methodology
  
_utilities.scss
  - Helper classes
  - Display utilities
  - Spacing utilities
  
_responsive.scss
  - Breakpoint mixins
  - Responsive utilities
```

### 8.2 Naming Conventions
```
BEM Methodology:
.block
.block__element
.block--modifier

Examples:
.hero
.hero__content
.hero__title
.hero--dark
.hero--with-video
```

---

## 9. IMPLEMENTATION PRIORITY

### Phase 1: Foundation (Week 1)
- [x] Design system tokens (SCSS)
- [x] Animation system (SCSS keyframes)
- [x] Base components (Button, Card, Input)
- [x] Layout structure (Header, Footer)
- [x] Loader component (Fix video)

### Phase 2: Pages (Week 2)
- [ ] Home page rebuild
- [ ] About page
- [ ] Leadership page
- [ ] Testimonies page

### Phase 3: Features (Week 3)
- [ ] Events pages
- [ ] Resources pages
- [ ] Contact page
- [ ] Forms integration

### Phase 4: Polish (Week 4)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Deployment prep

---

## 10. TECHNICAL REQUIREMENTS

### 10.1 Dependencies
```
Already in use (Keep):
- Next.js 16+
- React 19+
- Tailwind CSS
- Framer Motion
- GSAP
- TypeScript

Recommended additions:
- Radix UI (for headless components)
- React Hook Form (form management)
- Zod (validation)
- clsx/classnames (className management)
```

### 10.2 Build & Deploy
```
Build: npm run build
Dev: npm run dev
Lint: npm run lint
Type check: npm run type-check
Docker: docker-compose up
```

---

## 11. SUCCESS CRITERIA

✅ **Professional Appearance**
- Modern, clean design
- Consistent visual hierarchy
- Professional animations
- No oversized fonts

✅ **Responsive Design**
- Mobile: 100% functional
- Tablet: Optimized layout
- Desktop: Full featured
- Touch-friendly (48px+ targets)

✅ **Performance**
- Loader displays within 1s
- First Contentful Paint < 2s
- Lighthouse score > 85

✅ **Accessibility**
- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader compatible
- Color contrast adequate

✅ **Animation Quality**
- Smooth 60fps animations
- Professional transitions
- Micro-interactions
- Respects user preferences

---

## 12. MONITORING & MAINTENANCE

- Performance monitoring (Vercel Analytics)
- Error tracking (Sentry)
- User analytics (Google Analytics)
- Accessibility audits
- Cross-browser testing
- Mobile device testing

---

## File Changes Summary

### New Files to Create
- `/src/styles/_variables.scss`
- `/src/styles/_animations.scss`
- `/src/components/ui/Layout/Header.tsx`
- `/src/components/ui/Layout/Footer.tsx`
- `/src/components/ui/Loader/LoaderStyles.scss`
- `/src/components/ui/Cards/BaseCard.tsx`
- And more components per phase...

### Files to Refactor
- `/src/app/page.tsx` (Home)
- `/src/app/about/page.tsx`
- `/src/app/leadership/page.tsx`
- `/src/components/ui/Loader.tsx`
- All SCSS files (reorganization)

### Files to Keep (with updates)
- `/src/lib/` (utilities)
- `/src/components/contexts/` (context)
- `/package.json` (dependencies)
- `tailwind.config.ts` (theme)

---

## Notes

- Maintain existing color scheme: #F7DE12 (primary), #000000 (background)
- All animations should be professional and subtle
- Typography should be readable and appropriately sized
- Keep religious/spiritual aesthetic while modernizing
- Ensure all routes are covered in the rebuild
- Test extensively on real devices
