'use client';

import { useEffect, useRef, useState } from 'react';
import Loader from '@/shared/ui/Loader';
import {
  getPendingApiRequests,
  subscribeToApiPending,
} from '@/lib/apiActivity';

const STARTUP_SETTLE_MS = 280;
const STARTUP_MIN_VISIBLE_MS = 1800;
const STARTUP_FAILSAFE_MS = 12000;

export default function AppStartupLoader() {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [startupComplete, setStartupComplete] = useState(false);
  const mountedAtRef = useRef<number>(0);

  useEffect(() => {
    mountedAtRef.current =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
  }, []);

  useEffect(() => {
    setPendingRequests(getPendingApiRequests());
    const unsubscribe = subscribeToApiPending(setPendingRequests);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (startupComplete) return;
    if (pendingRequests > 0) return;

    const now =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = mountedAtRef.current ? now - mountedAtRef.current : 0;
    const remainingMinVisible = Math.max(STARTUP_MIN_VISIBLE_MS - elapsed, 0);

    const settleTimer = window.setTimeout(
      () => {
        setStartupComplete(true);
      },
      Math.max(STARTUP_SETTLE_MS, remainingMinVisible)
    );

    return () => window.clearTimeout(settleTimer);
  }, [pendingRequests, startupComplete]);

  useEffect(() => {
    if (startupComplete) return;
    const failSafe = window.setTimeout(() => {
      setStartupComplete(true);
    }, STARTUP_FAILSAFE_MS);

    return () => window.clearTimeout(failSafe);
  }, [startupComplete]);

  if (startupComplete) return null;

  return <Loader />;
}
