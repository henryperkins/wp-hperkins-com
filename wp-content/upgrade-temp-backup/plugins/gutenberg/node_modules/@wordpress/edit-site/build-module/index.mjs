// packages/edit-site/src/index.js
import { store as blocksStore } from "@wordpress/blocks";
import {
  registerCoreBlocks,
  __experimentalGetCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks
} from "@wordpress/block-library";
import { dispatch } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { createRoot, StrictMode } from "@wordpress/element";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  registerLegacyWidgetBlock,
  registerWidgetGroupBlock
} from "@wordpress/widgets";
import { store as editSiteStore } from "./store/index.mjs";
import { unlock } from "./lock-unlock.mjs";
import App from "./components/app/index.mjs";
import { default as default2 } from "./components/plugin-template-setting-panel/index.mjs";
import { store } from "./store/index.mjs";
export * from "./deprecated.mjs";
import { jsx } from "react/jsx-runtime";
var { registerCoreBlockBindingsSources } = unlock(editorPrivateApis);
function initializeEditor(id, settings) {
  const target = document.getElementById(id);
  const root = createRoot(target);
  dispatch(blocksStore).reapplyBlockTypeFilters();
  const coreBlocks = __experimentalGetCoreBlocks().filter(
    ({ name }) => name !== "core/freeform"
  );
  registerCoreBlocks(coreBlocks);
  registerCoreBlockBindingsSources();
  dispatch(blocksStore).setFreeformFallbackBlockName("core/html");
  registerLegacyWidgetBlock({ inserter: false });
  registerWidgetGroupBlock({ inserter: false });
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    __experimentalRegisterExperimentalCoreBlocks({
      enableFSEBlocks: true
    });
  }
  dispatch(preferencesStore).setDefaults("core/edit-site", {
    welcomeGuide: true,
    welcomeGuideStyles: true,
    welcomeGuidePage: true,
    welcomeGuideTemplate: true
  });
  dispatch(preferencesStore).setDefaults("core", {
    allowRightClickOverrides: true,
    distractionFree: false,
    editorMode: "visual",
    editorTool: "edit",
    fixedToolbar: false,
    focusMode: false,
    inactivePanels: [],
    keepCaretInsideBlock: false,
    openPanels: ["post-status"],
    showBlockBreadcrumbs: true,
    showListViewByDefault: false,
    enableChoosePatternModal: true
  });
  if (window.__clientSideMediaProcessing) {
    dispatch(preferencesStore).setDefaults("core/media", {
      requireApproval: true,
      optimizeOnUpload: true
    });
  }
  dispatch(editSiteStore).updateSettings(settings);
  window.addEventListener("dragover", (e) => e.preventDefault(), false);
  window.addEventListener("drop", (e) => e.preventDefault(), false);
  root.render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(App, {}) })
  );
  return root;
}
function reinitializeEditor() {
  deprecated("wp.editSite.reinitializeEditor", {
    since: "6.2",
    version: "6.3"
  });
}
export {
  default2 as PluginTemplateSettingPanel,
  initializeEditor,
  reinitializeEditor,
  store
};
//# sourceMappingURL=index.mjs.map
