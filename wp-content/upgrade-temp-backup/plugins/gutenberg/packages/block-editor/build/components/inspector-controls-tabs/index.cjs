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

// packages/block-editor/src/components/inspector-controls-tabs/index.js
var inspector_controls_tabs_exports = {};
__export(inspector_controls_tabs_exports, {
  default: () => InspectorControlsTabs
});
module.exports = __toCommonJS(inspector_controls_tabs_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_data = require("@wordpress/data");
var import_utils = require("./utils.cjs");
var import_settings_tab = __toESM(require("./settings-tab.cjs"));
var import_styles_tab = __toESM(require("./styles-tab.cjs"));
var import_content_tab = __toESM(require("./content-tab.cjs"));
var import_list_view_content_popover = require("../inspector-controls/list-view-content-popover.cjs");
var import_inspector_controls = __toESM(require("../inspector-controls/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function InspectorControlsTabs({
  blockName,
  clientId,
  hasBlockStyles,
  tabs,
  isSectionBlock,
  contentClientIds
}) {
  const listViewRef = (0, import_element.useRef)(null);
  const showIconLabels = (0, import_data.useSelect)((select) => {
    return select(import_preferences.store).get("core", "showIconLabels");
  }, []);
  const { requestedTab } = (0, import_data.useSelect)((select) => ({
    requestedTab: (0, import_lock_unlock.unlock)(
      select(import_store.store)
    ).getRequestedInspectorTab()
  }));
  const [selectedTabId, setSelectedTabId] = (0, import_element.useState)(
    () => requestedTab?.tabName ?? tabs[0]?.name
  );
  const hasUserSelectionRef = (0, import_element.useRef)(false);
  const isProgrammaticSwitchRef = (0, import_element.useRef)(false);
  const {
    __unstableSetOpenListViewPanel: setOpenListViewPanel,
    __unstableIncrementListViewExpandRevision: incrementListViewExpandRevision,
    __unstableSetAllListViewPanelsOpen: setAllListViewPanelsOpen
  } = (0, import_data.useDispatch)(import_store.store);
  const { clearRequestedInspectorTab } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  (0, import_element.useEffect)(() => {
    hasUserSelectionRef.current = false;
  }, [clientId]);
  (0, import_element.useEffect)(() => {
    if (!requestedTab) {
      return;
    }
    setSelectedTabId(requestedTab.tabName);
    if (requestedTab.tabName === import_utils.TAB_LIST_VIEW.name && requestedTab.options?.openPanel) {
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
  (0, import_element.useEffect)(() => {
    if (selectedTabId === import_utils.TAB_LIST_VIEW.name && !hasUserSelectionRef.current) {
      setAllListViewPanelsOpen();
      incrementListViewExpandRevision();
    }
  }, [
    clientId,
    selectedTabId,
    setAllListViewPanelsOpen,
    incrementListViewExpandRevision
  ]);
  (0, import_element.useEffect)(() => {
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
    if (tabId === import_utils.TAB_LIST_VIEW.name && !isProgrammaticSwitchRef.current) {
      setAllListViewPanelsOpen();
      incrementListViewExpandRevision();
    }
    isProgrammaticSwitchRef.current = false;
  };
  const hasListViewTab = tabs.some(
    (tab) => tab.name === import_utils.TAB_LIST_VIEW.name
  );
  const switchToListView = (targetClientId) => {
    if (hasListViewTab) {
      setOpenListViewPanel(targetClientId);
      incrementListViewExpandRevision();
      isProgrammaticSwitchRef.current = true;
      handleTabSelect(import_utils.TAB_LIST_VIEW.name);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-block-inspector__tabs", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    Tabs,
    {
      selectedTabId,
      onSelect: handleTabSelect,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabList, { children: tabs.map(
          (tab) => showIconLabels ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: tab.name, children: tab.title }, tab.name) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: tab.title, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Tabs.Tab,
            {
              tabId: tab.name,
              "aria-label": tab.title,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: tab.icon })
            }
          ) }, tab.name)
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.TabPanel, { tabId: import_utils.TAB_CONTENT.name, focusable: false, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_content_tab.default,
            {
              contentClientIds,
              onSwitchToListView: switchToListView,
              hasListViewTab
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "content" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.TabPanel, { tabId: import_utils.TAB_LIST_VIEW.name, focusable: false, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "list", ref: listViewRef }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_list_view_content_popover.ListViewContentPopover, { listViewRef })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabPanel, { tabId: import_utils.TAB_SETTINGS.name, focusable: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_settings_tab.default, { showAdvancedControls: !!blockName }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabPanel, { tabId: import_utils.TAB_STYLES.name, focusable: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_styles_tab.default,
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
//# sourceMappingURL=index.cjs.map
