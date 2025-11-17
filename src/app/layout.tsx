// app/layout.tsx
import type { Metadata } from 'next';
import {
  bricolageGrotesque,
  worksans,
  playfair,
} from '@/components/fonts/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Wisdomhouse Church',
  description: 'Wisdom HouseHq - We Are Transformed',
};

// Client wrapper component that contains all client-side providers
function ClientLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-screen">{children}</div>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${worksans.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className={bricolageGrotesque.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
