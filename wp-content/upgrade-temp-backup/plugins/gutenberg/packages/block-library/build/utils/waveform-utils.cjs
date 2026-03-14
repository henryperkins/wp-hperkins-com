"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/utils/waveform-utils.js
var waveform_utils_exports = {};
__export(waveform_utils_exports, {
  createWaveformContainer: () => createWaveformContainer,
  getWaveformColors: () => getWaveformColors,
  initWaveformPlayer: () => initWaveformPlayer,
  logPlayError: () => logPlayError,
  setupPlayButtonAccessibility: () => setupPlayButtonAccessibility,
  styleSvgIcons: () => styleSvgIcons
});
module.exports = __toCommonJS(waveform_utils_exports);
var import_colord = require("colord");
var import_waveform_player = __toESM(require("@arraypress/waveform-player"));
var DEFAULT_WAVEFORM_HEIGHT = 100;
function getComputedStyle(element) {
  return element.ownerDocument.defaultView.getComputedStyle(element);
}
function getWaveformColors(element) {
  const textColor = getComputedStyle(element).color;
  const waveformColor = (0, import_colord.colord)(textColor).alpha(0.3).toRgbString();
  const progressColor = (0, import_colord.colord)(textColor).alpha(0.6).toRgbString();
  return { textColor, waveformColor, progressColor };
}
function createWaveformContainer({
  url,
  title,
  artist,
  artwork,
  waveformColor,
  progressColor,
  buttonColor,
  height = DEFAULT_WAVEFORM_HEIGHT
}) {
  const container = document.createElement("div");
  container.setAttribute("data-waveform-player", "");
  container.setAttribute("data-url", url);
  container.setAttribute("data-height", String(height));
  container.setAttribute("data-waveform-style", "bars");
  container.setAttribute("data-waveform-color", waveformColor);
  container.setAttribute("data-progress-color", progressColor);
  container.setAttribute("data-button-color", buttonColor);
  container.setAttribute("data-text-color", buttonColor);
  container.setAttribute("data-text-secondary-color", buttonColor);
  if (title) {
    container.setAttribute("data-title", title);
  }
  if (artist) {
    container.setAttribute("data-subtitle", artist);
  }
  if (artwork) {
    container.setAttribute("data-artwork", artwork);
  }
  return container;
}
function styleSvgIcons(container, buttonColor) {
  const isButtonDark = (0, import_colord.colord)(buttonColor).isDark();
  const iconColor = isButtonDark ? "#ffffff" : "#000000";
  const svgPaths = container.querySelectorAll("svg path");
  svgPaths.forEach((path) => {
    path.style.fill = iconColor;
  });
}
function setupPlayButtonAccessibility(container, { play: playLabel = "Play", pause: pauseLabel = "Pause" } = {}) {
  const playBtn = container.querySelector(".waveform-btn");
  if (!playBtn) {
    return;
  }
  playBtn.setAttribute("aria-label", playLabel);
  const onPlay = () => playBtn.setAttribute("aria-label", pauseLabel);
  const onPause = () => playBtn.setAttribute("aria-label", playLabel);
  container.addEventListener("waveformplayer:play", onPlay);
  container.addEventListener("waveformplayer:pause", onPause);
  container.addEventListener("waveformplayer:ended", onPause);
  return () => {
    container.removeEventListener("waveformplayer:play", onPlay);
    container.removeEventListener("waveformplayer:pause", onPause);
    container.removeEventListener("waveformplayer:ended", onPause);
  };
}
function logPlayError(error) {
  if (error.name === "AbortError") {
    return;
  }
  console.error("Playlist play error:", error);
}
function initWaveformPlayer(element, { src, title, artist, image, autoPlay, onEnded, labels }) {
  const { textColor, waveformColor, progressColor } = getWaveformColors(element);
  const container = createWaveformContainer({
    url: src,
    title,
    artist,
    artwork: image,
    waveformColor,
    progressColor,
    buttonColor: textColor
  });
  element.appendChild(container);
  const instance = new import_waveform_player.default(container);
  let cleanupAccessibility;
  const handlers = {
    ready: () => {
      styleSvgIcons(container, textColor);
      cleanupAccessibility = setupPlayButtonAccessibility(
        container,
        labels
      );
      if (autoPlay) {
        instance.play()?.catch(logPlayError);
      }
    },
    ended: () => onEnded?.()
  };
  container.addEventListener("waveformplayer:ready", handlers.ready);
  container.addEventListener("waveformplayer:ended", handlers.ended);
  return {
    instance,
    container,
    destroy: () => {
      cleanupAccessibility?.();
      container.removeEventListener(
        "waveformplayer:ready",
        handlers.ready
      );
      container.removeEventListener(
        "waveformplayer:ended",
        handlers.ended
      );
      instance.destroy();
      container.remove();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createWaveformContainer,
  getWaveformColors,
  initWaveformPlayer,
  logPlayError,
  setupPlayButtonAccessibility,
  styleSvgIcons
});
//# sourceMappingURL=waveform-utils.cjs.map
