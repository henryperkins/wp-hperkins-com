// packages/media-utils/src/utils/upload-to-server.ts
import apiFetch from "@wordpress/api-fetch";
import { flattenFormData } from "./flatten-form-data.mjs";
import { transformAttachment } from "./transform-attachment.mjs";
async function uploadToServer(file, additionalData = {}, signal) {
  const data = new FormData();
  data.append("file", file, file.name || file.type.replace("/", "."));
  for (const [key, value] of Object.entries(additionalData)) {
    flattenFormData(
      data,
      key,
      value
    );
  }
  return transformAttachment(
    await apiFetch({
      // This allows the video block to directly get a video's poster image.
      path: "/wp/v2/media?_embed=wp:featuredmedia",
      body: data,
      method: "POST",
      signal
    })
  );
}
export {
  uploadToServer
};
//# sourceMappingURL=upload-to-server.mjs.map
