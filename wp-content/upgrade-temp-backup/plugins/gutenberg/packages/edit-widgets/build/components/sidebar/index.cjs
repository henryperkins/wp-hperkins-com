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

// packages/edit-widgets/src/components/sidebar/index.js
var sidebar_exports = {};
__export(sidebar_exports, {
  default: () => Sidebar
});
module.exports = __toCommonJS(sidebar_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_interface = require("@wordpress/interface");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_widget_areas = __toESM(require("./widget-areas.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var SIDEBAR_ACTIVE_BY_DEFAULT = import_element.Platform.select({
  web: true,
  native: false
});
var BLOCK_INSPECTOR_IDENTIFIER = "edit-widgets/block-inspector";
var WIDGET_AREAS_IDENTIFIER = "edit-widgets/block-areas";
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function SidebarHeader({ selectedWidgetAreaBlock }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.TabList, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: WIDGET_AREAS_IDENTIFIER, children: selectedWidgetAreaBlock ? selectedWidgetAreaBlock.attributes.name : (0, import_i18n.__)("Widget Areas") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: BLOCK_INSPECTOR_IDENTIFIER, children: (0, import_i18n.__)("Block") })
  ] });
}
function SidebarContent({
  hasSelectedNonAreaBlock,
  currentArea,
  isGeneralSidebarOpen,
  selectedWidgetAreaBlock
}) {
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  (0, import_element.useEffect)(() => {
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
  const tabsContextValue = (0, import_element.useContext)(Tabs.Context);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_interface.ComplementaryArea,
    {
      className: "edit-widgets-sidebar",
      header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Context.Provider, { value: tabsContextValue, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        SidebarHeader,
        {
          selectedWidgetAreaBlock
        }
      ) }),
      headerClassName: "edit-widgets-sidebar__panel-tabs",
      title: (0, import_i18n.__)("Settings"),
      closeLabel: (0, import_i18n.__)("Close Settings"),
      scope: "core/edit-widgets",
      identifier: currentArea,
      icon: (0, import_i18n.isRTL)() ? import_icons.drawerLeft : import_icons.drawerRight,
      isActiveByDefault: SIDEBAR_ACTIVE_BY_DEFAULT,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.Context.Provider, { value: tabsContextValue, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Tabs.TabPanel,
          {
            tabId: WIDGET_AREAS_IDENTIFIER,
            focusable: false,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_widget_areas.default,
              {
                selectedWidgetAreaId: selectedWidgetAreaBlock?.attributes.id
              }
            )
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Tabs.TabPanel,
          {
            tabId: BLOCK_INSPECTOR_IDENTIFIER,
            focusable: false,
            children: hasSelectedNonAreaBlock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockInspector, {}) : (
              // Pretend that Widget Areas are part of the UI by not
              // showing the Block Inspector when one is selected.
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block-editor-block-inspector__no-blocks", children: (0, import_i18n.__)("No block selected.") })
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
  } = (0, import_data.useSelect)((select) => {
    const { getSelectedBlock, getBlock, getBlockParentsByBlockName } = select(import_block_editor.store);
    const { getActiveComplementaryArea } = select(import_interface.store);
    const selectedBlock = getSelectedBlock();
    const activeArea = getActiveComplementaryArea(import_store.store.name);
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
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const onTabSelect = (0, import_element.useCallback)(
    (newSelectedTabId) => {
      if (!!newSelectedTabId) {
        enableComplementaryArea(
          import_store.store.name,
          newSelectedTabId
        );
      }
    },
    [enableComplementaryArea]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Tabs,
    {
      selectedTabId: isGeneralSidebarOpen ? currentArea : null,
      onSelect: onTabSelect,
      selectOnMove: false,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=index.cjs.map
