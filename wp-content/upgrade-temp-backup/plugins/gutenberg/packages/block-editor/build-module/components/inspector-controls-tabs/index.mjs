// packages/block-editor/src/components/inspector-controls-tabs/index.js
import {
  Icon,
  Tooltip,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useEffect, useState, useRef } from "@wordpress/element";
import { store as preferencesStore } from "@wordpress/preferences";
import { useSelect, useDispatch } from "@wordpress/data";
import { TAB_SETTINGS, TAB_STYLES, TAB_LIST_VIEW, TAB_CONTENT } from "./utils.mjs";
import SettingsTab from "./settings-tab.mjs";
import StylesTab from "./styles-tab.mjs";
import ContentTab from "./content-tab.mjs";
import { ListViewContentPopover } from "../inspector-controls/list-view-content-popover.mjs";
import InspectorControls from "../inspector-controls/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
function InspectorControlsTabs({
  blockName,
  clientId,
  hasBlockStyles,
  tabs,
  isSectionBlock,
  contentClientIds
}) {
  const listViewRef = useRef(null);
  const showIconLabels = useSelect((select) => {
    return select(preferencesStore).get("core", "showIconLabels");
  }, []);
  const { requestedTab } = useSelect((select) => ({
    requestedTab: unlock(
      select(blockEditorStore)
    ).getRequestedInspectorTab()
  }));
  const [selectedTabId, setSelectedTabId] = useState(
    () => requestedTab?.tabName ?? tabs[0]?.name
  );
  const hasUserSelectionRef = useRef(false);
  const isProgrammaticSwitchRef = useRef(false);
  const {
    __unstableSetOpenListViewPanel: setOpenListViewPanel,
    __unstableIncrementListViewExpandRevision: incrementListViewExpandRevision,
    __unstableSetAllListViewPanelsOpen: setAllListViewPanelsOpen
  } = useDispatch(blockEditorStore);
  const { clearRequestedInspectorTab } = unlock(
    useDispatch(blockEditorStore)
  );
  useEffect(() => {
    hasUserSelectionRef.current = false;
  }, [clientId]);
  useEffect(() => {
    if (!requestedTab) {
      return;
    }
    setSelectedTabId(requestedTab.tabName);
    if (requestedTab.tabName === TAB_LIST_VIEW.name && requestedTab.options?.openPanel) {
      setOpenListViewPanel(requestedTab.options.openPanel);
      incrementListViewExpandRevision();
    }
    isProgrammaticSwitchRef.current = true;
    hasUserSelectionRef.current = true;
    clearRequestedInspectorTab();
  }, [
    requestedTab,
    setOpenListViewPanel,
    incrementListViewExpandRevision,
    clearRequestedInspectorTab
  ]);
  useEffect(() => {
    if (selectedTabId === TAB_LIST_VIEW.name && !hasUserSelectionRef.current) {
      setAllListViewPanelsOpen();
      incrementListViewExpandRevision();
    }
  }, [
    clientId,
    selectedTabId,
    setAllListViewPanelsOpen,
    incrementListViewExpandRevision
  ]);
  useEffect(() => {
    if (!tabs?.length || hasUserSelectionRef.current && tabs.some((tab) => tab.name === selectedTabId)) {
      return;
    }
    const firstTabName = tabs[0]?.name;
    if (selectedTabId !== firstTabName) {
      setSelectedTabId(firstTabName);
    }
  }, [tabs, selectedTabId]);
  const handleTabSelect = (tabId) => {
    setSelectedTabId(tabId);
    hasUserSelectionRef.current = true;
    if (tabId === TAB_LIST_VIEW.name && !isProgrammaticSwitchRef.current) {
      setAllListViewPanelsOpen();
      incrementListViewExpandRevision();
    }
    isProgrammaticSwitchRef.current = false;
  };
  const hasListViewTab = tabs.some(
    (tab) => tab.name === TAB_LIST_VIEW.name
  );
  const switchToListView = (targetClientId) => {
    if (hasListViewTab) {
      setOpenListViewPanel(targetClientId);
      incrementListViewExpandRevision();
      isProgrammaticSwitchRef.current = true;
      handleTabSelect(TAB_LIST_VIEW.name);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "block-editor-block-inspector__tabs", children: /* @__PURE__ */ jsxs(
    Tabs,
    {
      selectedTabId,
      onSelect: handleTabSelect,
      children: [
        /* @__PURE__ */ jsx(Tabs.TabList, { children: tabs.map(
          (tab) => showIconLabels ? /* @__PURE__ */ jsx(Tabs.Tab, { tabId: tab.name, children: tab.title }, tab.name) : /* @__PURE__ */ jsx(Tooltip, { text: tab.title, children: /* @__PURE__ */ jsx(
            Tabs.Tab,
            {
              tabId: tab.name,
              "aria-label": tab.title,
              children: /* @__PURE__ */ jsx(Icon, { icon: tab.icon })
            }
          ) }, tab.name)
        ) }),
        /* @__PURE__ */ jsxs(Tabs.TabPanel, { tabId: TAB_CONTENT.name, focusable: false, children: [
          /* @__PURE__ */ jsx(
            ContentTab,
            {
              contentClientIds,
              onSwitchToListView: switchToListView,
              hasListViewTab
            }
          ),
          /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "content" })
        ] }),
        /* @__PURE__ */ jsxs(Tabs.TabPanel, { tabId: TAB_LIST_VIEW.name, focusable: false, children: [
          /* @__PURE__ */ jsx(InspectorControls.Slot, { group: "list", ref: listViewRef }),
          /* @__PURE__ */ jsx(ListViewContentPopover, { listViewRef })
        ] }),
        /* @__PURE__ */ jsx(Tabs.TabPanel, { tabId: TAB_SETTINGS.name, focusable: false, children: /* @__PURE__ */ jsx(SettingsTab, { showAdvancedControls: !!blockName }) }),
        /* @__PURE__ */ jsx(Tabs.TabPanel, { tabId: TAB_STYLES.name, focusable: false, children: /* @__PURE__ */ jsx(
          StylesTab,
          {
            blockName,
            clientId,
            hasBlockStyles,
            isSectionBlock,
            contentClientIds
          }
        ) })
      ]
    },
    clientId
  ) });
}
export {
  InspectorControlsTabs as default
};
//# sourceMappingURL=index.mjs.map
