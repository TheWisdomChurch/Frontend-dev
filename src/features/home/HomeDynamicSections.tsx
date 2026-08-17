import nextDynamic from 'next/dynamic';

const Fallback = () => (
  <div
    className="min-h-[340px] w-full animate-pulse bg-[var(--app-canvas-2)] motion-reduce:animate-none sm:min-h-[420px]"
    aria-hidden="true"
  />
);
const Events = nextDynamic(() => import('@/features/events/EventsShowcase'), {
  ssr: true,
  loading: Fallback,
});
const NextSteps = nextDynamic(() => import('@/features/home/HomeNextSteps'), {
  ssr: true,
  loading: Fallback,
});
export default function HomeDynamicSections() {
  return (
    <>
      <div id="events" className="home-section">
        <Events />
      </div>
      <div className="home-section">
        <NextSteps />
      </div>
    </>
  );
}
