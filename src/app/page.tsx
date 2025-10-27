'use client';
// import Header from "@/components/layout/header";
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/ui/Homepage/Herosection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex-1">
        {/* <Header /> */}
        {/* HeroSection will start right after header */}
        <HeroSection />

        {/* Add your other sections below */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center">Next Section</h2>
            {/* Your content here */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
