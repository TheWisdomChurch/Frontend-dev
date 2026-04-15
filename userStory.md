# User Stories - Backend-Driven Web App Readiness

## Story 1: Backend-Driven Homepage Ad Content

As an admin, I want to manage homepage advert content from the admin backend so that marketing updates can be deployed without frontend code changes.

### Acceptance Criteria

1. Homepage ad content is fetched from an API endpoint.
2. Frontend has a safe fallback advert payload if API is unavailable.
3. Frontend does not persist ad state in `localStorage` or `sessionStorage`.
4. The ad modal remains functional with backend content fields (`title`, `headline`, `description`, `image`, `ctaLabel`, `registerUrl`, `time`, `location`, `startAt`, `endAt`).

## Story 2: No Browser Storage Dependency

As a platform owner, I want the app to avoid `localStorage` and `sessionStorage` so that data handling is deterministic and aligned with backend/cookie-driven state.

### Acceptance Criteria

1. No runtime `localStorage` usage in `src/`.
2. No runtime `sessionStorage` usage in `src/`.
3. Consent, theme, and auth token handling use cookie or backend-compatible flow.
4. Temporary UI-only state uses in-memory runtime state only.

## Story 3: Consent & Tracking Compliance

As a compliance stakeholder, I want consent state to be cookie-driven so tracking can respect user choices consistently across pages.

### Acceptance Criteria

1. Consent banner reads and writes cookies for consent preferences.
2. Consent updates trigger app-wide event notifications.
3. Analytics initialization respects consent state before sending optional events.

## Story 4: Store Flow Backend Readiness

As a product owner, I want store order flow to be backend-ready so I can replace mocks with live endpoints without redesigning UI logic.

### Acceptance Criteria

1. Store client logic does not depend on browser storage.
2. Order creation/read methods use in-memory mock flow as temporary fallback.
3. Replacement path for backend endpoints is clearly defined in code comments (`TODO`).

## Story 5: Integration Readiness for Admin-Managed Content

As an engineering lead, I want a stable content contract so frontend components can consume admin-managed content reliably.

### Acceptance Criteria

1. Frontend types/interfaces exist for admin-provided content payloads.
2. Fallback values are defined for missing backend fields.
3. Fetch errors fail gracefully without breaking page rendering.

## API Contract Draft (Homepage Ad)

```json
{
  "id": "wpc-2026",
  "title": "Wisdom Power Conference 2026",
  "headline": "Have you registered for WPC 2026?",
  "description": "Join three days of worship...",
  "startAt": "2026-03-20T18:00:00Z",
  "endAt": "2026-03-22T20:00:00Z",
  "time": "Morning Session • Evening Session",
  "location": "Honor Gardens...",
  "image": "/HEADER.png",
  "registerUrl": "https://admin.wisdomchurchhq.org/forms/wpc26",
  "ctaLabel": "Register now",
  "note": "You will be returned..."
}
```

## Definition of Done

1. Runtime check confirms no `localStorage`/`sessionStorage` usage in application source.
2. Homepage advert content is backend-first with fallback.
3. Consent and theme persistence are cookie-based.
4. Lint passes for changed files.
5. Changes are documented and ready for endpoint integration.
