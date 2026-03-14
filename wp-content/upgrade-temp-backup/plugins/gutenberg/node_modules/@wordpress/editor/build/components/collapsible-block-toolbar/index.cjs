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

// packages/editor/src/components/collapsible-block-toolbar/index.js
var collapsible_block_toolbar_exports = {};
__export(collapsible_block_toolbar_exports, {
  default: () => CollapsibleBlockToolbar
});
module.exports = __toCommonJS(collapsible_block_toolbar_exports);
var import_clsx = __toESM(require("clsx"));
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHasBlockToolbar } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function CollapsibleBlockToolbar({ isCollapsed, onToggle }) {
  const { blockSelectionStart } = (0, import_data.useSelect)((select) => {
    return {
      blockSelectionStart: select(import_block_editor.store).getBlockSelectionStart()
    };
  }, []);
  const hasBlockToolbar = useHasBlockToolbar();
  const hasBlockSelection = !!blockSelectionStart;
  (0, import_element.useEffect)(() => {
    if (blockSelectionStart) {
      onToggle(false);
    }
  }, [blockSelectionStart, onToggle]);
  if (!hasBlockToolbar) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: (0, import_clsx.default)("editor-collapsible-block-toolbar", {
          "is-collapsed": isCollapsed || !hasBlockSelection
        }),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockToolbar, { hideDragHandle: true })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Popover.Slot, { name: "block-toolbar" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        className: "editor-collapsible-block-toolbar__toggle",
        icon: isCollapsed ? import_icons.next : import_icons.previous,
        onClick: () => {
          onToggle(!isCollapsed);
        },
        label: isCollapsed ? (0, import_i18n.__)("Show block tools") : (0, import_i18n.__)("Hide block tools"),
        size: "compact"
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
