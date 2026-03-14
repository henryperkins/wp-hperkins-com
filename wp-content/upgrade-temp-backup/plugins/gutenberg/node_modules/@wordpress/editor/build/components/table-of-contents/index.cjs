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

// packages/editor/src/components/table-of-contents/index.js
var table_of_contents_exports = {};
__export(table_of_contents_exports, {
  default: () => table_of_contents_default
});
module.exports = __toCommonJS(table_of_contents_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_panel = __toESM(require("./panel.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function TableOfContents({ hasOutlineItemsDisabled, repositionDropdown, ...props }, ref) {
  const hasBlocks = (0, import_data.useSelect)(
    (select) => !!select(import_block_editor.store).getBlockCount(),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Dropdown,
    {
      popoverProps: {
        placement: repositionDropdown ? "right" : "bottom"
      },
      className: "table-of-contents",
      contentClassName: "table-of-contents__popover",
      renderToggle: ({ isOpen, onToggle }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          ...props,
          ref,
          onClick: hasBlocks ? onToggle : void 0,
          icon: import_icons.info,
          "aria-expanded": isOpen,
          "aria-haspopup": "true",
          label: (0, import_i18n.__)("Details"),
          tooltipPosition: "bottom",
          "aria-disabled": !hasBlocks
        }
      ),
      renderContent: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_panel.default,
        {
          onRequestClose: onClose,
          hasOutlineItemsDisabled
        }
      )
    }
  );
}
var table_of_contents_default = (0, import_element.forwardRef)(TableOfContents);
//# sourceMappingURL=index.cjs.map
