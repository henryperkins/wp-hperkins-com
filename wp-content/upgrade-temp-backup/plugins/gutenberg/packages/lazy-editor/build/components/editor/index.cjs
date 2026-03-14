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

// packages/lazy-editor/src/components/editor/index.tsx
var editor_exports = {};
__export(editor_exports, {
  Editor: () => Editor
});
module.exports = __toCommonJS(editor_exports);
var import_editor = require("@wordpress/editor");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_use_styles_id = require("../../hooks/use-styles-id.cjs");
var import_use_editor_settings = require("../../hooks/use-editor-settings.cjs");
var import_use_editor_assets = require("../../hooks/use-editor-assets.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Editor: PrivateEditor, BackButton } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function Editor({
  postType,
  postId,
  settings,
  backButton
}) {
  const homePage = (0, import_data.useSelect)(
    (select) => {
      if (postType || postId) {
        return null;
      }
      const { getHomePage } = (0, import_lock_unlock.unlock)(select(import_core_data.store));
      return getHomePage();
    },
    [postType, postId]
  );
  const resolvedPostType = postType || homePage?.postType;
  const resolvedPostId = postId || homePage?.postId;
  const templateId = (0, import_data.useSelect)(
    (select) => {
      if (!resolvedPostType || !resolvedPostId) {
        return void 0;
      }
      if (resolvedPostType === "wp_template") {
        return resolvedPostId;
      }
      return (0, import_lock_unlock.unlock)(select(import_core_data.store)).getTemplateId(
        resolvedPostType,
        resolvedPostId
      );
    },
    [resolvedPostType, resolvedPostId]
  );
  const stylesId = (0, import_use_styles_id.useStylesId)({ templateId });
  const { isReady: settingsReady, editorSettings } = (0, import_use_editor_settings.useEditorSettings)({
    stylesId
  });
  const { isReady: assetsReady } = (0, import_use_editor_assets.useEditorAssets)();
  const finalSettings = (0, import_element.useMemo)(
    () => ({
      ...editorSettings,
      ...settings
    }),
    [editorSettings, settings]
  );
  if (!settingsReady || !assetsReady) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {})
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PrivateEditor,
    {
      postType: resolvedPostType,
      postId: resolvedPostId,
      templateId,
      settings: finalSettings,
      styles: finalSettings.styles,
      children: backButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { children: backButton })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Editor
});
//# sourceMappingURL=index.cjs.map
