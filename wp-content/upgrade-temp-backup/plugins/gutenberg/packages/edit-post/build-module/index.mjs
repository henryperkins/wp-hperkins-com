// packages/edit-post/src/index.js
import { store as blocksStore } from "@wordpress/blocks";
import {
  registerCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks
} from "@wordpress/block-library";
import deprecated from "@wordpress/deprecated";
import { createRoot, StrictMode } from "@wordpress/element";
import { dispatch, select } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  registerLegacyWidgetBlock,
  registerWidgetGroupBlock
} from "@wordpress/widgets";
import {
  store as editorStore,
  privateApis as editorPrivateApis
} from "@wordpress/editor";
import Layout from "./components/layout/index.mjs";
import { unlock } from "./lock-unlock.mjs";
import { default as default2 } from "./components/back-button/fullscreen-mode-close.mjs";
import { store } from "./store/index.mjs";
export * from "./deprecated.mjs";
import { jsx } from "react/jsx-runtime";
var {
  BackButton: __experimentalMainDashboardButton,
  registerCoreBlockBindingsSources
} = unlock(editorPrivateApis);
function initializeEditor(id, postType, postId, settings, initialEdits) {
  const isMediumOrBigger = window.matchMedia("(min-width: 782px)").matches;
  const target = document.getElementById(id);
  const root = createRoot(target);
  dispatch(preferencesStore).setDefaults("core/edit-post", {
    fullscreenMode: true,
    themeStyles: true,
    welcomeGuide: true,
    welcomeGuideTemplate: true
  });
  dispatch(preferencesStore).setDefaults("core", {
    allowRightClickOverrides: true,
    editorMode: "visual",
    editorTool: "edit",
    fixedToolbar: false,
    hiddenBlockTypes: [],
    inactivePanels: [],
    openPanels: ["post-status"],
    showBlockBreadcrumbs: true,
    showIconLabels: false,
    showListViewByDefault: false,
    enableChoosePatternModal: true,
    isPublishSidebarEnabled: true
  });
  if (window.__clientSideMediaProcessing) {
    dispatch(preferencesStore).setDefaults("core/media", {
      requireApproval: true,
      optimizeOnUpload: true
    });
  }
  dispatch(blocksStore).reapplyBlockTypeFilters();
  if (isMediumOrBigger && select(preferencesStore).get("core", "showListViewByDefault") && !select(preferencesStore).get("core", "distractionFree")) {
    dispatch(editorStore).setIsListViewOpened(true);
  }
  registerCoreBlocks();
  registerCoreBlockBindingsSources();
  registerLegacyWidgetBlock({ inserter: false });
  registerWidgetGroupBlock({ inserter: false });
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    __experimentalRegisterExperimentalCoreBlocks({
      enableFSEBlocks: settings.__unstableEnableFullSiteEditingBlocks
    });
  }
  const documentMode = document.compatMode === "CSS1Compat" ? "Standards" : "Quirks";
  if (documentMode !== "Standards") {
    console.warn(
      "Your browser is using Quirks Mode. \nThis can cause rendering issues such as blocks overlaying meta boxes in the editor. Quirks Mode can be triggered by PHP errors or HTML code appearing before the opening <!DOCTYPE html>. Try checking the raw page source or your site's PHP error log and resolving errors there, removing any HTML before the doctype, or disabling plugins."
    );
  }
  const isIphone = window.navigator.userAgent.indexOf("iPhone") !== -1;
  if (isIphone) {
    window.addEventListener("scroll", (event) => {
      const editorScrollContainer = document.getElementsByClassName(
        "interface-interface-skeleton__body"
      )[0];
      if (event.target === document) {
        if (window.scrollY > 100) {
          editorScrollContainer.scrollTop = editorScrollContainer.scrollTop + window.scrollY;
        }
        if (document.getElementsByClassName("is-mode-visual")[0]) {
          window.scrollTo(0, 0);
        }
      }
    });
  }
  window.addEventListener("dragover", (e) => e.preventDefault(), false);
  window.addEventListener("drop", (e) => e.preventDefault(), false);
  root.render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(
      Layout,
      {
        settings,
        postId,
        postType,
        initialEdits
      }
    ) })
  );
  return root;
}
function reinitializeEditor() {
  deprecated("wp.editPost.reinitializeEditor", {
    since: "6.2",
    version: "6.3"
  });
}
export {
  default2 as __experimentalFullscreenModeClose,
  __experimentalMainDashboardButton,
  initializeEditor,
  reinitializeEditor,
  store
};
//# sourceMappingURL=index.mjs.map
