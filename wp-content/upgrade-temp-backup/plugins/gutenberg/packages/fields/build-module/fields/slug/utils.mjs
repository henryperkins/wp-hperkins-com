// packages/fields/src/fields/slug/utils.ts
import { cleanForSlug } from "@wordpress/url";
import { getItemTitle } from "../../actions/utils.mjs";
var getSlug = (item) => {
  if (typeof item !== "object") {
    return "";
  }
  return item.slug || cleanForSlug(getItemTitle(item)) || item.id.toString();
};
export {
  getSlug
};
//# sourceMappingURL=utils.mjs.map
