// app/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 md:py-16 lg:py-20">
      <section className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-black">Terms of Use</h1>
        <p className="text-gray-200">
          Welcome to The Wisdom House Church online experience. By accessing or using our website,
          livestreams, forms, store, or other services, you agree to these Terms of Use.
        </p>
        <div className="space-y-4 text-gray-200">
          <div>
            <h2 className="text-xl font-bold text-white">1. Use of Content</h2>
            <p>
              All media, text, graphics, and materials are provided for personal, non-commercial use.
              Do not redistribute or modify without permission.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">2. Privacy & Data</h2>
            <p>
              We collect minimal information needed for events, store orders, and contact requests.
              See our Cookies & Privacy page for details on how we handle data.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">3. Conduct</h2>
            <p>
              Use the site respectfully. Do not post or transmit harmful, offensive, or unlawful material.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">4. Links & Third Parties</h2>
            <p>
              External links are provided for convenience. We are not responsible for third-party content or practices.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">5. Changes</h2>
            <p>
              Terms may change to reflect updates in our services. Continued use after changes means acceptance.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">6. Contact</h2>
            <p>
              For questions about these terms, contact us via the Contact page or at our church office.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
