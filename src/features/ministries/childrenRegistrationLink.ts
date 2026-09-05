/**
 * Public link for the children's-ministry registration form.
 *
 * The form itself is built in the admin form builder (the "Children Intake"
 * preset) and published at `/forms/register-child`. Override with
 * `NEXT_PUBLIC_CHILDREN_FORM_URL` if it is published under a different slug or
 * on another host. Mirrors the `NEXT_PUBLIC_TESTIMONIAL_FORM_URL` pattern used
 * by the testimonies page.
 */
const CHILDREN_FORM_BASE =
  process.env.NEXT_PUBLIC_CHILDREN_FORM_URL || '/forms/register-child';

/**
 * The backend form slug, parsed out of `CHILDREN_FORM_BASE` (works whether
 * that base is this app's own relative path or an absolute URL on another
 * host, e.g. the admin app). Used to drive the in-page registration modal so
 * it loads and submits the exact same form as the link above — one form
 * definition in the admin form builder, three surfaces (this page's modal,
 * this app's own `/forms/register-child` page, and the external link),
 * all hitting the same `/forms/register-child/submissions` endpoint.
 */
export const CHILDREN_FORM_SLUG = (() => {
  const path = CHILDREN_FORM_BASE.split('?')[0];
  const segments = path.split('/').filter(Boolean);
  return segments[segments.length - 1] || 'register-child';
})();

function withReturn(base: string): string {
  const returnTo = '/ministries/children';
  try {
    // Absolute URL (custom host).
    const url = new URL(base);
    url.searchParams.set('return_to', returnTo);
    return url.toString();
  } catch {
    // Relative path.
    const [path, query = ''] = base.split('?');
    const params = new URLSearchParams(query);
    params.set('return_to', returnTo);
    return `${path}?${params.toString()}`;
  }
}

export const CHILDREN_REGISTRATION_URL = withReturn(CHILDREN_FORM_BASE);
