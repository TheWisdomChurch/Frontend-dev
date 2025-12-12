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
  title: string,
  colorScheme: ColorScheme | CustomColorScheme
): ReactNode => {
  // Use optional chaining and fallback values
  const primaryColor = colorScheme.primary || '#000000';
  const shadowColor = colorScheme.opacity?.primary40 || 'rgba(0,0,0,0.4)';

  if (title.includes('Wisdom House Church')) {
    const parts = title.split('Wisdom House Church');
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

  if (title.includes('Vibrant Community')) {
    const parts = title.split('Vibrant Community');
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

  if (title.includes('Lasting Relationships')) {
    const parts = title.split('Lasting Relationships');
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

  return title;
};

export const renderSubtitle = (subtitle: string): ReactNode => {
  if (subtitle.includes("God's Transforming Power")) {
    const parts = subtitle.split("God's Transforming Power");
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

  if (subtitle.includes('Spiritual Journey')) {
    const parts = subtitle.split('Spiritual Journey');
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

  if (subtitle.includes('Connect With Believers')) {
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

  return subtitle;
};
