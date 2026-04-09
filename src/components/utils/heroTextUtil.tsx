// utils/heroTextUtils.ts
import { BaseText } from '../text';
import type { ReactNode } from 'react';

// Import the actual ColorScheme type from your project
import { ColorScheme } from '../colors/colorScheme';
// import type { ColorScheme } from '../components/colors/colorScheme';

// Or if that doesn't work, define a more flexible type
interface CustomColorScheme {
  primary: string;
  opacity: {
    primary40?: string; // Make optional since it might not exist
    [key: string]: string | undefined; // Allow other opacity properties
  };
}

export const renderTitle = (
  title: string | undefined | null,
  colorScheme: ColorScheme | CustomColorScheme
): ReactNode => {
  const safeTitle = title ?? '';
  // Use optional chaining and fallback values
  const primaryColor = colorScheme.primary || '#000000';
  const shadowColor = colorScheme.opacity?.primary40 || 'rgba(0,0,0,0.4)';

  if (safeTitle.includes('Wisdom House Church')) {
    const parts = safeTitle.split('Wisdom House Church');
    return (
      <>
        {parts[0]}
        <BaseText
          fontFamily="playfair"
          className="italic inline-block"
          style={{
            color: primaryColor,
            fontSize: 'inherit',
            lineHeight: 'inherit',
            textShadow: `0 0 20px ${shadowColor}`,
          }}
        >
          Wisdom House
        </BaseText>{' '}
        Church{parts[1]}
      </>
    );
  }

  if (safeTitle.includes('Vibrant Community')) {
    const parts = safeTitle.split('Vibrant Community');
    return (
      <>
        {parts[0]}
        <BaseText
          fontFamily="playfair"
          className="italic inline-block"
          style={{
            color: primaryColor,
            fontSize: 'inherit',
            lineHeight: 'inherit',
            textShadow: `0 0 20px ${shadowColor}`,
          }}
        >
          Vibrant Community
        </BaseText>
        {parts[1]}
      </>
    );
  }

  if (safeTitle.includes('Lasting Relationships')) {
    const parts = safeTitle.split('Lasting Relationships');
    return (
      <>
        {parts[0]}
        <BaseText
          fontFamily="playfair"
          className="italic inline-block"
          style={{
            color: primaryColor,
            fontSize: 'inherit',
            lineHeight: 'inherit',
            textShadow: `0 0 20px ${shadowColor}`,
          }}
        >
          Lasting Relationships
        </BaseText>
        {parts[1]}
      </>
    );
  }

  return safeTitle;
};

export const renderSubtitle = (
  subtitle: string | undefined | null
): ReactNode => {
  const safeSubtitle = subtitle ?? '';
  if (safeSubtitle.includes("God's Transforming Power")) {
    const parts = safeSubtitle.split("God's Transforming Power");
    return (
      <>
        {parts[0]}
        <BaseText
          fontFamily="playfair"
          className="italic inline-block"
          style={{
            color: '#FFFFFF',
            fontSize: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          God's
        </BaseText>{' '}
        Transforming Power{parts[1]}
      </>
    );
  }

  if (safeSubtitle.includes('Spiritual Journey')) {
    const parts = safeSubtitle.split('Spiritual Journey');
    return (
      <>
        {parts[0]}
        <BaseText
          fontFamily="playfair"
          className="italic inline-block"
          style={{
            color: '#FFFFFF',
            fontSize: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          Spiritual Journey
        </BaseText>
        {parts[1]}
      </>
    );
  }

  if (safeSubtitle.includes('Connect With Believers')) {
    return (
      <BaseText
        fontFamily="playfair"
        className="italic inline-block"
        style={{
          color: '#FFFFFF',
          fontSize: 'inherit',
          lineHeight: 'inherit',
        }}
      >
        Connect With Believers
      </BaseText>
    );
  }

  return safeSubtitle;
};
