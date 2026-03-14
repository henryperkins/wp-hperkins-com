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

// packages/edit-site/src/components/page-templates/hooks.js
var hooks_exports = {};
__export(hooks_exports, {
  useAddedBy: () => useAddedBy
});
module.exports = __toCommonJS(hooks_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_constants = require("../../utils/constants.cjs");
function useAddedBy(postType, postId) {
  return (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecord, getUser, getEditedEntityRecord } = select(import_core_data.store);
      const template = getEditedEntityRecord(
        "postType",
        postType,
        postId
      );
      const originalSource = template?.original_source;
      const authorText = template?.author_text;
      switch (originalSource) {
        case "theme": {
          return {
            type: originalSource,
            icon: import_icons.layout,
            text: authorText,
            isCustomized: template.source === import_constants.TEMPLATE_ORIGINS.custom
          };
        }
        case "plugin": {
          return {
            type: originalSource,
            icon: import_icons.plugins,
            text: authorText,
            isCustomized: template.source === import_constants.TEMPLATE_ORIGINS.custom
          };
        }
        case "site": {
          const siteData = getEntityRecord(
            "root",
            "__unstableBase"
          );
          return {
            type: originalSource,
            icon: import_icons.globe,
            imageUrl: siteData?.site_logo ? getEntityRecord(
              "postType",
              "attachment",
              siteData.site_logo
            )?.source_url : void 0,
            text: authorText,
            isCustomized: false
          };
        }
        default: {
          const user = getUser(template.author);
          return {
            type: "user",
            icon: import_icons.commentAuthorAvatar,
            imageUrl: user?.avatar_urls?.[48],
            text: authorText ?? user?.name,
            isCustomized: false
          };
        }
      }
    },
    [postType, postId]
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAddedBy
});
//# sourceMappingURL=hooks.cjs.map
