// packages/block-library/src/utils/waveform-player.js
import { useRef } from "@wordpress/element";
import { useRefEffect } from "@wordpress/compose";
import { initWaveformPlayer } from "./waveform-utils.mjs";
import { jsx } from "react/jsx-runtime";
function WaveformPlayer({ src, title, artist, image, onEnded }) {
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const ref = useRefEffect(
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
        const { destroy } = initWaveformPlayer(element, {
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
  return /* @__PURE__ */ jsx("div", { ref, className: "wp-block-playlist__waveform-player" });
}
export {
  WaveformPlayer
};
//# sourceMappingURL=waveform-player.mjs.map
