// packages/block-editor/src/components/link-control/is-url-like.js
import { getProtocol, isValidProtocol, isValidFragment } from "@wordpress/url";
function isHashLink(val) {
  return val?.startsWith("#") && isValidFragment(val);
}
function isRelativePath(val) {
  return val?.startsWith("/") || val?.startsWith("./") || val?.startsWith("../");
}
function isURLLike(val) {
  const hasSpaces = val.includes(" ");
  if (hasSpaces) {
    return false;
  }
  const protocol = getProtocol(val);
  const protocolIsValid = isValidProtocol(protocol);
  const mayBeTLD = hasPossibleTLD(val);
  const isWWW = val?.startsWith("www.");
  return protocolIsValid || isWWW || isHashLink(val) || mayBeTLD || isRelativePath(val);
}
function hasPossibleTLD(url, maxLength = 6) {
  const cleanedURL = url.split(/[?#]/)[0];
  const regex = new RegExp(
    `(?<=\\S)\\.(?:[a-zA-Z_]{2,${maxLength}})(?:\\/|$)`
  );
  return regex.test(cleanedURL);
}
export {
  isURLLike as default,
  isHashLink,
  isRelativePath
};
//# sourceMappingURL=is-url-like.mjs.map
