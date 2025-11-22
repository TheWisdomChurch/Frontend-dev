/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modals/JoinCommunityModal.tsx
import { ChevronDown, X } from 'lucide-react';
import Button from '../utils/CustomButton';
import { communityLinks } from '@/lib/data';
import { WisdomeHouseLogo } from '../assets';
import Image from 'next/image';
import { useTheme } from '@/components/contexts/ThemeContext';
import { BaseText, BodySM, BodyMD, SemiBoldText } from '@/components/text';

export default function JoinCommunityModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { colorScheme } = useTheme();

  // Determine if we're in dark mode based on background color
  const isDarkMode = colorScheme.background === '#000000';

  // Theme-based styles
  const modalBackground = isDarkMode ? colorScheme.white : '#000000f0';
  const textColor = isDarkMode ? colorScheme.black : colorScheme.white;
  const secondaryTextColor = isDarkMode
    ? colorScheme.textSecondary
    : colorScheme.textTertiary;
  const borderColor = isDarkMode
    ? colorScheme.border
    : colorScheme.primary + '40';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative rounded-3xl w-full max-w-md mx-auto overflow-hidden border shadow-2xl"
        style={{
          backgroundColor: modalBackground,
          borderColor: borderColor,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="relative w-full">
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full p-2 transform hover:scale-110 transition-all duration-200"
              curvature="full"
              style={{
                backgroundColor: isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10,
                color: textColor,
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black20
                  : colorScheme.opacity.white20;
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? colorScheme.opacity.black10
                  : colorScheme.opacity.white10;
              }}
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 lg:p-8">
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

            <BaseText
              fontFamily="bricolage"
              weight="black"
              className="text-2xl lg:text-3xl mb-4 tracking-tight"
              style={{ color: textColor }}
              useThemeColor={false}
            >
              Join Our Community
            </BaseText>

            <BodyMD
              className="opacity-90 leading-relaxed"
              style={{ color: secondaryTextColor }}
              useThemeColor={false}
            >
              Connect with us across different platforms and grow together in
              faith
            </BodyMD>
          </div>

          {/* Community Links */}
          <div className="space-y-4">
            {communityLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-white shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${link.bgColor}, ${link.hoverColor})`,
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <SemiBoldText
                      className="text-lg mb-1"
                      useThemeColor={false}
                    >
                      {link.title}
                    </SemiBoldText>
                    <BodySM className="text-white/90" useThemeColor={false}>
                      {link.description}
                    </BodySM>
                  </div>

                  <ChevronDown className="w-5 h-5 transform -rotate-90 opacity-80" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="text-center mt-6 pt-6 border-t"
            style={{
              borderColor: isDarkMode
                ? colorScheme.borderLight
                : colorScheme.border,
            }}
          >
            <BodySM
              className="opacity-80"
              style={{ color: secondaryTextColor }}
              useThemeColor={false}
            >
              We can't wait to connect with you!
            </BodySM>
          </div>
        </div>
      </div>
    </div>
  );
}
