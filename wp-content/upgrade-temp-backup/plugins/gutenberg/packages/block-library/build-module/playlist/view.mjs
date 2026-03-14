// packages/block-library/src/playlist/view.js
import { store, getContext, getElement } from "@wordpress/interactivity";
import { initWaveformPlayer, logPlayError } from "../utils/waveform-utils.mjs";
var playerState = /* @__PURE__ */ new WeakMap();
var { state } = store(
  "core/playlist",
  {
    state: {
      playlists: {},
      get isCurrentTrack() {
        const { currentId, uniqueId } = getContext();
        return currentId === uniqueId;
      }
    },
    actions: {
      changeTrack() {
        const context = getContext();
        context.currentId = context.uniqueId;
      }
    },
    callbacks: {
      initWaveformPlayer() {
        const context = getContext();
        const { ref } = getElement();
        if (!context.currentId || !ref) {
          return;
        }
        const track = state.playlists[context.playlistId]?.tracks[context.currentId];
        if (!track?.url) {
          return;
        }
        const existing = playerState.get(ref);
        if (existing?.url === track.url) {
          return;
        }
        const shouldAutoPlay = !!existing?.url;
        initPlayer(ref, track, shouldAutoPlay, context);
      }
    }
  },
  { lock: true }
);
function initPlayer(ref, track, shouldAutoPlay, context) {
  const existing = playerState.get(ref);
  if (existing?.instance) {
    existing.instance.loadTrack(track.url, track.title, track.artist, {
      artwork: track.image
    }).then(() => {
      existing.url = track.url;
      if (shouldAutoPlay) {
        existing.instance.play()?.catch(logPlayError);
      }
    }).catch(logPlayError);
    return;
  }
  const labels = {
    play: ref.dataset.labelPlay,
    pause: ref.dataset.labelPause
  };
  const player = initWaveformPlayer(ref, {
    src: track.url,
    title: track.title,
    artist: track.artist,
    image: track.image,
    autoPlay: shouldAutoPlay,
    labels,
    onEnded: () => {
      const currentIndex = context.tracks.findIndex(
        (uniqueId) => uniqueId === context.currentId
      );
      const nextTrack = context.tracks[currentIndex + 1];
      if (nextTrack) {
        context.currentId = nextTrack;
      }
    }
  });
  playerState.set(ref, {
    url: track.url,
    instance: player.instance,
    destroy: player.destroy
  });
}
//# sourceMappingURL=view.mjs.map
