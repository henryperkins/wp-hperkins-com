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

// packages/edit-site/src/components/layout/hooks.js
var hooks_exports = {};
__export(hooks_exports, {
  useIsSiteEditorLoading: () => useIsSiteEditorLoading
});
module.exports = __toCommonJS(hooks_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var MAX_LOADING_TIME = 1e4;
function useIsSiteEditorLoading() {
  const [loaded, setLoaded] = (0, import_element.useState)(false);
  const inLoadingPause = (0, import_data.useSelect)(
    (select) => {
      const hasResolvingSelectors = select(import_core_data.store).hasResolvingSelectors();
      return !loaded && !hasResolvingSelectors;
    },
    [loaded]
  );
  (0, import_element.useEffect)(() => {
    let timeout;
    if (!loaded) {
      timeout = setTimeout(() => {
        setLoaded(true);
      }, MAX_LOADING_TIME);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [loaded]);
  (0, import_element.useEffect)(() => {
    if (inLoadingPause) {
      const ARTIFICIAL_DELAY = 100;
      const timeout = setTimeout(() => {
        setLoaded(true);
      }, ARTIFICIAL_DELAY);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [inLoadingPause]);
  return !loaded;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsSiteEditorLoading
});
//# sourceMappingURL=hooks.cjs.map
