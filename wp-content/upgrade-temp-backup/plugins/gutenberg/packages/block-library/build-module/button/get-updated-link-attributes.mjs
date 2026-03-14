// packages/block-library/src/button/get-updated-link-attributes.js
import { prependHTTPS } from "@wordpress/url";
import { NEW_TAB_REL, NEW_TAB_TARGET, NOFOLLOW_REL } from "./constants.mjs";
function getUpdatedLinkAttributes({
  rel = "",
  url = "",
  opensInNewTab,
  nofollow
}) {
  let newLinkTarget;
  let updatedRel = rel;
  if (opensInNewTab) {
    newLinkTarget = NEW_TAB_TARGET;
    updatedRel = updatedRel?.includes(NEW_TAB_REL) ? updatedRel : updatedRel + ` ${NEW_TAB_REL}`;
  } else {
    const relRegex = new RegExp(`\\b${NEW_TAB_REL}\\s*`, "g");
    updatedRel = updatedRel?.replace(relRegex, "").trim();
  }
  if (nofollow) {
    updatedRel = updatedRel?.includes(NOFOLLOW_REL) ? updatedRel : (updatedRel + ` ${NOFOLLOW_REL}`).trim();
  } else {
    const relRegex = new RegExp(`\\b${NOFOLLOW_REL}\\s*`, "g");
    updatedRel = updatedRel?.replace(relRegex, "").trim();
  }
  return {
    url: prependHTTPS(url),
    linkTarget: newLinkTarget,
    rel: updatedRel || void 0
  };
}
export {
  getUpdatedLinkAttributes
};
//# sourceMappingURL=get-updated-link-attributes.mjs.map
