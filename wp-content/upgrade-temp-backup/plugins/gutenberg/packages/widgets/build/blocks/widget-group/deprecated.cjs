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

// packages/widgets/src/blocks/widget-group/deprecated.js
var deprecated_exports = {};
__export(deprecated_exports, {
  default: () => deprecated_default
});
module.exports = __toCommonJS(deprecated_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
var v1 = {
  attributes: {
    title: {
      type: "string"
    }
  },
  supports: {
    html: false,
    inserter: true,
    customClassName: true,
    reusable: false
  },
  save({ attributes }) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.RichText.Content,
        {
          tagName: "h2",
          className: "widget-title",
          value: attributes.title
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InnerBlocks.Content, {})
    ] });
  }
};
var deprecated_default = [v1];
//# sourceMappingURL=deprecated.cjs.map
