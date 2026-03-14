// packages/editor/src/components/sidebar/index.js
import {
  BlockInspector,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  Platform,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "@wordpress/element";
import { isRTL, __, _x } from "@wordpress/i18n";
import { drawerLeft, drawerRight } from "@wordpress/icons";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { store as interfaceStore } from "@wordpress/interface";
import PatternOverridesPanel from "../pattern-overrides-panel/index.mjs";
import PluginDocumentSettingPanel from "../plugin-document-setting-panel/index.mjs";
import PluginSidebar from "../plugin-sidebar/index.mjs";
import PostSummary from "./post-summary.mjs";
import PostTaxonomiesPanel from "../post-taxonomies/panel.mjs";
import PostTransformPanel from "../post-transform-panel/index.mjs";
import SidebarHeader from "./header.mjs";
import TemplateContentPanel from "../template-content-panel/index.mjs";
import TemplatePartContentPanel from "../template-part-content-panel/index.mjs";
import { MediaMetadataPanel } from "../media/index.mjs";
import useAutoSwitchEditorSidebars from "../provider/use-auto-switch-editor-sidebars.mjs";
import { sidebars } from "./constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
import {
  ATTACHMENT_POST_TYPE,
  NAVIGATION_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  TEMPLATE_POST_TYPE
} from "../../store/constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
var SIDEBAR_ACTIVE_BY_DEFAULT = Platform.select({
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
  const tabListRef = useRef(null);
  const tabsContextValue = useContext(Tabs.Context);
  const isAttachment = postType === ATTACHMENT_POST_TYPE;
  const isRevisionsMode = useSelect((select) => {
    return unlock(select(editorStore)).isRevisionsMode();
  });
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
    PluginSidebar,
    {
      identifier: tabName,
      header: /* @__PURE__ */ jsx(Tabs.Context.Provider, { value: tabsContextValue, children: /* @__PURE__ */ jsx(SidebarHeader, { ref: tabListRef }) }),
      closeLabel: __("Close Settings"),
      className: "editor-sidebar__panel",
      headerClassName: "editor-sidebar__panel-tabs",
      title: (
        /* translators: button label text should, if possible, be under 16 characters. */
        _x("Settings", "panel button label")
      ),
      toggleShortcut: keyboardShortcut,
      icon: isRTL() ? drawerLeft : drawerRight,
      isActiveByDefault: SIDEBAR_ACTIVE_BY_DEFAULT,
      children: /* @__PURE__ */ jsxs(Tabs.Context.Provider, { value: tabsContextValue, children: [
        /* @__PURE__ */ jsx(Tabs.TabPanel, { tabId: sidebars.document, focusable: false, children: isAttachment ? /* @__PURE__ */ jsx(
          MediaMetadataPanel,
          {
            onActionPerformed
          }
        ) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            PostSummary,
            {
              onActionPerformed
            }
          ),
          !isRevisionsMode && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(PluginDocumentSettingPanel.Slot, {}),
            /* @__PURE__ */ jsx(TemplateContentPanel, {}),
            /* @__PURE__ */ jsx(TemplatePartContentPanel, {}),
            /* @__PURE__ */ jsx(PostTransformPanel, {}),
            /* @__PURE__ */ jsx(PostTaxonomiesPanel, {}),
            /* @__PURE__ */ jsx(PatternOverridesPanel, {}),
            extraPanels
          ] })
        ] }) }),
        !isAttachment && /* @__PURE__ */ jsx(Tabs.TabPanel, { tabId: sidebars.block, focusable: false, children: /* @__PURE__ */ jsx(BlockInspector, {}) })
      ] })
    }
  );
};
var Sidebar = ({ extraPanels, onActionPerformed }) => {
  useAutoSwitchEditorSidebars();
  const { tabName, keyboardShortcut, showSummary, postType } = useSelect(
    (select) => {
      const shortcut = select(
        keyboardShortcutsStore
      ).getShortcutRepresentation("core/editor/toggle-sidebar");
      const sidebar = select(interfaceStore).getActiveComplementaryArea("core");
      const _isEditorSidebarOpened = [
        sidebars.block,
        sidebars.document
      ].includes(sidebar);
      let _tabName = sidebar;
      if (!_isEditorSidebarOpened) {
        _tabName = !!select(
          blockEditorStore
        ).getBlockSelectionStart() ? sidebars.block : sidebars.document;
      }
      const _postType = select(editorStore).getCurrentPostType();
      return {
        tabName: _tabName,
        keyboardShortcut: shortcut,
        showSummary: ![
          TEMPLATE_POST_TYPE,
          TEMPLATE_PART_POST_TYPE,
          NAVIGATION_POST_TYPE
        ].includes(_postType),
        postType: _postType
      };
    },
    []
  );
  const { enableComplementaryArea } = useDispatch(interfaceStore);
  const onTabSelect = useCallback(
    (newSelectedTabId) => {
      if (!!newSelectedTabId) {
        enableComplementaryArea("core", newSelectedTabId);
      }
    },
    [enableComplementaryArea]
  );
  return /* @__PURE__ */ jsx(
    Tabs,
    {
      selectedTabId: tabName,
      onSelect: onTabSelect,
      selectOnMove: false,
      children: /* @__PURE__ */ jsx(
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
export {
  sidebar_default as default
};
//# sourceMappingURL=index.mjs.map
