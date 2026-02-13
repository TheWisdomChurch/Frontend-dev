const API_PENDING_EVENT = 'wc:api-pending';

type WindowWithApiState = Window &
  typeof globalThis & {
    __WC_API_PENDING__?: number;
  };

const getBrowserWindow = (): WindowWithApiState | null => {
  if (typeof window === 'undefined') return null;
  return window as WindowWithApiState;
};

const emitPendingChange = (pending: number) => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow) return;

  browserWindow.dispatchEvent(
    new CustomEvent<number>(API_PENDING_EVENT, { detail: pending })
  );
};

export const getPendingApiRequests = (): number => {
  const browserWindow = getBrowserWindow();
  return browserWindow?.__WC_API_PENDING__ ?? 0;
};

export const trackApiRequestStart = () => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow) return;

  const nextCount = (browserWindow.__WC_API_PENDING__ ?? 0) + 1;
  browserWindow.__WC_API_PENDING__ = nextCount;
  emitPendingChange(nextCount);
};

export const trackApiRequestEnd = () => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow) return;

  const nextCount = Math.max(0, (browserWindow.__WC_API_PENDING__ ?? 0) - 1);
  browserWindow.__WC_API_PENDING__ = nextCount;
  emitPendingChange(nextCount);
};

export const subscribeToApiPending = (
  listener: (pending: number) => void
) => {
  const browserWindow = getBrowserWindow();
  if (!browserWindow) return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<number>;
    const pending =
      typeof customEvent.detail === 'number'
        ? customEvent.detail
        : getPendingApiRequests();
    listener(pending);
  };

  browserWindow.addEventListener(API_PENDING_EVENT, handler as EventListener);
  listener(getPendingApiRequests());

  return () => {
    browserWindow.removeEventListener(
      API_PENDING_EVENT,
      handler as EventListener
    );
  };
};

