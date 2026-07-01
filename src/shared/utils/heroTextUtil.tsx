import { BaseText } from '../text';
import type { ReactNode } from 'react';

export const renderTitle = (title: string | undefined | null): ReactNode => {
  const safeTitle = title ?? '';

  const highlight = (text: string) => (
    <BaseText
      fontFamily="playfair"
      className="hero-text-highlight inline-block italic"
    >
      {text}
    </BaseText>
  );

  if (safeTitle.includes('Wisdom Church')) {
    const parts = safeTitle.split('Wisdom Church');
    return (
      <>
        {parts[0]}
        {highlight('Wisdom')} Church{parts[1]}
      </>
    );
  }

  if (safeTitle.includes('Vibrant Community')) {
    const parts = safeTitle.split('Vibrant Community');
    return (
      <>
        {parts[0]}
        {highlight('Vibrant Community')}
        {parts[1]}
      </>
    );
  }

  if (safeTitle.includes('Lasting Relationships')) {
    const parts = safeTitle.split('Lasting Relationships');
    return (
      <>
        {parts[0]}
        {highlight('Lasting Relationships')}
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

  const whitePlayfair = (text: string) => (
    <BaseText
      fontFamily="playfair"
      className="hero-text-white-inherit inline-block italic"
    >
      {text}
    </BaseText>
  );

  if (safeSubtitle.includes("God's Transforming Power")) {
    const parts = safeSubtitle.split("God's Transforming Power");
    return (
      <>
        {parts[0]}
        {whitePlayfair("God's")} Transforming Power{parts[1]}
      </>
    );
  }

  if (safeSubtitle.includes('Spiritual Journey')) {
    const parts = safeSubtitle.split('Spiritual Journey');
    return (
      <>
        {parts[0]}
        {whitePlayfair('Spiritual Journey')}
        {parts[1]}
      </>
    );
  }

  if (safeSubtitle.includes('Connect With Believers')) {
    return whitePlayfair('Connect With Believers');
  }

  return safeSubtitle;
};
