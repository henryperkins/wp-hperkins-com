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

// packages/editor/src/components/sidebar/index.js
var sidebar_exports = {};
__export(sidebar_exports, {
  default: () => sidebar_default
});
module.exports = __toCommonJS(sidebar_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_components = require("@wordpress/components");
var import_interface = require("@wordpress/interface");
var import_pattern_overrides_panel = __toESM(require("../pattern-overrides-panel/index.cjs"));
var import_plugin_document_setting_panel = __toESM(require("../plugin-document-setting-panel/index.cjs"));
var import_plugin_sidebar = __toESM(require("../plugin-sidebar/index.cjs"));
var import_post_summary = __toESM(require("./post-summary.cjs"));
var import_panel = __toESM(require("../post-taxonomies/panel.cjs"));
var import_post_transform_panel = __toESM(require("../post-transform-panel/index.cjs"));
var import_header = __toESM(require("./header.cjs"));
var import_template_content_panel = __toESM(require("../template-content-panel/index.cjs"));
var import_template_part_content_panel = __toESM(require("../template-part-content-panel/index.cjs"));
var import_media = require("../media/index.cjs");
var import_use_auto_switch_editor_sidebars = __toESM(require("../provider/use-auto-switch-editor-sidebars.cjs"));
var import_constants = require("./constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_constants2 = require("../../store/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var SIDEBAR_ACTIVE_BY_DEFAULT = import_element.Platform.select({
  web: true,
  native: false
});
var SidebarContent = ({
  tabName,
  keyboardShortcut,
  onActionPerformed,
  extraPanels,
  postType
}) => {
  const tabListRef = (0, import_element.useRef)(null);
  const tabsContextValue = (0, import_element.useContext)(Tabs.Context);
  const isAttachment = postType === import_constants2.ATTACHMENT_POST_TYPE;
  const isRevisionsMode = (0, import_data.useSelect)((select) => {
    return (0, import_lock_unlock.unlock)(select(import_store.store)).isRevisionsMode();
  });
  (0, import_element.useEffect)(() => {
    const tabsElements = Array.from(
      tabListRef.current?.querySelectorAll('[role="tab"]') || []
    );
    const selectedTabElement = tabsElements.find(
      // We are purposefully using a custom `data-tab-id` attribute here
      // because we don't want rely on any assumptions about `Tabs`
      // component internals.
      (element) => element.getAttribute("data-tab-id") === tabName
    );
    const activeElement = selectedTabElement?.ownerDocument.activeElement;
    const tabsHasFocus = tabsElements.some((element) => {
      return activeElement && activeElement.id === element.id;
    });
    if (tabsHasFocus && selectedTabElement && selectedTabElement.id !== activeElement?.id) {
      selectedTabElement?.focus();
    }
  }, [tabName]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_plugin_sidebar.default,
    {
      identifier: tabName,
      header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Context.Provider, { value: tabsContextValue, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_header.default, { ref: tabListRef }) }),
      closeLabel: (0, import_i18n.__)("Close Settings"),
      className: "editor-sidebar__panel",
      headerClassName: "editor-sidebar__panel-tabs",
      title: (
        /* translators: button label text should, if possible, be under 16 characters. */
        (0, import_i18n._x)("Settings", "panel button label")
      ),
      toggleShortcut: keyboardShortcut,
      icon: (0, import_i18n.isRTL)() ? import_icons.drawerLeft : import_icons.drawerRight,
      isActiveByDefault: SIDEBAR_ACTIVE_BY_DEFAULT,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs.Context.Provider, { value: tabsContextValue, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabPanel, { tabId: import_constants.sidebars.document, focusable: false, children: isAttachment ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_media.MediaMetadataPanel,
          {
            onActionPerformed
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_post_summary.default,
            {
              onActionPerformed
            }
          ),
          !isRevisionsMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_plugin_document_setting_panel.default.Slot, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_template_content_panel.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_template_part_content_panel.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_transform_panel.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_panel.default, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_pattern_overrides_panel.default, {}),
            extraPanels
          ] })
        ] }) }),
        !isAttachment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabPanel, { tabId: import_constants.sidebars.block, focusable: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockInspector, {}) })
      ] })
    }
  );
};
var Sidebar = ({ extraPanels, onActionPerformed }) => {
  (0, import_use_auto_switch_editor_sidebars.default)();
  const { tabName, keyboardShortcut, showSummary, postType } = (0, import_data.useSelect)(
    (select) => {
      const shortcut = select(
        import_keyboard_shortcuts.store
      ).getShortcutRepresentation("core/editor/toggle-sidebar");
      const sidebar = select(import_interface.store).getActiveComplementaryArea("core");
      const _isEditorSidebarOpened = [
        import_constants.sidebars.block,
        import_constants.sidebars.document
      ].includes(sidebar);
      let _tabName = sidebar;
      if (!_isEditorSidebarOpened) {
        _tabName = !!select(
          import_block_editor.store
        ).getBlockSelectionStart() ? import_constants.sidebars.block : import_constants.sidebars.document;
      }
      const _postType = select(import_store.store).getCurrentPostType();
      return {
        tabName: _tabName,
        keyboardShortcut: shortcut,
        showSummary: ![
          import_constants2.TEMPLATE_POST_TYPE,
          import_constants2.TEMPLATE_PART_POST_TYPE,
          import_constants2.NAVIGATION_POST_TYPE
        ].includes(_postType),
        postType: _postType
      };
    },
    []
  );
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const onTabSelect = (0, import_element.useCallback)(
    (newSelectedTabId) => {
      if (!!newSelectedTabId) {
        enableComplementaryArea("core", newSelectedTabId);
      }
    },
    [enableComplementaryArea]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Tabs,
    {
      selectedTabId: tabName,
      onSelect: onTabSelect,
      selectOnMove: false,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        SidebarContent,
        {
          tabName,
          keyboardShortcut,
          showSummary,
          onActionPerformed,
          extraPanels,
          postType
        }
      )
    }
  );
};
var sidebar_default = Sidebar;
//# sourceMappingURL=index.cjs.map
