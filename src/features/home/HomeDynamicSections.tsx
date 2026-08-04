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
const Conversations = nextDynamic(() => import('@/features/Conversations'), {
  ssr: true,
  loading: Fallback,
});
const Workforce = nextDynamic(() => import('@/features/events/JoinUs'), {
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
      <div id="testimonies" className="home-section scroll-mt-24">
        <Testimonies />
      </div>
      <div id="events" className="home-section">
        <Events />
      </div>
      <div id="giving" className="home-section scroll-mt-24">
        <Giving />
      </div>
      <div id="conversations" className="home-section scroll-mt-24">
        <Conversations />
      </div>
      <div id="sermons" className="home-section">
        <Sermons />
      </div>
      <div id="join" className="home-section scroll-mt-24">
        <Workforce />
      </div>
    </>
  );
}
