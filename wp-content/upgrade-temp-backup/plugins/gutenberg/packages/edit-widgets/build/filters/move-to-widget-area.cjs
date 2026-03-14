// packages/edit-widgets/src/filters/move-to-widget-area.js
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_hooks = require("@wordpress/hooks");
var import_widgets = require("@wordpress/widgets");
var import_store = require("../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var withMoveToWidgetAreaToolbarItem = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => {
    const { clientId, name: blockName } = props;
    const { widgetAreas, currentWidgetAreaId, canInsertBlockInWidgetArea } = (0, import_data.useSelect)(
      (select) => {
        if (blockName === "core/widget-area") {
          return {};
        }
        const selectors = select(import_store.store);
        const widgetAreaBlock = selectors.getParentWidgetAreaBlock(clientId);
        return {
          widgetAreas: selectors.getWidgetAreas(),
          currentWidgetAreaId: widgetAreaBlock?.attributes?.id,
          canInsertBlockInWidgetArea: selectors.canInsertBlockInWidgetArea(blockName)
        };
      },
      [clientId, blockName]
    );
    const { moveBlockToWidgetArea } = (0, import_data.useDispatch)(import_store.store);
    const hasMultipleWidgetAreas = widgetAreas?.length > 1;
    const isMoveToWidgetAreaVisible = blockName !== "core/widget-area" && hasMultipleWidgetAreas && canInsertBlockInWidgetArea;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit"),
      isMoveToWidgetAreaVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_widgets.MoveToWidgetArea,
        {
          widgetAreas,
          currentWidgetAreaId,
          onSelect: (widgetAreaId) => {
            moveBlockToWidgetArea(
              props.clientId,
              widgetAreaId
            );
          }
        }
      ) })
    ] });
  },
  "withMoveToWidgetAreaToolbarItem"
);
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/edit-widgets/block-edit",
  withMoveToWidgetAreaToolbarItem
);
//# sourceMappingURL=move-to-widget-area.cjs.map
