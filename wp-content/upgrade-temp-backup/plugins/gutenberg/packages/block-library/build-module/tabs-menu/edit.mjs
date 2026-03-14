// packages/block-library/src/tabs-menu/edit.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  useInnerBlocksProps,
  BlockContextProvider,
  __experimentalUseBlockPreview as useBlockPreview,
  store as blockEditorStore,
  useBlockEditContext
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  memo,
  useMemo,
  useState,
  useEffect,
  useCallback
} from "@wordpress/element";
import AddTabToolbarControl from "../tab/add-tab-toolbar-control.mjs";
import RemoveTabToolbarControl from "../tab/remove-tab-toolbar-control.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var TABS_MENU_ITEM_TEMPLATE = [["core/tabs-menu-item", {}]];
var EMPTY_ARRAY = [];
function TabsMenuItemPreview({
  blocks,
  blockContextId,
  isHidden,
  setActiveBlockContextId
}) {
  const blockPreviewProps = useBlockPreview({ blocks });
  const handleOnClick = () => {
    setActiveBlockContextId(blockContextId);
  };
  const style = {
    display: isHidden ? "none" : "flex"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...blockPreviewProps,
      tabIndex: 0,
      role: "button",
      onClick: handleOnClick,
      onKeyDown: handleOnClick,
      style
    }
  );
}
var MemoizedTabsMenuItemPreview = memo(TabsMenuItemPreview);
function TabsMenuItemTemplateBlocks({ wrapperProps = {}, layout }) {
  const innerBlocksProps = useInnerBlocksProps(wrapperProps, {
    template: TABS_MENU_ITEM_TEMPLATE,
    templateLock: "all",
    renderAppender: false,
    layout
  });
  return innerBlocksProps.children;
}
function Edit({
  context,
  clientId,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const { layout } = useBlockEditContext();
  const tabsId = context["core/tabs-id"] || null;
  const tabsList = context["core/tabs-list"] || EMPTY_ARRAY;
  const activeTabIndex = context["core/tabs-activeTabIndex"] ?? 0;
  const editorActiveTabIndex = context["core/tabs-editorActiveTabIndex"];
  const effectiveActiveIndex = useMemo(() => {
    return editorActiveTabIndex ?? activeTabIndex;
  }, [editorActiveTabIndex, activeTabIndex]);
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const [activeBlockContextId, setActiveBlockContextId] = useState(null);
  const { blocks, tabsClientId } = useSelect(
    (select) => {
      const { getBlocks, getBlockRootClientId } = select(blockEditorStore);
      return {
        blocks: getBlocks(clientId),
        tabsClientId: getBlockRootClientId(clientId)
      };
    },
    [clientId]
  );
  const blockContexts = useMemo(() => {
    return tabsList.map((tab, index) => ({
      "core/tabs-menu-item-index": index,
      "core/tabs-menu-item-id": tab.id || `tab-${index}`,
      "core/tabs-menu-item-label": tab.label || "",
      "core/tabs-menu-item-clientId": tab.clientId,
      // Pass through parent context
      "core/tabs-id": tabsId,
      "core/tabs-list": tabsList,
      "core/tabs-activeTabIndex": activeTabIndex,
      "core/tabs-editorActiveTabIndex": editorActiveTabIndex
    }));
  }, [tabsList, tabsId, activeTabIndex, editorActiveTabIndex]);
  const getContextId = useCallback((blockContext) => {
    return `tab-context-${blockContext["core/tabs-menu-item-index"]}`;
  }, []);
  useEffect(() => {
    if (blockContexts.length > 0 && activeBlockContextId === null) {
      setActiveBlockContextId(getContextId(blockContexts[0]));
    }
  }, [blockContexts, activeBlockContextId, getContextId]);
  useEffect(() => {
    if (blockContexts.length > 0 && effectiveActiveIndex < blockContexts.length) {
      const newContextId = getContextId(
        blockContexts[effectiveActiveIndex]
      );
      setActiveBlockContextId(
        (prevId) => prevId !== newContextId ? newContextId : prevId
      );
    }
  }, [effectiveActiveIndex, blockContexts, getContextId]);
  const handleTabContextClick = useCallback(
    (index) => {
      if (tabsClientId && index !== effectiveActiveIndex) {
        __unstableMarkNextChangeAsNotPersistent();
        updateBlockAttributes(tabsClientId, {
          editorActiveTabIndex: index
        });
      }
    },
    [
      tabsClientId,
      effectiveActiveIndex,
      updateBlockAttributes,
      __unstableMarkNextChangeAsNotPersistent
    ]
  );
  const blockProps = useBlockProps({
    className: clsx(layoutClassNames),
    role: "tablist"
  });
  if (tabsList.length === 0) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(AddTabToolbarControl, { tabsClientId }),
      /* @__PURE__ */ jsx(RemoveTabToolbarControl, { tabsClientId }),
      /* @__PURE__ */ jsx("div", { ...blockProps, children: /* @__PURE__ */ jsx("span", { className: "tabs__tab-label tabs__tab-label--placeholder", children: __("Add tabs to display menu") }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AddTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx(RemoveTabToolbarControl, { tabsClientId }),
    /* @__PURE__ */ jsx("div", { ...blockProps, children: blockContexts.map((blockContext, index) => {
      const contextId = getContextId(blockContext);
      const isVisible = contextId === activeBlockContextId;
      return /* @__PURE__ */ jsxs(
        BlockContextProvider,
        {
          value: blockContext,
          children: [
            isVisible ? /* @__PURE__ */ jsx(
              TabsMenuItemTemplateBlocks,
              {
                wrapperProps: {
                  onClick: () => handleTabContextClick(index)
                },
                layout
              }
            ) : null,
            /* @__PURE__ */ jsx(
              MemoizedTabsMenuItemPreview,
              {
                blocks,
                blockContextId: contextId,
                setActiveBlockContextId: (id) => {
                  setActiveBlockContextId(id);
                  handleTabContextClick(index);
                },
                isHidden: isVisible
              }
            )
          ]
        },
        contextId
      );
    }) })
  ] });
}
var edit_default = Edit;
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
