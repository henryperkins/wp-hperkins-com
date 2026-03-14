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

// packages/block-library/src/html/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => HTMLEdit
});
module.exports = __toCommonJS(edit_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_preview = __toESM(require("./preview.cjs"));
var import_modal = __toESM(require("./modal.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function HTMLEdit({ attributes, setAttributes, isSelected }) {
  const [isModalOpen, setIsModalOpen] = (0, import_element.useState)(false);
  const blockProps = (0, import_block_editor.useBlockProps)({
    className: "block-library-html__edit"
  });
  if (!attributes.content?.trim()) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ...blockProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Placeholder,
        {
          icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.code }),
          label: (0, import_i18n.__)("Custom HTML"),
          instructions: (0, import_i18n.__)(
            "Add custom HTML code and preview how it looks."
          ),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "primary",
              onClick: () => setIsModalOpen(true),
              children: (0, import_i18n.__)("Edit HTML")
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_modal.default,
        {
          isOpen: isModalOpen,
          onRequestClose: () => setIsModalOpen(false),
          content: attributes.content,
          setAttributes
        }
      )
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ...blockProps, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarButton, { onClick: () => setIsModalOpen(true), children: (0, import_i18n.__)("Edit code") }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalVStack,
      {
        className: "block-editor-block-inspector-edit-contents",
        expanded: true,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: "block-editor-block-inspector-edit-contents__button",
            __next40pxDefaultSize: true,
            variant: "secondary",
            onClick: () => setIsModalOpen(true),
            children: (0, import_i18n.__)("Edit code")
          }
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_preview.default, { content: attributes.content, isSelected }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_modal.default,
      {
        isOpen: isModalOpen,
        onRequestClose: () => setIsModalOpen(false),
        content: attributes.content,
        setAttributes
      }
    )
  ] });
}
//# sourceMappingURL=edit.cjs.map
