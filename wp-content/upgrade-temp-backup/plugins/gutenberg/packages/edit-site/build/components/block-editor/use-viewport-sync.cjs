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

// packages/edit-site/src/components/block-editor/use-viewport-sync.js
var use_viewport_sync_exports = {};
__export(use_viewport_sync_exports, {
  DEFAULT_DEVICE_TYPE: () => DEFAULT_DEVICE_TYPE,
  ViewportSync: () => ViewportSync,
  default: () => useViewportSync
});
module.exports = __toCommonJS(use_viewport_sync_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_router = require("@wordpress/router");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
var DEFAULT_DEVICE_TYPE = "Desktop";
var VALID_DEVICE_TYPES = ["desktop", "tablet", "mobile"];
var capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
function useViewportSync() {
  const { query } = useLocation();
  const { setDeviceType } = (0, import_data.useDispatch)(import_editor.store);
  (0, import_element.useEffect)(() => {
    const viewport = query?.viewport?.toLowerCase();
    const isValid = VALID_DEVICE_TYPES.includes(viewport);
    setDeviceType(isValid ? capitalize(viewport) : DEFAULT_DEVICE_TYPE);
  }, [query?.viewport, setDeviceType]);
}
function ViewportSync() {
  useViewportSync();
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_DEVICE_TYPE,
  ViewportSync
});
//# sourceMappingURL=use-viewport-sync.cjs.map
