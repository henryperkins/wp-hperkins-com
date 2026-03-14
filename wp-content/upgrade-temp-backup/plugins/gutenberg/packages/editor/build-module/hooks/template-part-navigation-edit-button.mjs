// packages/editor/src/hooks/template-part-navigation-edit-button.js
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  __unstableBlockToolbarLastItem as BlockToolbarLastItem,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useSelect, useDispatch, useRegistry } from "@wordpress/data";
import { store as interfaceStore } from "@wordpress/interface";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var NAVIGATION_BLOCK_NAME = "core/navigation";
var TEMPLATE_PART_BLOCK_NAME = "core/template-part";
var BLOCK_INSPECTOR_AREA = "edit-post/block";
function TemplatePartNavigationEditButton({ clientId }) {
  const registry = useRegistry();
  const { selectBlock, flashBlock } = useDispatch(blockEditorStore);
  const { requestInspectorTab } = unlock(useDispatch(blockEditorStore));
  const { enableComplementaryArea } = useDispatch(interfaceStore);
  const {
    hasNavigationBlocks,
    firstNavigationBlockId,
    isNavigationEditable
  } = useSelect(
    (select) => {
      const {
        getClientIdsOfDescendants,
        getBlockName,
        getBlockEditingMode
      } = select(blockEditorStore);
      const descendants = getClientIdsOfDescendants(clientId);
      const navigationBlocksInTemplatePart = descendants.filter(
        (blockId) => getBlockName(blockId) === NAVIGATION_BLOCK_NAME
      );
      const _hasNavigationBlocks = navigationBlocksInTemplatePart.length > 0;
      const _firstNavigationBlockId = _hasNavigationBlocks ? navigationBlocksInTemplatePart[0] : null;
      return {
        hasNavigationBlocks: _hasNavigationBlocks,
        firstNavigationBlockId: _firstNavigationBlockId,
        // We can't use the useBlockEditingMode hook here because the current
        // context is the template part, not the navigation block.
        isNavigationEditable: getBlockEditingMode(_firstNavigationBlockId) !== "disabled"
      };
    },
    [clientId]
  );
  const onEditNavigation = useCallback(() => {
    if (firstNavigationBlockId) {
      registry.batch(() => {
        selectBlock(firstNavigationBlockId);
        flashBlock(firstNavigationBlockId, 500);
        enableComplementaryArea("core", BLOCK_INSPECTOR_AREA);
        requestInspectorTab("list", {
          openPanel: firstNavigationBlockId
        });
      });
    }
  }, [
    firstNavigationBlockId,
    registry,
    selectBlock,
    flashBlock,
    enableComplementaryArea,
    requestInspectorTab
  ]);
  if (!hasNavigationBlocks || !isNavigationEditable) {
    return null;
  }
  return /* @__PURE__ */ jsx(BlockToolbarLastItem, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      label: __("Edit navigation"),
      onClick: onEditNavigation,
      children: __("Edit navigation")
    }
  ) }) });
}
var withTemplatePartNavigationEditButton = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const isTemplatePart = props.name === TEMPLATE_PART_BLOCK_NAME;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit"),
      props.isSelected && isTemplatePart && /* @__PURE__ */ jsx(
        TemplatePartNavigationEditButton,
        {
          clientId: props.clientId
        }
      )
    ] });
  },
  "withTemplatePartNavigationEditButton"
);
addFilter(
  "editor.BlockEdit",
  "core/editor/with-template-part-navigation-edit-button",
  withTemplatePartNavigationEditButton
);
//# sourceMappingURL=template-part-navigation-edit-button.mjs.map
