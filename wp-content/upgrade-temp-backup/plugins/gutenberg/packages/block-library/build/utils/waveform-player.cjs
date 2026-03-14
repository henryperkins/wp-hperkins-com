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

// packages/block-library/src/utils/waveform-player.js
var waveform_player_exports = {};
__export(waveform_player_exports, {
  WaveformPlayer: () => WaveformPlayer
});
module.exports = __toCommonJS(waveform_player_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_waveform_utils = require("./waveform-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WaveformPlayer({ src, title, artist, image, onEnded }) {
  const onEndedRef = (0, import_element.useRef)(onEnded);
  onEndedRef.current = onEnded;
  const ref = (0, import_compose.useRefEffect)(
    (element) => {
      if (!src) {
        return;
      }
      let cancelled = false;
      let playerDestroy;
      function init() {
        if (cancelled) {
          return;
        }
        const { destroy } = (0, import_waveform_utils.initWaveformPlayer)(element, {
          src,
          title,
          artist,
          image,
          onEnded: () => onEndedRef.current?.()
        });
        playerDestroy = destroy;
      }
      const timeoutId = setTimeout(init, 100);
      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
        playerDestroy?.();
      };
    },
    [src, title, artist, image]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref, className: "wp-block-playlist__waveform-player" });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WaveformPlayer
});
//# sourceMappingURL=waveform-player.cjs.map
