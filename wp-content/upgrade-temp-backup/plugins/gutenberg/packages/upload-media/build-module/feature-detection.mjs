// packages/upload-media/src/feature-detection.ts
var cachedResult = null;
function detectClientSideMediaSupport() {
  if (cachedResult !== null) {
    return cachedResult;
  }
  if (typeof WebAssembly === "undefined") {
    cachedResult = {
      supported: false,
      reason: "WebAssembly is not supported in this browser."
    };
    return cachedResult;
  }
  if (typeof SharedArrayBuffer === "undefined") {
    cachedResult = {
      supported: false,
      reason: "SharedArrayBuffer is not available. This may be due to missing cross-origin isolation headers."
    };
    return cachedResult;
  }
  if (typeof Worker === "undefined") {
    cachedResult = {
      supported: false,
      reason: "Web Workers are not supported in this browser."
    };
    return cachedResult;
  }
  if (typeof navigator !== "undefined" && "deviceMemory" in navigator && navigator.deviceMemory <= 2) {
    cachedResult = {
      supported: false,
      reason: "Device has insufficient memory for client-side media processing."
    };
    return cachedResult;
  }
  if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency < 4) {
    cachedResult = {
      supported: false,
      reason: "Device has insufficient CPU cores for client-side media processing."
    };
    return cachedResult;
  }
  if (typeof navigator !== "undefined") {
    const connection = navigator.connection;
    if (connection) {
      if (connection.saveData) {
        cachedResult = {
          supported: false,
          reason: "Data saver mode is enabled."
        };
        return cachedResult;
      }
      if (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g" || connection.effectiveType === "3g") {
        cachedResult = {
          supported: false,
          reason: "Network connection is too slow for client-side media processing."
        };
        return cachedResult;
      }
    }
  }
  if (typeof window !== "undefined") {
    try {
      const testBlob = new Blob([""], {
        type: "application/javascript"
      });
      const testUrl = URL.createObjectURL(testBlob);
      try {
        const testWorker = new Worker(testUrl);
        testWorker.terminate();
      } finally {
        URL.revokeObjectURL(testUrl);
      }
    } catch {
      cachedResult = {
        supported: false,
        reason: "The site's Content Security Policy (CSP) does not allow blob: workers. The worker-src directive must include blob: to enable client-side media processing."
      };
      return cachedResult;
    }
  }
  cachedResult = { supported: true };
  return cachedResult;
}
function isClientSideMediaSupported() {
  return detectClientSideMediaSupport().supported;
}
function clearFeatureDetectionCache() {
  cachedResult = null;
}
export {
  clearFeatureDetectionCache,
  detectClientSideMediaSupport,
  isClientSideMediaSupported
};
//# sourceMappingURL=feature-detection.mjs.map
