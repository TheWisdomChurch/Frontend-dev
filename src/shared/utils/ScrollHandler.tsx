// components/utils/ScrollHandler.tsx
'use client';
import { useScrollToTopOnPageChange } from './hooks/useScroll';

export default function ScrollHandler() {
  useScrollToTopOnPageChange();
  return null;
}
