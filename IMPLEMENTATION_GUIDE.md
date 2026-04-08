# Implementation Guide: Adding Backend Hooks to Components

## Pattern Used (Production-Ready Template)

### Step 1: Create Hook (e.g., `useLeadership.ts`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import type { LeadershipMember } from '@/lib/types'; // Use API type
import { fallbackData } from '@/lib/data'; // Fallback only

interface UseDataState {
  data: LeadershipMember[];
  isLoading: boolean;
  error: string | null;
}

export function useLeadership() {
  const [state, setState] = useState<UseDataState>({
    data: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.listLeadership();
        setState({
          data: result?.length > 0 ? result : fallbackData,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: fallbackData, // Graceful fallback
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load data',
        });
      }
    };

    fetchData();
  }, []);

  return state;
}
```

### Step 2: Update Component

```typescript
'use client';

import { useLeadership } from '@/hooks/useLeadership';

export default function MyComponent() {
  const { data, isLoading, error } = useLeadership();

  if (isLoading) return <div>Loading...</div>;
  if (error) console.warn('API Error:', error);

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Existing Implementations

### useHeroContent ✅ (Located: `/src/hooks/useHeroContent.ts`)

- Combines events + reels
- Returns `HeroSlide[]` format
- Used in: `HeroMain.tsx`

### useTestimonials (Template in `/src/hooks/useTestimonials.ts`)

- Fetches approved testimonials
- Used in: `Testimonials.tsx` (partial, already has inline fetch)

### useLeadership ✅ (Located: `/src/hooks/useLeadership.ts`)

- Fetches leadership members
- Used in: `AssociatePastors.tsx`

## For Missing Endpoints

If API endpoint doesn't exist yet, the hook provides a clear place to add it:

```typescript
// Future when API is ready:
const result = await apiClient.listProducts(); // Add to api.ts

// Or query directly:
const response = await fetch(`${API_V1_BASE_URL}/products`);
```

## Property Mapping Examples

### Leadership (API → Component)

```typescript
// API returns:
{ id: '1', firstName: 'John', lastName: 'Doe', imageUrl: '...', role: 'pastor', bio: 'Bio text' }

// Component needs:
{ name: 'John Doe', image: '...', role: 'pastor', description: 'Bio text' }

// Solution: Map in component or create adapter:
const displayName = `${item.firstName} ${item.lastName}`;
const displayImage = item.imageUrl;
const displayBio = item.bio;
```

### Events (API → HeroSlide)

Already handled in `useHeroContent.ts`. Shows complete mapping:

```typescript
const eventSlide: HeroSlide = {
  title: event.title,
  subtitle: event.description,
  image: { src: event.imageUrl || event.bannerUrl, alt: event.title },
  upcoming: {
    label: 'Upcoming',
    title: event.title,
    date: new Date(event.startAt).toLocaleDateString(),
    time: event.startAt ? new Date(event.startAt).toLocaleTimeString() : '',
    location: event.location,
    ctaLabel: 'Register',
    ctaTarget: event.registerLink || '#register',
  },
};
```

## Testing Backend Integration

### Local Testing

```bash
# Point to local backend
export NEXT_PUBLIC_API_URL=http://localhost:8080
npm run dev
```

### Test Checklist

- [ ] Hook fetches data without errors
- [ ] Fallback data displays if API fails
- [ ] No console warnings
- [ ] Properties map correctly to UI
- [ ] Images display properly
- [ ] Button links work (CTAs point to correct URLs)

## API Methods Signature Reference

From `/src/lib/api.ts`:

```typescript
// Events (with reels for hero)
async listEvents(filter?: {type?: string}): Promise<EventPublic[]>
async listReels(): Promise<ReelPublic[]>

// Leadership
async listLeadership(role?: LeadershipRole): Promise<LeadershipMember[]>

// Testimonials
async listApprovedTestimonials(): Promise<Testimonial[]>
async submitTestimonial(data: CreateTestimonialRequest): Promise<Testimonial>

// Forms
async listForms(type?: string): Promise<PublicFormPayload[]>
async submitForm(slug: string, submission: PublicFormSubmissionRequest): Promise<any>
```

## Common Pitfalls & Solutions

### ❌ Problem: Component breaks when API fails

✅ Solution: Always provide fallback data in hook

### ❌ Problem: Image URLs don't work (404s)

✅ Solution: Verify API returns full URLs, not relative paths

```typescript
// Check in browser Network tab what API returns
// If returns just filename: `logo.png`
// Construct full URL in hook: `${API_ORIGIN}/images/${item.imageUrl}`
```

### ❌ Problem: Type errors between API and Component

✅ Solution: Use `any` type or create adapter interface

```typescript
type LeadershipMember = ApiLeadershipMember | any;
// This allows flexibility while maintaining types where possible
```

### ❌ Problem: Memory leak - useEffect not cleaning up

✅ Solution: Used in all hooks - cleanup function returns when unmounted

```typescript
useEffect(() => {
  let mounted = true;

  const fetch = async () => {
    const data = await api();
    if (mounted) setState(data); // Only update if still mounted
  };

  fetch();
  return () => {
    mounted = false;
  }; // Cleanup
}, []);
```

## Summary

All components follow the same pattern:

1. Create hook that fetches from API
2. Import hook in component
3. Use destructured state (data, isLoading, error)
4. Provide UI for loading/error states
5. Render data with property mapping if needed

This ensures **consistency**, **maintainability**, and **reliability** across the entire application.
