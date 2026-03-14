// packages/edit-widgets/src/components/sidebar/index.js
import {
  useEffect,
  Platform,
  useContext,
  useCallback
} from "@wordpress/element";
import { isRTL, __ } from "@wordpress/i18n";
import {
  ComplementaryArea,
  store as interfaceStore
} from "@wordpress/interface";
import {
  BlockInspector,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { drawerLeft, drawerRight } from "@wordpress/icons";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import WidgetAreas from "./widget-areas.mjs";
import { store as editWidgetsStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var SIDEBAR_ACTIVE_BY_DEFAULT = Platform.select({
  web: true,
  native: false
});
var BLOCK_INSPECTOR_IDENTIFIER = "edit-widgets/block-inspector";
var WIDGET_AREAS_IDENTIFIER = "edit-widgets/block-areas";
var { Tabs } = unlock(componentsPrivateApis);
function SidebarHeader({ selectedWidgetAreaBlock }) {
  return /* @__PURE__ */ jsxs(Tabs.TabList, { children: [
    /* @__PURE__ */ jsx(Tabs.Tab, { tabId: WIDGET_AREAS_IDENTIFIER, children: selectedWidgetAreaBlock ? selectedWidgetAreaBlock.attributes.name : __("Widget Areas") }),
    /* @__PURE__ */ jsx(Tabs.Tab, { tabId: BLOCK_INSPECTOR_IDENTIFIER, children: __("Block") })
  ] });
}
function SidebarContent({
  hasSelectedNonAreaBlock,
  currentArea,
  isGeneralSidebarOpen,
  selectedWidgetAreaBlock
}) {
  const { enableComplementaryArea } = useDispatch(interfaceStore);
  useEffect(() => {
    if (hasSelectedNonAreaBlock && currentArea === WIDGET_AREAS_IDENTIFIER && isGeneralSidebarOpen) {
      enableComplementaryArea(
        "core/edit-widgets",
        BLOCK_INSPECTOR_IDENTIFIER
      );
    }
    if (!hasSelectedNonAreaBlock && currentArea === BLOCK_INSPECTOR_IDENTIFIER && isGeneralSidebarOpen) {
      enableComplementaryArea(
        "core/edit-widgets",
        WIDGET_AREAS_IDENTIFIER
      );
    }
  }, [hasSelectedNonAreaBlock, enableComplementaryArea]);
  const tabsContextValue = useContext(Tabs.Context);
  return /* @__PURE__ */ jsx(
    ComplementaryArea,
    {
      className: "edit-widgets-sidebar",
      header: /* @__PURE__ */ jsx(Tabs.Context.Provider, { value: tabsContextValue, children: /* @__PURE__ */ jsx(
        SidebarHeader,
        {
          selectedWidgetAreaBlock
        }
      ) }),
      headerClassName: "edit-widgets-sidebar__panel-tabs",
      title: __("Settings"),
      closeLabel: __("Close Settings"),
      scope: "core/edit-widgets",
      identifier: currentArea,
      icon: isRTL() ? drawerLeft : drawerRight,
      isActiveByDefault: SIDEBAR_ACTIVE_BY_DEFAULT,
      children: /* @__PURE__ */ jsxs(Tabs.Context.Provider, { value: tabsContextValue, children: [
        /* @__PURE__ */ jsx(
          Tabs.TabPanel,
          {
            tabId: WIDGET_AREAS_IDENTIFIER,
            focusable: false,
            children: /* @__PURE__ */ jsx(
              WidgetAreas,
              {
                selectedWidgetAreaId: selectedWidgetAreaBlock?.attributes.id
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          Tabs.TabPanel,
          {
            tabId: BLOCK_INSPECTOR_IDENTIFIER,
            focusable: false,
            children: hasSelectedNonAreaBlock ? /* @__PURE__ */ jsx(BlockInspector, {}) : (
              // Pretend that Widget Areas are part of the UI by not
              // showing the Block Inspector when one is selected.
              /* @__PURE__ */ jsx("span", { className: "block-editor-block-inspector__no-blocks", children: __("No block selected.") })
            )
          }
        )
      ] })
    }
  );
}
function Sidebar() {
  const {
    currentArea,
    hasSelectedNonAreaBlock,
    isGeneralSidebarOpen,
    selectedWidgetAreaBlock
  } = useSelect((select) => {
    const { getSelectedBlock, getBlock, getBlockParentsByBlockName } = select(blockEditorStore);
    const { getActiveComplementaryArea } = select(interfaceStore);
    const selectedBlock = getSelectedBlock();
    const activeArea = getActiveComplementaryArea(editWidgetsStore.name);
    let currentSelection = activeArea;
    if (!currentSelection) {
      if (selectedBlock) {
        currentSelection = BLOCK_INSPECTOR_IDENTIFIER;
      } else {
        currentSelection = WIDGET_AREAS_IDENTIFIER;
      }
    }
    let widgetAreaBlock;
    if (selectedBlock) {
      if (selectedBlock.name === "core/widget-area") {
        widgetAreaBlock = selectedBlock;
      } else {
        widgetAreaBlock = getBlock(
          getBlockParentsByBlockName(
            selectedBlock.clientId,
            "core/widget-area"
          )[0]
        );
      }
    }
    return {
      currentArea: currentSelection,
      hasSelectedNonAreaBlock: !!(selectedBlock && selectedBlock.name !== "core/widget-area"),
      isGeneralSidebarOpen: !!activeArea,
      selectedWidgetAreaBlock: widgetAreaBlock
    };
  }, []);
  const { enableComplementaryArea } = useDispatch(interfaceStore);
  const onTabSelect = useCallback(
    (newSelectedTabId) => {
      if (!!newSelectedTabId) {
        enableComplementaryArea(
          editWidgetsStore.name,
          newSelectedTabId
        );
      }
    },
    [enableComplementaryArea]
  );
  return /* @__PURE__ */ jsx(
    Tabs,
    {
      selectedTabId: isGeneralSidebarOpen ? currentArea : null,
      onSelect: onTabSelect,
      selectOnMove: false,
      children: /* @__PURE__ */ jsx(
        SidebarContent,
        {
          hasSelectedNonAreaBlock,
          currentArea,
          isGeneralSidebarOpen,
          selectedWidgetAreaBlock
        }
      )
    }
  );
}
export {
  Sidebar as default
};
//# sourceMappingURL=index.mjs.map
