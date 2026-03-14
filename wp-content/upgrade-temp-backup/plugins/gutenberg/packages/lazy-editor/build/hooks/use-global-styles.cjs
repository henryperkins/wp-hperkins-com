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

// packages/lazy-editor/src/hooks/use-global-styles.tsx
var use_global_styles_exports = {};
__export(use_global_styles_exports, {
  useUserGlobalStyles: () => useUserGlobalStyles
});
module.exports = __toCommonJS(use_global_styles_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
function useUserGlobalStyles(id) {
  const { userGlobalStyles } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecord, getEditedEntityRecord, canUser } = select(import_core_data.store);
      const userCanEditGlobalStyles = canUser("update", {
        kind: "root",
        name: "globalStyles",
        id
      });
      let record;
      if (
        /*
         * Test that the OPTIONS request for user capabilities is complete
         * before fetching the global styles entity record.
         * This is to avoid fetching the global styles entity unnecessarily.
         */
        typeof userCanEditGlobalStyles === "boolean"
      ) {
        if (userCanEditGlobalStyles) {
          record = getEditedEntityRecord(
            "root",
            "globalStyles",
            id
          );
        } else {
          record = getEntityRecord("root", "globalStyles", id, {
            context: "view"
          });
        }
      }
      return {
        userGlobalStyles: record
      };
    },
    [id]
  );
  return (0, import_element.useMemo)(() => {
    if (!userGlobalStyles) {
      return {
        user: void 0
      };
    }
    const user = userGlobalStyles;
    return {
      user
    };
  }, [userGlobalStyles]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useUserGlobalStyles
});
//# sourceMappingURL=use-global-styles.cjs.map
