"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/fields/src/actions/export-pattern.tsx
var export_pattern_exports = {};
__export(export_pattern_exports, {
  default: () => export_pattern_default
});
module.exports = __toCommonJS(export_pattern_exports);
var import_change_case = require("change-case");
var import_client_zip = require("client-zip");
var import_blob = require("@wordpress/blob");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_utils = require("./utils.cjs");
function getJsonFromItem(item) {
  return JSON.stringify(
    {
      __file: item.type,
      title: (0, import_utils.getItemTitle)(item),
      content: typeof item.content === "string" ? item.content : item.content?.raw,
      syncStatus: item.wp_pattern_sync_status
    },
    null,
    2
  );
}
var exportPattern = {
  id: "export-pattern",
  label: (0, import_i18n.__)("Export as JSON"),
  icon: import_icons.download,
  supportsBulk: true,
  isEligible: (item) => item.type === "wp_block",
  callback: async (items) => {
    if (items.length === 1) {
      return (0, import_blob.downloadBlob)(
        `${(0, import_change_case.paramCase)(
          (0, import_utils.getItemTitle)(items[0]) || items[0].slug
        )}.json`,
        getJsonFromItem(items[0]),
        "application/json"
      );
    }
    const nameCount = {};
    const filesToZip = items.map((item) => {
      const name = (0, import_change_case.paramCase)((0, import_utils.getItemTitle)(item) || item.slug);
      nameCount[name] = (nameCount[name] || 0) + 1;
      return {
        name: `${name + (nameCount[name] > 1 ? "-" + (nameCount[name] - 1) : "")}.json`,
        lastModified: /* @__PURE__ */ new Date(),
        input: getJsonFromItem(item)
      };
    });
    return (0, import_blob.downloadBlob)(
      (0, import_i18n.__)("patterns-export") + ".zip",
      await (0, import_client_zip.downloadZip)(filesToZip).blob(),
      "application/zip"
    );
  }
};
var export_pattern_default = exportPattern;
//# sourceMappingURL=export-pattern.cjs.map
