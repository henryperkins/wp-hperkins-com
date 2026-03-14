// packages/customize-widgets/src/filters/move-to-sidebar.js
import {
  BlockControls,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { addFilter } from "@wordpress/hooks";
import { MoveToWidgetArea, getWidgetIdFromBlock } from "@wordpress/widgets";
import {
  useSidebarControls,
  useActiveSidebarControl
} from "../components/sidebar-controls/index.mjs";
import { useFocusControl } from "../components/focus-control/index.mjs";
import { blockToWidget } from "../utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var withMoveToSidebarToolbarItem = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    let widgetId = getWidgetIdFromBlock(props);
    const sidebarControls = useSidebarControls();
    const activeSidebarControl = useActiveSidebarControl();
    const hasMultipleSidebars = sidebarControls?.length > 1;
    const blockName = props.name;
    const clientId = props.clientId;
    const canInsertBlockInSidebar = useSelect(
      (select) => {
        return select(blockEditorStore).canInsertBlockType(
          blockName,
          ""
        );
      },
      [blockName]
    );
    const block = useSelect(
      (select) => select(blockEditorStore).getBlock(clientId),
      [clientId]
    );
    const { removeBlock } = useDispatch(blockEditorStore);
    const [, focusWidget] = useFocusControl();
    function moveToSidebar(sidebarControlId) {
      const newSidebarControl = sidebarControls.find(
        (sidebarControl) => sidebarControl.id === sidebarControlId
      );
      if (widgetId) {
        const oldSetting = activeSidebarControl.setting;
        const newSetting = newSidebarControl.setting;
        oldSetting(oldSetting().filter((id) => id !== widgetId));
        newSetting([...newSetting(), widgetId]);
      } else {
        const sidebarAdapter = newSidebarControl.sidebarAdapter;
        removeBlock(clientId);
        const addedWidgetIds = sidebarAdapter.setWidgets([
          ...sidebarAdapter.getWidgets(),
          blockToWidget(block)
        ]);
        widgetId = addedWidgetIds.reverse().find((id) => !!id);
      }
      focusWidget(widgetId);
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit"),
      hasMultipleSidebars && canInsertBlockInSidebar && /* @__PURE__ */ jsx(BlockControls, { children: /* @__PURE__ */ jsx(
        MoveToWidgetArea,
        {
          widgetAreas: sidebarControls.map(
            (sidebarControl) => ({
              id: sidebarControl.id,
              name: sidebarControl.params.label,
              description: sidebarControl.params.description
            })
          ),
          currentWidgetAreaId: activeSidebarControl?.id,
          onSelect: moveToSidebar
        }
      ) })
    ] });
  },
  "withMoveToSidebarToolbarItem"
);
addFilter(
  "editor.BlockEdit",
  "core/customize-widgets/block-edit",
  withMoveToSidebarToolbarItem
);
//# sourceMappingURL=move-to-sidebar.mjs.map
