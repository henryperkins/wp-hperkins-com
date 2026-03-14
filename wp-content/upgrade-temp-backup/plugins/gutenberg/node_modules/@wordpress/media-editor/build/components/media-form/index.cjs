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

// packages/media-editor/src/components/media-form/index.tsx
var media_form_exports = {};
__export(media_form_exports, {
  default: () => MediaForm
});
module.exports = __toCommonJS(media_form_exports);
var import_dataviews = require("@wordpress/dataviews");
var import_components = require("@wordpress/components");
var import_media_editor_provider = require("../media-editor-provider/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MediaForm({
  form: formOverrides,
  header
}) {
  const { media, fields, onChange } = (0, import_media_editor_provider.useMediaEditorContext)();
  if (!media || !onChange) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "media-editor-form media-editor-form--loading", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {}) });
  }
  const defaultForm = {
    layout: {
      type: "panel"
    },
    fields: fields.map((field) => {
      if (["title", "alt_text", "caption", "description"].includes(
        field.id
      )) {
        return {
          id: field.id,
          layout: {
            type: "regular",
            labelPosition: "top"
          }
        };
      }
      return field.id;
    })
  };
  const form = formOverrides || defaultForm;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "media-editor-form", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
    header,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_dataviews.DataForm,
      {
        data: media,
        fields,
        form,
        onChange
      }
    )
  ] }) });
}
//# sourceMappingURL=index.cjs.map
