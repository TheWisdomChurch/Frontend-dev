import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../icons/logo';

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" /> {/* You can adjust size here */}
            <span className="text-2xl font-bold font-headline">
              Wisdom House
            </span>
          </Link>
          <p className="max-w-md mx-auto mt-4 text-muted-foreground">
            A community transformed by grace, living for a greater purpose.
          </p>
          <div className="flex justify-center mt-6 space-x-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">YouTube</span>
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <hr className="my-6 border-border" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Wisdom House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
