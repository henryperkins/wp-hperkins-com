// packages/edit-widgets/src/filters/move-to-widget-area.js
import { BlockControls } from "@wordpress/block-editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useDispatch, useSelect } from "@wordpress/data";
import { addFilter } from "@wordpress/hooks";
import { MoveToWidgetArea } from "@wordpress/widgets";
import { store as editWidgetsStore } from "../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var withMoveToWidgetAreaToolbarItem = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const { clientId, name: blockName } = props;
    const { widgetAreas, currentWidgetAreaId, canInsertBlockInWidgetArea } = useSelect(
      (select) => {
        if (blockName === "core/widget-area") {
          return {};
        }
        const selectors = select(editWidgetsStore);
        const widgetAreaBlock = selectors.getParentWidgetAreaBlock(clientId);
        return {
          widgetAreas: selectors.getWidgetAreas(),
          currentWidgetAreaId: widgetAreaBlock?.attributes?.id,
          canInsertBlockInWidgetArea: selectors.canInsertBlockInWidgetArea(blockName)
        };
      },
      [clientId, blockName]
    );
    const { moveBlockToWidgetArea } = useDispatch(editWidgetsStore);
    const hasMultipleWidgetAreas = widgetAreas?.length > 1;
    const isMoveToWidgetAreaVisible = blockName !== "core/widget-area" && hasMultipleWidgetAreas && canInsertBlockInWidgetArea;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit"),
      isMoveToWidgetAreaVisible && /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(
        MoveToWidgetArea,
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
addFilter(
  "editor.BlockEdit",
  "core/edit-widgets/block-edit",
  withMoveToWidgetAreaToolbarItem
);
//# sourceMappingURL=move-to-widget-area.mjs.map
