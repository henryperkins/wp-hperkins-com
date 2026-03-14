// packages/customize-widgets/src/index.js
import { createRoot, StrictMode } from "@wordpress/element";
import {
  registerCoreBlocks,
  __experimentalGetCoreBlocks,
  __experimentalRegisterExperimentalCoreBlocks
} from "@wordpress/block-library";
import {
  registerLegacyWidgetBlock,
  registerLegacyWidgetVariations,
  registerWidgetGroupBlock
} from "@wordpress/widgets";
import {
  setFreeformContentHandlerName,
  store as blocksStore
} from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import CustomizeWidgets from "./components/customize-widgets/index.mjs";
import getSidebarSection from "./controls/sidebar-section.mjs";
import getSidebarControl from "./controls/sidebar-control.mjs";
import "./filters/index.mjs";
import { store } from "./store/index.mjs";
import { jsx } from "react/jsx-runtime";
var { wp } = window;
var DISABLED_BLOCKS = [
  "core/more",
  "core/block",
  "core/freeform",
  "core/template-part"
];
var ENABLE_EXPERIMENTAL_FSE_BLOCKS = false;
function initialize(editorName, blockEditorSettings) {
  dispatch(preferencesStore).setDefaults("core/customize-widgets", {
    fixedToolbar: false,
    welcomeGuide: true
  });
  dispatch(blocksStore).reapplyBlockTypeFilters();
  const coreBlocks = __experimentalGetCoreBlocks().filter((block) => {
    return !(DISABLED_BLOCKS.includes(block.name) || block.name.startsWith("core/post") || block.name.startsWith("core/query") || block.name.startsWith("core/site") || block.name.startsWith("core/navigation") || block.name.startsWith("core/term"));
  });
  registerCoreBlocks(coreBlocks);
  registerLegacyWidgetBlock();
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    __experimentalRegisterExperimentalCoreBlocks({
      enableFSEBlocks: ENABLE_EXPERIMENTAL_FSE_BLOCKS
    });
  }
  registerLegacyWidgetVariations(blockEditorSettings);
  registerWidgetGroupBlock();
  setFreeformContentHandlerName("core/html");
  const SidebarControl = getSidebarControl(blockEditorSettings);
  wp.customize.sectionConstructor.sidebar = getSidebarSection();
  wp.customize.controlConstructor.sidebar_block_editor = SidebarControl;
  const container = document.createElement("div");
  document.body.appendChild(container);
  wp.customize.bind("ready", () => {
    const sidebarControls = [];
    wp.customize.control.each((control) => {
      if (control instanceof SidebarControl) {
        sidebarControls.push(control);
      }
    });
    createRoot(container).render(
      /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(
        CustomizeWidgets,
        {
          api: wp.customize,
          sidebarControls,
          blockEditorSettings
        }
      ) })
    );
  });
}
export {
  initialize,
  store
};
//# sourceMappingURL=index.mjs.map
