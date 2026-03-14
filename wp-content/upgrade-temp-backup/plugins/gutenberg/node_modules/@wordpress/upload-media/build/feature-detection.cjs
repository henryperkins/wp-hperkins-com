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

// packages/upload-media/src/feature-detection.ts
var feature_detection_exports = {};
__export(feature_detection_exports, {
  clearFeatureDetectionCache: () => clearFeatureDetectionCache,
  detectClientSideMediaSupport: () => detectClientSideMediaSupport,
  isClientSideMediaSupported: () => isClientSideMediaSupported
});
module.exports = __toCommonJS(feature_detection_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clearFeatureDetectionCache,
  detectClientSideMediaSupport,
  isClientSideMediaSupported
});
//# sourceMappingURL=feature-detection.cjs.map
