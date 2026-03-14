// packages/edit-widgets/src/index.js
import {
  registerBlockType,
  unstable__bootstrapServerSideBlockDefinitions,
  setFreeformContentHandlerName,
  store as blocksStore
} from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { StrictMode, createRoot } from "@wordpress/element";
import {
  registerCoreBlocks,
  __experimentalGetCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks
} from "@wordpress/block-library";
import { __experimentalFetchLinkSuggestions as fetchLinkSuggestions } from "@wordpress/core-data";
import {
  registerLegacyWidgetBlock,
  registerLegacyWidgetVariations,
  registerWidgetGroupBlock
} from "@wordpress/widgets";
import { store as preferencesStore } from "@wordpress/preferences";
import "./store/index.mjs";
import "./filters/index.mjs";
import * as widgetArea from "./blocks/widget-area/index.mjs";
import Layout from "./components/layout/index.mjs";
import {
  ALLOW_REUSABLE_BLOCKS,
  ENABLE_EXPERIMENTAL_FSE_BLOCKS
} from "./constants.mjs";
import { store } from "./store/index.mjs";
import { jsx } from "react/jsx-runtime";
var disabledBlocks = [
  "core/more",
  "core/freeform",
  "core/template-part",
  ...ALLOW_REUSABLE_BLOCKS ? [] : ["core/block"]
];
function initializeEditor(id, settings) {
  const target = document.getElementById(id);
  const root = createRoot(target);
  const coreBlocks = __experimentalGetCoreBlocks().filter((block) => {
    return !(disabledBlocks.includes(block.name) || block.name.startsWith("core/post") || block.name.startsWith("core/query") || block.name.startsWith("core/site") || block.name.startsWith("core/navigation") || block.name.startsWith("core/term"));
  });
  dispatch(preferencesStore).setDefaults("core/edit-widgets", {
    fixedToolbar: false,
    welcomeGuide: true,
    showBlockBreadcrumbs: true,
    themeStyles: true
  });
  dispatch(blocksStore).reapplyBlockTypeFilters();
  registerCoreBlocks(coreBlocks);
  registerLegacyWidgetBlock();
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    __experimentalRegisterExperimentalCoreBlocks({
      enableFSEBlocks: ENABLE_EXPERIMENTAL_FSE_BLOCKS
    });
  }
  registerLegacyWidgetVariations(settings);
  registerBlock(widgetArea);
  registerWidgetGroupBlock();
  settings.__experimentalFetchLinkSuggestions = (search, searchOptions) => fetchLinkSuggestions(search, searchOptions, settings);
  setFreeformContentHandlerName("core/html");
  root.render(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(Layout, { blockEditorSettings: settings }) })
  );
  return root;
}
var initialize = initializeEditor;
function reinitializeEditor() {
  deprecated("wp.editWidgets.reinitializeEditor", {
    since: "6.2",
    version: "6.3"
  });
}
var registerBlock = (block) => {
  if (!block) {
    return;
  }
  const { metadata, settings, name } = block;
  if (metadata) {
    unstable__bootstrapServerSideBlockDefinitions({ [name]: metadata });
  }
  registerBlockType(name, settings);
};
export {
  initialize,
  initializeEditor,
  reinitializeEditor,
  store
};
//# sourceMappingURL=index.mjs.map
