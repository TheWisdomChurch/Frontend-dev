import nextDynamic from 'next/dynamic';

const Fallback = () => (
  <div
    className="min-h-[420px] w-full animate-pulse bg-[var(--app-canvas-2)]"
    aria-hidden="true"
  />
);
const Events = nextDynamic(() => import('@/features/events/EventsShowcase'), {
  ssr: true,
  loading: Fallback,
});
const Sermons = nextDynamic(() => import('@/features/resources/Resource'), {
  ssr: true,
  loading: Fallback,
});
const Testimonies = nextDynamic(
  () => import('@/features/testimonials/HomeTestimonials'),
  { ssr: true, loading: Fallback }
);
const Giving = nextDynamic(() => import('@/features/events/OnlineGiving'), {
  ssr: true,
  loading: Fallback,
});

export default function HomeDynamicSections() {
  return (
    <>
      <div id="events" className="home-section">
        <Events />
      </div>
      <div id="sermons" className="home-section">
        <Sermons />
      </div>
      <div id="testimonies" className="home-section">
        <Testimonies />
      </div>
      <div id="giving" className="home-section">
        <Giving />
      </div>
    </>
  );
}
