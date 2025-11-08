import { ChevronDown, X } from 'lucide-react';
import Button from '../utils/CustomButton';
import { bricolageGrotesque } from '../fonts/fonts';
import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import Image from 'next/image';

export default function JoinCommunityModal({
  isOpen,
  onClose,
  colorScheme,
}: {
  isOpen: boolean;
  onClose: () => void;
  colorScheme: any;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-300"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all duration-300 scale-95 animate-in fade-in-0 zoom-in-95"
        style={{
          backgroundColor: colorScheme.background,
          border: `2px solid ${colorScheme.primary}40`,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="relative w-full">
          <div className="absolute -top-3 -right-3 z-50">
            {/* ✅ Moved outside main container for better placement */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="z-[100] rounded-full p-3 transform hover:scale-110 transition-all duration-200 shadow-lg flex items-center justify-center"
              curvature="full"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: `2px solid ${colorScheme.primary}`,
                color: colorScheme.primary,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <X className="w-5 h-5" strokeWidth={2} />{' '}
              {/* ✅ Properly centered, sharp icon */}
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 overflow-hidden"
              style={{
                backgroundColor: `${colorScheme.primary}20`,
                borderColor: colorScheme.primary,
              }}
            >
              <Image
                src={WisdomeHouseLogo}
                alt="The Wisdom House Church Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
            </div>

            <h2
              className={`${bricolageGrotesque.className} text-3xl font-black mb-4 tracking-tight`}
              style={{ color: colorScheme.text }}
            >
              Join Our Community
            </h2>

            <p
              className="text-lg opacity-90 leading-relaxed"
              style={{ color: colorScheme.text }}
            >
              Connect with us across different platforms and grow together in
              faith
            </p>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            {communityLinks.map((link, index) => {
              const Icon = link.icon; // ✅ use component reference
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
          flex items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 
          bg-gradient-to-r ${link.bgColor} ${link.hoverColor} text-white shadow-lg hover:shadow-xl
        `}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4">
                    <Icon className="w-6 h-6 text-white" />{' '}
                    {/* ✅ render dynamic icon */}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{link.title}</h3>
                    <p className="text-white/90 text-sm">{link.description}</p>
                  </div>

                  <ChevronDown className="w-5 h-5 transform -rotate-90 opacity-80" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="text-center mt-6 pt-6 border-t"
            style={{ borderColor: `${colorScheme.primary}20` }}
          >
            <p
              className="text-sm opacity-80"
              style={{ color: colorScheme.text }}
            >
              We can't wait to connect with you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
