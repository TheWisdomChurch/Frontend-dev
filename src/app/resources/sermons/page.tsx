'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import SermonUtil from '@/features/resources/Sermons';
import { AppDispatch } from '@/lib/store';
import { fetchSermons } from '@/lib/store/slices/sermonsSlice';

export default function SermonPage() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSermons());
  }, [dispatch]);

  return <SermonUtil />;
}
