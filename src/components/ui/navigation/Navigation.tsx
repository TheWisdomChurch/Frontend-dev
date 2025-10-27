'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Ministries', href: '/ministries' },
    { name: 'Events', href: '/events' },
    { name: 'Give', href: '/give' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#001910] shadow-lg py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 z-50">
              <div className="w-10 h-10 bg-[#8bea19] rounded-full flex items-center justify-center">
                <span className="text-[#001910] font-bold text-lg">W</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                Wisdom House
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-[#8bea19] transition-colors duration-300 font-medium relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8bea19] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:block">
              <button className="bg-[#8bea19] text-[#001910] px-6 py-2 rounded-lg font-semibold hover:bg-[#7ad017] transform hover:scale-105 transition-all duration-300 shadow-lg">
                Visit Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 z-50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-2.5' : ''
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`w-full h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? '-rotate-45 -translate-y-2.5' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-[#001910] shadow-2xl transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20 h-full flex flex-col">
            {/* Close Button */}
            <button
              className="text-white p-2 absolute top-6 right-6"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <div className="w-6 h-6">
                <span className="w-full h-0.5 bg-white block rotate-45 translate-y-0.5"></span>
                <span className="w-full h-0.5 bg-white block -rotate-45 -translate-y-0.5"></span>
              </div>
            </button>

            {/* Mobile Navigation Items */}
            <div className="space-y-6 flex-1">
              {navItems.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-white text-xl hover:text-[#8bea19] transition-colors duration-300 py-3 border-b border-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile CTA Button */}
            <div className="pt-6 border-t border-white/10">
              <button className="w-full bg-[#8bea19] text-[#001910] px-6 py-4 rounded-lg font-semibold hover:bg-[#7ad017] transition-all duration-300 text-lg">
                Visit Us This Sunday
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
