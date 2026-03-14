"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-visibility/viewport-visibility-info.js
var viewport_visibility_info_exports = {};
__export(viewport_visibility_info_exports, {
  default: () => ViewportVisibilityInfo
});
module.exports = __toCommonJS(viewport_visibility_info_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_use_block_visibility = __toESM(require("./use-block-visibility.cjs"));
var import_private_keys = require("../../store/private-keys.cjs");
var import_constants = require("./constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var DEFAULT_VISIBILITY_STATE = {
  currentBlockVisibility: void 0,
  hasParentHiddenEverywhere: false,
  selectedDeviceType: import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.value
};
function ViewportVisibilityInfo({ clientId }) {
  const {
    currentBlockVisibility,
    selectedDeviceType,
    hasParentHiddenEverywhere
  } = (0, import_data.useSelect)(
    (select) => {
      if (!clientId) {
        return DEFAULT_VISIBILITY_STATE;
      }
      const {
        getBlockAttributes,
        isBlockParentHiddenEverywhere,
        getSettings
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      return {
        currentBlockVisibility: getBlockAttributes(clientId)?.metadata?.blockVisibility,
        selectedDeviceType: getSettings()?.[import_private_keys.deviceTypeKey]?.toLowerCase() || import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.value,
        hasParentHiddenEverywhere: isBlockParentHiddenEverywhere(clientId)
      };
    },
    [clientId]
  );
  const { isBlockCurrentlyHidden, currentViewport } = (0, import_use_block_visibility.default)({
    blockVisibility: currentBlockVisibility,
    deviceType: selectedDeviceType
  });
  const isBlockParentHiddenAtViewport = (0, import_data.useSelect)(
    (select) => {
      if (!clientId || !currentViewport) {
        return false;
      }
      return (0, import_lock_unlock.unlock)(
        select(import_store.store)
      ).isBlockParentHiddenAtViewport(clientId, currentViewport);
    },
    [clientId, currentViewport]
  );
  if (!(isBlockCurrentlyHidden || hasParentHiddenEverywhere || isBlockParentHiddenAtViewport)) {
    return null;
  }
  let label;
  if (isBlockCurrentlyHidden) {
    if (currentBlockVisibility === false) {
      label = (0, import_i18n.__)("Block is hidden");
    } else {
      const viewportLabel = import_constants.BLOCK_VISIBILITY_VIEWPORTS[currentViewport]?.label || currentViewport;
      label = (0, import_i18n.sprintf)(
        /* translators: %s: viewport name (Desktop, Tablet, Mobile) */
        (0, import_i18n.__)("Block is hidden on %s"),
        viewportLabel
      );
    }
  }
  if (hasParentHiddenEverywhere) {
    label = (0, import_i18n.__)("Parent block is hidden");
  } else if (isBlockParentHiddenAtViewport) {
    const viewportLabel = import_constants.BLOCK_VISIBILITY_VIEWPORTS[currentViewport]?.label || currentViewport;
    label = (0, import_i18n.sprintf)(
      /* translators: %s: viewport name (Desktop, Tablet, Mobile) */
      (0, import_i18n.__)("Parent block is hidden on %s"),
      viewportLabel
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { className: "block-editor-block-visibility-info", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: 2, justify: "start", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.unseen }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: label })
  ] }) });
}
//# sourceMappingURL=viewport-visibility-info.cjs.map
