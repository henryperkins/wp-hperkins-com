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

// packages/editor/src/dataviews/fields/content-preview/content-preview-view.tsx
var content_preview_view_exports = {};
__export(content_preview_view_exports, {
  default: () => PostPreviewView
});
module.exports = __toCommonJS(content_preview_view_exports);
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_provider = require("../../../components/provider/index.cjs");
var import_global_styles = require("../../../components/global-styles/index.cjs");
var import_lock_unlock = require("../../../lock-unlock.cjs");
var import_store = require("../../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostPreviewContainer({
  template,
  post
}) {
  const [backgroundColor = "white"] = (0, import_global_styles.useStyle)("color.background");
  const [postBlocks] = (0, import_core_data.useEntityBlockEditor)("postType", post.type, {
    id: post.id
  });
  const [templateBlocks] = (0, import_core_data.useEntityBlockEditor)(
    "postType",
    template?.type,
    {
      id: template?.id
    }
  );
  const blocks = template && templateBlocks ? templateBlocks : postBlocks;
  const isEmpty = !blocks?.length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "editor-fields-content-preview",
      style: {
        backgroundColor
      },
      children: [
        isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-fields-content-preview__empty", children: (0, import_i18n.__)("Empty content") }),
        !isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview.Async, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview, { blocks }) })
      ]
    }
  );
}
function PostPreviewView({ item }) {
  const { settings, template } = (0, import_data.useSelect)(
    (select) => {
      const { canUser, getPostType, getTemplateId, getEntityRecord } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
      const canViewTemplate = canUser("read", {
        kind: "postType",
        name: "wp_template"
      });
      const _settings = select(import_store.store).getEditorSettings();
      const supportsTemplateMode = _settings.supportsTemplateMode;
      const isViewable = getPostType(item.type)?.viewable ?? false;
      const templateId = supportsTemplateMode && isViewable && canViewTemplate ? getTemplateId(item.type, item.id) : null;
      return {
        settings: _settings,
        template: templateId ? getEntityRecord("postType", "wp_template", templateId) : void 0
      };
    },
    [item.type, item.id]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_provider.EditorProvider,
    {
      post: item,
      settings,
      __unstableTemplate: template,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostPreviewContainer, { template, post: item })
    }
  );
}
//# sourceMappingURL=content-preview-view.cjs.map
