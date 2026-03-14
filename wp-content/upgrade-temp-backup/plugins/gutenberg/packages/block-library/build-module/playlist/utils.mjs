// packages/block-library/src/playlist/utils.js
import { v4 as uuid } from "uuid";
import { __ } from "@wordpress/i18n";
function getTrackAttributes(media) {
  return {
    id: media.id || media.url,
    // Attachment ID or URL.
    uniqueId: uuid(),
    // Unique ID for the track.
    src: media.url,
    title: media.title,
    artist: media.artist || media?.meta?.artist || media?.media_details?.artist || __("Unknown artist"),
    album: media.album || media?.meta?.album || media?.media_details?.album || __("Unknown album"),
    length: media?.fileLength || media?.media_details?.length_formatted,
    // Prevent using the default media attachment icon as the track image.
    // Note: Image is not available when a new track is uploaded.
    image: media?.image?.src && media?.image?.src.endsWith("/images/media/audio.svg") ? "" : media?.image?.src
  };
}
export {
  getTrackAttributes
};
//# sourceMappingURL=utils.mjs.map
