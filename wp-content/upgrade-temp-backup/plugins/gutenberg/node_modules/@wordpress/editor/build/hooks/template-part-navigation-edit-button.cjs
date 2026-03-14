"use strict";

// packages/editor/src/hooks/template-part-navigation-edit-button.js
var import_hooks = require("@wordpress/hooks");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_interface = require("@wordpress/interface");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var NAVIGATION_BLOCK_NAME = "core/navigation";
var TEMPLATE_PART_BLOCK_NAME = "core/template-part";
var BLOCK_INSPECTOR_AREA = "edit-post/block";
function TemplatePartNavigationEditButton({ clientId }) {
  const registry = (0, import_data.useRegistry)();
  const { selectBlock, flashBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  const { requestInspectorTab } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_block_editor.store));
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const {
    hasNavigationBlocks,
    firstNavigationBlockId,
    isNavigationEditable
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getClientIdsOfDescendants,
        getBlockName,
        getBlockEditingMode
      } = select(import_block_editor.store);
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
  const onEditNavigation = (0, import_element.useCallback)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableBlockToolbarLastItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      label: (0, import_i18n.__)("Edit navigation"),
      onClick: onEditNavigation,
      children: (0, import_i18n.__)("Edit navigation")
    }
  ) }) });
}
var withTemplatePartNavigationEditButton = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => {
    const isTemplatePart = props.name === TEMPLATE_PART_BLOCK_NAME;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit"),
      props.isSelected && isTemplatePart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TemplatePartNavigationEditButton,
        {
          clientId: props.clientId
        }
      )
    ] });
  },
  "withTemplatePartNavigationEditButton"
);
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/editor/with-template-part-navigation-edit-button",
  withTemplatePartNavigationEditButton
);
//# sourceMappingURL=template-part-navigation-edit-button.cjs.map
