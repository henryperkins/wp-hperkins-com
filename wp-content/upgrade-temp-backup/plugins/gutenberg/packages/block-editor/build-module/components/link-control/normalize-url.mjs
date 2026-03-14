// packages/block-editor/src/components/link-control/normalize-url.js
import { getProtocol, prependHTTPS } from "@wordpress/url";
import { isHashLink, isRelativePath } from "./is-url-like.mjs";
import { TEL_TYPE, MAILTO_TYPE, INTERNAL_TYPE, URL_TYPE } from "./constants.mjs";
function normalizeUrl(url) {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) {
    return { url: trimmedUrl, type: URL_TYPE };
  }
  let type = URL_TYPE;
  const protocol = getProtocol(trimmedUrl) || "";
  if (protocol.includes("mailto")) {
    type = MAILTO_TYPE;
  } else if (protocol.includes("tel")) {
    type = TEL_TYPE;
  } else if (trimmedUrl?.startsWith("#")) {
    type = INTERNAL_TYPE;
  }
  if (isHashLink(trimmedUrl) || isRelativePath(trimmedUrl) || trimmedUrl.startsWith("?") || protocol) {
    return { url: trimmedUrl, type };
  }
  return { url: prependHTTPS(trimmedUrl), type };
}
export {
  normalizeUrl as default
};
//# sourceMappingURL=normalize-url.mjs.map
