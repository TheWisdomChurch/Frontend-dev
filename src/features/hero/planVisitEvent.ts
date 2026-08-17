export const PLAN_VISIT_EVENT = 'wisdom-church:plan-visit';

export function requestPlanVisit(): void {
  window.dispatchEvent(new Event(PLAN_VISIT_EVENT));
}
