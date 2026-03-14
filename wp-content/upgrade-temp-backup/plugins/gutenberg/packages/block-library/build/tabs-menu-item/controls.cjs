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

// packages/block-library/src/tabs-menu-item/controls.js
var controls_exports = {};
__export(controls_exports, {
  default: () => Controls
});
module.exports = __toCommonJS(controls_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_add_tab_toolbar_control = __toESM(require("../tab/add-tab-toolbar-control.cjs"));
var import_remove_tab_toolbar_control = __toESM(require("../tab/remove-tab-toolbar-control.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function TabBlockMover({
  tabClientId,
  tabIndex,
  tabsCount,
  tabsMenuClientId,
  tabsClientId
}) {
  const {
    moveBlocksUp,
    moveBlocksDown,
    updateBlockAttributes,
    __unstableMarkNextChangeAsNotPersistent
  } = (0, import_data.useDispatch)(import_block_editor.store);
  const { tabPanelClientId, orientation } = (0, import_data.useSelect)(
    (select) => {
      const { getBlockRootClientId, getBlockAttributes } = select(import_block_editor.store);
      const tabsMenuAttributes = tabsMenuClientId ? getBlockAttributes(tabsMenuClientId) : null;
      return {
        tabPanelClientId: getBlockRootClientId(tabClientId),
        orientation: tabsMenuAttributes?.layout?.orientation || "horizontal"
      };
    },
    [tabClientId, tabsMenuClientId]
  );
  const isFirst = tabIndex === 0;
  const isLast = tabIndex === tabsCount - 1;
  const isHorizontal = orientation === "horizontal";
  let upIcon, downIcon, upLabel, downLabel;
  if (isHorizontal) {
    if ((0, import_i18n.isRTL)()) {
      upIcon = import_icons.chevronRight;
      downIcon = import_icons.chevronLeft;
      upLabel = (0, import_i18n.__)("Move tab right");
      downLabel = (0, import_i18n.__)("Move tab left");
    } else {
      upIcon = import_icons.chevronLeft;
      downIcon = import_icons.chevronRight;
      upLabel = (0, import_i18n.__)("Move tab left");
      downLabel = (0, import_i18n.__)("Move tab right");
    }
  } else {
    upIcon = import_icons.chevronUp;
    downIcon = import_icons.chevronDown;
    upLabel = (0, import_i18n.__)("Move tab up");
    downLabel = (0, import_i18n.__)("Move tab down");
  }
  const handleMoveUp = () => {
    moveBlocksUp([tabClientId], tabPanelClientId);
    if (tabsClientId) {
      __unstableMarkNextChangeAsNotPersistent();
      updateBlockAttributes(tabsClientId, {
        editorActiveTabIndex: tabIndex - 1
      });
    }
  };
  const handleMoveDown = () => {
    moveBlocksDown([tabClientId], tabPanelClientId);
    if (tabsClientId) {
      __unstableMarkNextChangeAsNotPersistent();
      updateBlockAttributes(tabsClientId, {
        editorActiveTabIndex: tabIndex + 1
      });
    }
  };
  if (tabsCount <= 1) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "parent", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarGroup,
    {
      className: (0, import_clsx.default)("block-editor-block-mover", {
        "is-horizontal": isHorizontal
      }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-editor-block-mover__move-button-container", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { children: (itemProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: (0, import_clsx.default)(
              "block-editor-block-mover-button",
              "is-up-button"
            ),
            icon: upIcon,
            label: upLabel,
            disabled: isFirst,
            accessibleWhenDisabled: true,
            onClick: handleMoveUp,
            __next40pxDefaultSize: true,
            ...itemProps
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { children: (itemProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: (0, import_clsx.default)(
              "block-editor-block-mover-button",
              "is-down-button"
            ),
            icon: downIcon,
            label: downLabel,
            disabled: isLast,
            accessibleWhenDisabled: true,
            onClick: handleMoveDown,
            __next40pxDefaultSize: true,
            ...itemProps
          }
        ) })
      ] })
    }
  ) });
}
function Controls({
  tabsClientId,
  tabClientId,
  tabIndex,
  tabsCount,
  tabsMenuClientId
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      TabBlockMover,
      {
        tabClientId,
        tabIndex,
        tabsCount,
        tabsMenuClientId,
        tabsClientId
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_add_tab_toolbar_control.default, { tabsClientId }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_remove_tab_toolbar_control.default, { tabsClientId })
  ] });
}
//# sourceMappingURL=controls.cjs.map
