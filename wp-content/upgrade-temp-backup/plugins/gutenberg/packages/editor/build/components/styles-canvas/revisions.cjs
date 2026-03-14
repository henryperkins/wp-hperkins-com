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

// packages/editor/src/components/styles-canvas/revisions.js
var revisions_exports = {};
__export(revisions_exports, {
  default: () => revisions_default
});
module.exports = __toCommonJS(revisions_exports);
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_global_styles_ui = require("@wordpress/global-styles-ui");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_hooks = require("../global-styles/hooks.cjs");
var import_use_global_styles_output = require("../../hooks/use-global-styles-output.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var {
  ExperimentalBlockEditorProvider,
  __unstableBlockStyleVariationOverridesWithConfig
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function isObjectEmpty(object) {
  return !object || Object.keys(object).length === 0;
}
function StylesCanvasRevisions({ path }, ref) {
  const blocks = (0, import_data.useSelect)((select) => {
    return select(import_block_editor.store).getBlocks();
  }, []);
  const { user: userConfig, base: baseConfig } = (0, import_hooks.useGlobalStyles)();
  const { revisions, isLoading } = (0, import_global_styles_ui.useGlobalStylesRevisions)();
  const revisionId = (0, import_element.useMemo)(() => {
    const match = path?.match(/^\/revisions\/(.+)$/);
    return match ? match[1] : null;
  }, [path]);
  const selectedRevision = (0, import_element.useMemo)(() => {
    if (!revisionId || !revisions.length) {
      return null;
    }
    return revisions.find(
      (rev) => String(rev.id) === String(revisionId)
    );
  }, [revisionId, revisions]);
  const displayConfig = selectedRevision || userConfig;
  const mergedConfig = (0, import_element.useMemo)(() => {
    if (!isObjectEmpty(displayConfig) && !isObjectEmpty(baseConfig)) {
      return (0, import_global_styles_engine.mergeGlobalStyles)(baseConfig, displayConfig);
    }
    return {};
  }, [baseConfig, displayConfig]);
  const renderedBlocksArray = (0, import_element.useMemo)(
    () => Array.isArray(blocks) ? blocks : [blocks],
    [blocks]
  );
  const originalSettings = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getSettings(),
    []
  );
  const settings = (0, import_element.useMemo)(
    () => ({
      ...originalSettings,
      isPreviewMode: true
    }),
    [originalSettings]
  );
  const [globalStyles] = (0, import_use_global_styles_output.useGlobalStylesOutputWithConfig)(mergedConfig);
  const editorStyles = !isObjectEmpty(globalStyles) && !isObjectEmpty(displayConfig) ? globalStyles : settings.styles;
  if (isLoading) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_block_editor.__unstableIframe,
    {
      ref,
      className: "editor-revisions__iframe",
      name: "revisions",
      tabIndex: 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
          // Forming a "block formatting context" to prevent margin collapsing.
          // @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context
          children: `.is-root-container { display: flow-root; }`
        }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Disabled, { className: "editor-revisions__example-preview__content", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          ExperimentalBlockEditorProvider,
          {
            value: renderedBlocksArray,
            settings,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockList, { renderAppender: false }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableEditorStyles, { styles: editorStyles }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                __unstableBlockStyleVariationOverridesWithConfig,
                {
                  config: mergedConfig
                }
              )
            ]
          }
        ) })
      ]
    }
  );
}
var revisions_default = (0, import_element.forwardRef)(StylesCanvasRevisions);
//# sourceMappingURL=revisions.cjs.map
