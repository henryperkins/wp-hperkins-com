// packages/block-library/src/utils/waveform-utils.js
import { colord } from "colord";
import WaveformPlayerLib from "@arraypress/waveform-player";
var DEFAULT_WAVEFORM_HEIGHT = 100;
function getComputedStyle(element) {
  return element.ownerDocument.defaultView.getComputedStyle(element);
}
function getWaveformColors(element) {
  const textColor = getComputedStyle(element).color;
  const waveformColor = colord(textColor).alpha(0.3).toRgbString();
  const progressColor = colord(textColor).alpha(0.6).toRgbString();
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
  const isButtonDark = colord(buttonColor).isDark();
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
  const instance = new WaveformPlayerLib(container);
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
export {
  createWaveformContainer,
  getWaveformColors,
  initWaveformPlayer,
  logPlayError,
  setupPlayButtonAccessibility,
  styleSvgIcons
};
//# sourceMappingURL=waveform-utils.mjs.map
