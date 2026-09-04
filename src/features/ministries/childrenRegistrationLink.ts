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
