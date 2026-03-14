"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// packages/block-editor/src/hooks/grid-visualizer.js
var import_compose = require("@wordpress/compose");
var import_hooks = require("@wordpress/hooks");
var import_data = require("@wordpress/data");
var import_grid = require("../components/grid/index.cjs");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_use_block_visibility = __toESM(require("../components/block-visibility/use-block-visibility.cjs"));
var import_private_keys = require("../store/private-keys.cjs");
var import_constants = require("../components/block-visibility/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function GridLayoutSync(props) {
  (0, import_grid.useGridLayoutSync)(props);
}
function GridTools({ clientId, layout }) {
  const { isVisible, blockVisibility, deviceType, isAnyAncestorHidden } = (0, import_data.useSelect)(
    (select) => {
      const {
        isBlockSelected,
        hasSelectedInnerBlock,
        isDraggingBlocks,
        getTemplateLock,
        getBlockEditingMode,
        getBlockAttributes,
        getSettings
      } = select(import_store.store);
      if (!isDraggingBlocks() && !isBlockSelected(clientId) || getTemplateLock(clientId) || getBlockEditingMode(clientId) !== "default" || hasSelectedInnerBlock(clientId)) {
        return { isVisible: false };
      }
      const { isBlockParentHiddenAtViewport } = (0, import_lock_unlock.unlock)(
        select(import_store.store)
      );
      const attributes = getBlockAttributes(clientId);
      const settings = getSettings();
      const currentDeviceType = settings?.[import_private_keys.deviceTypeKey]?.toLowerCase() || import_constants.BLOCK_VISIBILITY_VIEWPORTS.desktop.value;
      return {
        isVisible: true,
        blockVisibility: attributes?.metadata?.blockVisibility,
        deviceType: currentDeviceType,
        isAnyAncestorHidden: isBlockParentHiddenAtViewport(
          clientId,
          currentDeviceType
        )
      };
    },
    [clientId]
  );
  const { isBlockCurrentlyHidden } = (0, import_use_block_visibility.default)({
    blockVisibility,
    deviceType
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridLayoutSync, { clientId }),
    isVisible && !isBlockCurrentlyHidden && !isAnyAncestorHidden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_grid.GridVisualizer,
      {
        clientId,
        parentLayout: layout
      }
    )
  ] });
}
var addGridVisualizerToBlockEdit = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => function AddGridVisualizerToBlockEdit(props) {
    if (props.attributes.layout?.type !== "grid") {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit");
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        GridTools,
        {
          clientId: props.clientId,
          layout: props.attributes.layout
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit")
    ] });
  },
  "addGridVisualizerToBlockEdit"
);
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/editor/grid-visualizer",
  addGridVisualizerToBlockEdit
);
//# sourceMappingURL=grid-visualizer.cjs.map
