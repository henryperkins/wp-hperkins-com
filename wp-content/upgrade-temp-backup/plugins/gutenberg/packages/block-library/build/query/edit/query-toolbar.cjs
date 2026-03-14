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

// packages/block-library/src/query/edit/query-toolbar.js
var query_toolbar_exports = {};
__export(query_toolbar_exports, {
  default: () => QueryToolbar
});
module.exports = __toCommonJS(query_toolbar_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_pattern_selection = __toESM(require("./pattern-selection.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PatternPicker({ clientId, attributes, hasInnerBlocks }) {
  const hasPatterns = (0, import_pattern_selection.useBlockPatterns)(clientId, attributes).length;
  if (!hasPatterns) {
    return null;
  }
  const buttonLabel = hasInnerBlocks ? (0, import_i18n.__)("Change design") : (0, import_i18n.__)("Choose pattern");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { group: "other", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalDropdownContentWrapper, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      contentClassName: "block-editor-block-settings-menu__popover",
      focusOnMount: "firstElement",
      expandOnMobile: true,
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.ToolbarButton,
        {
          "aria-haspopup": "true",
          "aria-expanded": isOpen,
          onClick: onToggle,
          children: buttonLabel
        }
      ),
      renderContent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_pattern_selection.default,
        {
          clientId,
          attributes,
          showSearch: false,
          showTitlesAsTooltip: true
        }
      )
    }
  ) }) });
}
function QueryToolbar(props) {
  const isLocked = (0, import_data.useSelect)(
    (select) => {
      const { isLockedBlock } = (0, import_lock_unlock.unlock)(select(import_block_editor.store));
      return isLockedBlock(props.clientId);
    },
    [props.clientId]
  );
  if (isLocked) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternPicker, { ...props });
}
//# sourceMappingURL=query-toolbar.cjs.map
