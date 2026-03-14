// packages/media-utils/src/utils/sideload-to-server.ts
import apiFetch from "@wordpress/api-fetch";
import { flattenFormData } from "./flatten-form-data.mjs";
import { transformAttachment } from "./transform-attachment.mjs";
async function sideloadToServer(file, attachmentId, additionalData = {}, signal) {
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
      path: `/wp/v2/media/${attachmentId}/sideload`,
      body: data,
      method: "POST",
      signal
    })
  );
}
export {
  sideloadToServer
};
//# sourceMappingURL=sideload-to-server.mjs.map
