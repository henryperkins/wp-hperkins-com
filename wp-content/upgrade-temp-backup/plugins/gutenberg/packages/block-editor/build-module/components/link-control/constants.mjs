// packages/block-editor/src/components/link-control/constants.js
import { __ } from "@wordpress/i18n";
var CREATE_TYPE = "__CREATE__";
var TEL_TYPE = "tel";
var URL_TYPE = "link";
var MAILTO_TYPE = "mailto";
var INTERNAL_TYPE = "internal";
var LINK_ENTRY_TYPES = [
  URL_TYPE,
  MAILTO_TYPE,
  TEL_TYPE,
  INTERNAL_TYPE
];
var DEFAULT_LINK_SETTINGS = [
  {
    id: "opensInNewTab",
    title: __("Open in new tab")
  }
];
export {
  CREATE_TYPE,
  DEFAULT_LINK_SETTINGS,
  INTERNAL_TYPE,
  LINK_ENTRY_TYPES,
  MAILTO_TYPE,
  TEL_TYPE,
  URL_TYPE
};
//# sourceMappingURL=constants.mjs.map
