// packages/editor/src/components/post-publish-panel/media-util.js
import { v4 as uuid } from "uuid";
import { getFilename } from "@wordpress/url";
function generateUniqueBasenames(urls) {
  const basenames = /* @__PURE__ */ new Set();
  return Object.fromEntries(
    urls.map((url) => {
      const filename = getFilename(url);
      let basename = "";
      if (filename) {
        const parts = filename.split(".");
        if (parts.length > 1) {
          parts.pop();
        }
        basename = parts.join(".");
      }
      if (!basename) {
        basename = uuid();
      }
      if (basenames.has(basename)) {
        basename = `${basename}-${uuid()}`;
      }
      basenames.add(basename);
      return [url, basename];
    })
  );
}
function fetchMedia(urls) {
  return Object.fromEntries(
    Object.entries(generateUniqueBasenames(urls)).map(
      ([url, basename]) => {
        const filePromise = window.fetch(url.includes("?") ? url : url + "?").then((response) => response.blob()).then((blob) => {
          return new File([blob], `${basename}.png`, {
            type: blob.type
          });
        });
        return [url, filePromise];
      }
    )
  );
}
export {
  fetchMedia,
  generateUniqueBasenames
};
//# sourceMappingURL=media-util.mjs.map
