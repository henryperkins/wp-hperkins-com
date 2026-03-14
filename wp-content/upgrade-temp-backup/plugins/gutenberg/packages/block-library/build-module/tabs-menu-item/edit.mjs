// packages/block-library/src/tabs-menu-item/edit.js
import clsx from "clsx";
import { __, sprintf } from "@wordpress/i18n";
import {
  useBlockProps,
  store as blockEditorStore,
  RichText
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import slugFromLabel from "../tab/slug-from-label.mjs";
import Controls from "./controls.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Edit({
  context,
  clientId,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const tabIndex = context["core/tabs-menu-item-index"] ?? 0;
  const tabId = context["core/tabs-menu-item-id"] ?? "";
  const tabLabel = context["core/tabs-menu-item-label"] ?? "";
  const tabClientId = context["core/tabs-menu-item-clientId"] ?? "";
  const contextTabsList = context["core/tabs-list"];
  const tabsList = useMemo(
    () => contextTabsList || [],
    [contextTabsList]
  );
  const activeTabIndex = context["core/tabs-activeTabIndex"] ?? 0;
  const editorActiveTabIndex = context["core/tabs-editorActiveTabIndex"];
  const effectiveActiveIndex = useMemo(() => {
    return editorActiveTabIndex ?? activeTabIndex;
  }, [editorActiveTabIndex, activeTabIndex]);
  const isActiveTab = tabIndex === effectiveActiveIndex;
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const { tabsClientId, tabsMenuClientId, selectedTabClientId } = useSelect(
    (select) => {
      const {
        getBlockRootClientId,
        getSelectedBlockClientIds,
        hasSelectedInnerBlock
      } = select(blockEditorStore);
      const _tabsMenuClientId = getBlockRootClientId(clientId);
      const _tabsClientId = _tabsMenuClientId ? getBlockRootClientId(_tabsMenuClientId) : null;
      const selectedIds = getSelectedBlockClientIds();
      let selectedTab = null;
      for (const tab of tabsList) {
        if (selectedIds.includes(tab.clientId) || hasSelectedInnerBlock(tab.clientId, true)) {
          selectedTab = tab.clientId;
          break;
        }
      }
      return {
        tabsClientId: _tabsClientId,
        tabsMenuClientId: _tabsMenuClientId,
        selectedTabClientId: selectedTab
      };
    },
    [clientId, tabsList]
  );
  const isSelectedTab = tabClientId === selectedTabClientId;
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const handleLabelChange = useCallback(
    (newLabel) => {
      if (tabClientId) {
        updateBlockAttributes(tabClientId, {
          label: newLabel,
          anchor: slugFromLabel(newLabel, tabIndex)
        });
      }
    },
    [updateBlockAttributes, tabClientId, tabIndex]
  );
  const handleTabClick = useCallback(
    (event) => {
      event.preventDefault();
      if (tabsClientId && tabIndex !== effectiveActiveIndex) {
        __unstableMarkNextChangeAsNotPersistent();
        updateBlockAttributes(tabsClientId, {
          editorActiveTabIndex: tabIndex
        });
      }
    },
    [
      tabsClientId,
      tabIndex,
      effectiveActiveIndex,
      updateBlockAttributes,
      __unstableMarkNextChangeAsNotPersistent
    ]
  );
  const tabPanelId = tabId || `tab-${tabIndex}`;
  const tabLabelId = `${tabPanelId}--tab`;
  const blockProps = useBlockProps({
    className: clsx(layoutClassNames, {
      "is-active": isActiveTab,
      "is-selected": isSelectedTab
    }),
    "aria-controls": tabPanelId,
    "aria-selected": isActiveTab,
    id: tabLabelId,
    role: "tab",
    tabIndex: -1,
    onClick: handleTabClick
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Controls,
      {
        tabsClientId,
        tabClientId,
        tabIndex,
        tabsCount: tabsList.length,
        tabsMenuClientId
      }
    ),
    /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx(
      RichText,
      {
        tagName: "span",
        withoutInteractiveFormatting: true,
        placeholder: sprintf(
          /* translators: %d is the tab index + 1 */
          __("Tab title %d"),
          tabIndex + 1
        ),
        value: tabLabel || "",
        onChange: handleLabelChange
      }
    ) })
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
