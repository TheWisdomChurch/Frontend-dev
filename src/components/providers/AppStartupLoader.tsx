'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/ui/Loader';
import {
  getPendingApiRequests,
  subscribeToApiPending,
} from '@/lib/apiActivity';

const STARTUP_SETTLE_MS = 180;
const STARTUP_FAILSAFE_MS = 12000;

export default function AppStartupLoader() {
  const [pendingRequests, setPendingRequests] = useState(0);
  const [startupComplete, setStartupComplete] = useState(false);

  useEffect(() => {
    setPendingRequests(getPendingApiRequests());
    const unsubscribe = subscribeToApiPending(setPendingRequests);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (startupComplete) return;
    if (pendingRequests > 0) return;

    const settleTimer = window.setTimeout(() => {
      setStartupComplete(true);
    }, STARTUP_SETTLE_MS);

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

