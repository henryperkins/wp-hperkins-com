// packages/block-library/src/tab/edit.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  useInnerBlocksProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { useMemo, useRef, useEffect } from "@wordpress/element";
import Controls from "./controls.mjs";
import slugFromLabel from "./slug-from-label.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var TEMPLATE = [
  [
    "core/paragraph",
    {
      placeholder: __("Type / to choose a block")
    }
  ]
];
var { cancelAnimationFrame } = window;
function Edit({
  attributes,
  clientId,
  context,
  isSelected,
  __unstableLayoutClassNames: layoutClassNames
}) {
  const focusRef = useRef();
  const { anchor, label } = attributes;
  const activeTabIndex = context["core/tabs-activeTabIndex"] ?? 0;
  const editorActiveTabIndex = context["core/tabs-editorActiveTabIndex"];
  const effectiveActiveIndex = editorActiveTabIndex ?? activeTabIndex;
  useEffect(() => {
    return () => {
      if (focusRef.current) {
        cancelAnimationFrame(focusRef.current);
      }
    };
  }, []);
  const { blockIndex, hasInnerBlocksSelected, tabsClientId } = useSelect(
    (select) => {
      const {
        getBlockRootClientId,
        getBlockIndex,
        hasSelectedInnerBlock
      } = select(blockEditorStore);
      const tabPanelClientId = getBlockRootClientId(clientId);
      const _tabsClientId = getBlockRootClientId(tabPanelClientId);
      const _blockIndex = getBlockIndex(clientId);
      const _hasInnerBlocksSelected = hasSelectedInnerBlock(
        clientId,
        true
      );
      return {
        blockIndex: _blockIndex,
        hasInnerBlocksSelected: _hasInnerBlocksSelected,
        tabsClientId: _tabsClientId
      };
    },
    [clientId]
  );
  const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  useEffect(() => {
    const isTabSelected = isSelected || hasInnerBlocksSelected;
    if (isTabSelected && tabsClientId && effectiveActiveIndex !== blockIndex) {
      __unstableMarkNextChangeAsNotPersistent();
      updateBlockAttributes(tabsClientId, {
        editorActiveTabIndex: blockIndex
      });
    }
  }, [
    isSelected,
    hasInnerBlocksSelected,
    tabsClientId,
    effectiveActiveIndex,
    blockIndex,
    updateBlockAttributes,
    __unstableMarkNextChangeAsNotPersistent
  ]);
  const isActiveTab = effectiveActiveIndex === blockIndex;
  const isDefaultTab = activeTabIndex === blockIndex;
  const isSelectedTab = useMemo(() => {
    if (isSelected || hasInnerBlocksSelected) {
      return true;
    }
    if (isActiveTab) {
      return true;
    }
    return false;
  }, [isSelected, hasInnerBlocksSelected, isActiveTab]);
  const tabPanelId = useMemo(
    () => anchor || slugFromLabel(label, blockIndex),
    [anchor, label, blockIndex]
  );
  const tabLabelId = useMemo(() => `${tabPanelId}--tab`, [tabPanelId]);
  const blockProps = useBlockProps({
    hidden: !isSelectedTab,
    "aria-labelledby": tabLabelId,
    id: tabPanelId,
    role: "tabpanel",
    tabIndex: isSelectedTab ? 0 : -1,
    className: clsx("wp-block-tab__editor-content", layoutClassNames)
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    template: TEMPLATE
  });
  return /* @__PURE__ */ jsxs("section", { ...innerBlocksProps, children: [
    /* @__PURE__ */ jsx(
      Controls,
      {
        tabsClientId,
        blockIndex,
        isDefaultTab
      }
    ),
    isSelectedTab && innerBlocksProps.children
  ] });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
