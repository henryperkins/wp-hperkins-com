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

// packages/widgets/src/blocks/widget-group/edit.js
var edit_exports = {};
__export(edit_exports, {
  default: () => Edit
});
module.exports = __toCommonJS(edit_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_jsx_runtime = require("react/jsx-runtime");
function Edit(props) {
  const { clientId } = props;
  const hasInnerBlocks = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getBlockCount(clientId) > 0,
    [clientId]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...(0, import_block_editor.useBlockProps)({ className: "widget" }), children: !hasInnerBlocks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceholderContent, { ...props }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewContent, { ...props }) });
}
function PlaceholderContent({ clientId }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Placeholder,
      {
        className: "wp-block-widget-group__placeholder",
        icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockIcon, { icon: import_icons.group }),
        label: (0, import_i18n.__)("Widget Group"),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.ButtonBlockAppender, { rootClientId: clientId })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InnerBlocks, { renderAppender: false })
  ] });
}
function PreviewContent({ attributes, setAttributes }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichText,
      {
        tagName: "h2",
        identifier: "title",
        className: "widget-title",
        allowedFormats: [],
        placeholder: (0, import_i18n.__)("Title"),
        value: attributes.title ?? "",
        onChange: (title) => setAttributes({ title })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InnerBlocks, {})
  ] });
}
//# sourceMappingURL=edit.cjs.map
