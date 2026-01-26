// app/cookies/page.tsx

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 md:py-16 lg:py-20">
      <section className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-black">Cookies & Privacy</h1>
        <p className="text-gray-200">
          We use only essential cookies to keep the site running and to remember basic preferences.
          No advertising trackers are used.
        </p>
        <div className="space-y-4 text-gray-200">
          <div>
            <h2 className="text-xl font-bold text-white">What we store</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Session info for forms and cart actions.</li>
              <li>Light/dark mode preference when selected.</li>
              <li>Basic analytics (aggregated, non-identifying).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Data handling</h2>
            <p>
              Submitted forms (events, testimonies, contact) are used only to respond to your request
              and are not sold or shared with advertisers.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your choices</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>You can clear cookies in your browser at any time.</li>
              <li>You may request deletion of your submitted data via the Contact page.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Contact</h2>
            <p>
              Questions about cookies or privacy? Reach us through the Contact page or at the church office.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
