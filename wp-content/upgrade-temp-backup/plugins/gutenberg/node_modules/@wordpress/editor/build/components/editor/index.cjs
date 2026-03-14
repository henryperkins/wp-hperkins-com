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

// packages/editor/src/components/editor/index.js
var editor_exports = {};
__export(editor_exports, {
  default: () => editor_default
});
module.exports = __toCommonJS(editor_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
var import_editor_interface = __toESM(require("../editor-interface/index.cjs"));
var import_provider = require("../provider/index.cjs");
var import_sidebar = __toESM(require("../sidebar/index.cjs"));
var import_collab_sidebar = __toESM(require("../collab-sidebar/index.cjs"));
var import_global_styles_sidebar = __toESM(require("../global-styles-sidebar/index.cjs"));
var import_global_styles_renderer = require("../global-styles-renderer/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function Editor({
  postType,
  postId,
  templateId,
  settings,
  children,
  initialEdits,
  // This could be part of the settings.
  onActionPerformed,
  // The following abstractions are not ideal but necessary
  // to account for site editor and post editor differences for now.
  extraContent,
  extraSidebarPanels,
  ...props
}) {
  const {
    post,
    template,
    hasLoadedPost,
    error,
    isBlockTheme,
    showGlobalStyles
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getEntityRecord,
        getResolutionError,
        hasFinishedResolution,
        getCurrentTheme,
        __experimentalGetCurrentGlobalStylesId,
        canUser
      } = select(import_core_data.store);
      const { getRenderingMode, getCurrentPostType } = select(import_store.store);
      const postArgs = ["postType", postType, postId];
      const renderingMode = getRenderingMode();
      const currentPostType = getCurrentPostType();
      const _isBlockTheme = getCurrentTheme()?.is_block_theme;
      const globalStylesId = __experimentalGetCurrentGlobalStylesId();
      const userCanEditGlobalStyles = globalStylesId ? canUser("update", {
        kind: "root",
        name: "globalStyles",
        id: globalStylesId
      }) : false;
      return {
        post: getEntityRecord(...postArgs),
        template: templateId ? getEntityRecord(
          "postType",
          import_constants.TEMPLATE_POST_TYPE,
          templateId
        ) : void 0,
        hasLoadedPost: hasFinishedResolution(
          "getEntityRecord",
          postArgs
        ),
        error: getResolutionError("getEntityRecord", postArgs)?.message,
        isBlockTheme: _isBlockTheme,
        showGlobalStyles: _isBlockTheme && userCanEditGlobalStyles && (currentPostType === "wp_template" || renderingMode === "template-locked")
      };
    },
    [postType, postId, templateId]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    hasLoadedPost && !post && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Notice,
      {
        status: !!error ? "error" : "warning",
        isDismissible: false,
        children: !error ? (0, import_i18n.__)(
          "You attempted to edit an item that doesn't exist. Perhaps it was deleted?"
        ) : error
      }
    ),
    !!post && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_provider.ExperimentalEditorProvider,
      {
        post,
        __unstableTemplate: template,
        settings,
        initialEdits,
        useSubRegistry: false,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor_interface.default, { ...props, children: extraContent }),
          children,
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_sidebar.default,
            {
              onActionPerformed,
              extraPanels: extraSidebarPanels
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_collab_sidebar.default, {}),
          isBlockTheme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_global_styles_renderer.GlobalStylesRenderer, {}),
          showGlobalStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_global_styles_sidebar.default, {})
        ]
      }
    )
  ] });
}
var editor_default = Editor;
//# sourceMappingURL=index.cjs.map
