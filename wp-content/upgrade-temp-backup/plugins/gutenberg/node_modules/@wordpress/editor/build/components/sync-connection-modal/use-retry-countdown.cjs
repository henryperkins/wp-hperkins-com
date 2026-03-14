"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/sync-connection-modal/use-retry-countdown.js
var use_retry_countdown_exports = {};
__export(use_retry_countdown_exports, {
  useRetryCountdown: () => useRetryCountdown
});
module.exports = __toCommonJS(use_retry_countdown_exports);
var import_element = require("@wordpress/element");
var MIN_RETRYING_DISPLAY_MS = 600;
function useRetryCountdown(retryInMs, status) {
  const [secondsRemaining, setSecondsRemaining] = (0, import_element.useState)(null);
  const [isRetrying, setIsRetrying] = (0, import_element.useState)(false);
  const retryAtRef = (0, import_element.useRef)(null);
  const markRetrying = () => setIsRetrying(true);
  (0, import_element.useEffect)(() => {
    if (!isRetrying) {
      return;
    }
    const id = setTimeout(
      () => setIsRetrying(false),
      MIN_RETRYING_DISPLAY_MS
    );
    return () => clearTimeout(id);
  }, [isRetrying]);
  (0, import_element.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useRetryCountdown
});
//# sourceMappingURL=use-retry-countdown.cjs.map
