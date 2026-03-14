// packages/editor/src/components/sync-connection-modal/use-retry-countdown.js
import { useState, useEffect, useRef } from "@wordpress/element";
var MIN_RETRYING_DISPLAY_MS = 600;
function useRetryCountdown(retryInMs, status) {
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryAtRef = useRef(null);
  const markRetrying = () => setIsRetrying(true);
  useEffect(() => {
    if (!isRetrying) {
      return;
    }
    const id = setTimeout(
      () => setIsRetrying(false),
      MIN_RETRYING_DISPLAY_MS
    );
    return () => clearTimeout(id);
  }, [isRetrying]);
  useEffect(() => {
    if (status === "connected") {
      setSecondsRemaining(null);
      retryAtRef.current = null;
      return;
    }
    if (status !== "disconnected" || !retryInMs) {
      return;
    }
    const retryAt = Date.now() + retryInMs;
    retryAtRef.current = retryAt;
    setSecondsRemaining(Math.ceil(retryInMs / 1e3));
    const intervalId = setInterval(() => {
      const remaining = Math.ceil(
        (retryAtRef.current - Date.now()) / 1e3
      );
      setSecondsRemaining(Math.max(0, remaining));
      if (remaining <= 0) {
        clearInterval(intervalId);
        setIsRetrying(true);
      }
    }, 1e3);
    return () => clearInterval(intervalId);
  }, [retryInMs, status]);
  const displaySeconds = isRetrying ? 0 : secondsRemaining;
  return { secondsRemaining: displaySeconds, markRetrying };
}
export {
  useRetryCountdown
};
//# sourceMappingURL=use-retry-countdown.mjs.map
