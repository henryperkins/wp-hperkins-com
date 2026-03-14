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

// packages/lazy-editor/src/components/preview/index.tsx
var preview_exports = {};
__export(preview_exports, {
  Preview: () => Preview
});
module.exports = __toCommonJS(preview_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_editor = require("@wordpress/editor");
var import_blocks = require("@wordpress/blocks");

// packages/lazy-editor/src/components/preview/style.scss
if (typeof document !== "undefined" && process.env.NODE_ENV !== "test" && !document.head.querySelector("style[data-wp-hash='5619aa31a1']")) {
  const style = document.createElement("style");
  style.setAttribute("data-wp-hash", "5619aa31a1");
  style.appendChild(document.createTextNode(".lazy-editor-block-preview__container{align-items:center;border-radius:4px;display:flex;flex-direction:column;height:100%;justify-content:center}.dataviews-view-grid .lazy-editor-block-preview__container .block-editor-block-preview__container{height:100%}.dataviews-view-table .lazy-editor-block-preview__container{text-wrap:balance;text-wrap:pretty;flex-grow:0;width:96px}"));
  document.head.appendChild(style);
}

// packages/lazy-editor/src/components/preview/index.tsx
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_use_editor_assets = require("../../hooks/use-editor-assets.cjs");
var import_use_editor_settings = require("../../hooks/use-editor-settings.cjs");
var import_use_styles_id = require("../../hooks/use-styles-id.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useStyle } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function PreviewContent({
  blocks,
  content,
  description
}) {
  const descriptionId = (0, import_element.useId)();
  const backgroundColor = useStyle("color.background");
  const actualBlocks = (0, import_element.useMemo)(() => {
    return blocks ?? (0, import_blocks.parse)(content, {
      __unstableSkipMigrationLogs: true
    });
  }, [content, blocks]);
  const isEmpty = !actualBlocks?.length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "lazy-editor-block-preview__container",
      style: { backgroundColor },
      "aria-describedby": !!description ? descriptionId : void 0,
      children: [
        isEmpty && (0, import_i18n.__)("Empty."),
        !isEmpty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview.Async, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockPreview, { blocks: actualBlocks }) }),
        !!description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { hidden: true, id: descriptionId, children: description })
      ]
    }
  );
}
function Preview({
  blocks,
  content,
  description
}) {
  const stylesId = (0, import_use_styles_id.useStylesId)();
  const { isReady: settingsReady, editorSettings } = (0, import_use_editor_settings.useEditorSettings)({
    stylesId
  });
  const { isReady: assetsReady } = (0, import_use_editor_assets.useEditorAssets)();
  const finalSettings = (0, import_element.useMemo)(
    () => ({
      ...editorSettings,
      isPreviewMode: true
    }),
    [editorSettings]
  );
  if (!settingsReady || !assetsReady) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockEditorProvider, { settings: finalSettings, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PreviewContent,
    {
      blocks,
      content,
      description
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Preview
});
//# sourceMappingURL=index.cjs.map
