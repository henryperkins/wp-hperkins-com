// packages/customize-widgets/src/filters/move-to-sidebar.js
var import_block_editor = require("@wordpress/block-editor");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_hooks = require("@wordpress/hooks");
var import_widgets = require("@wordpress/widgets");
var import_sidebar_controls = require("../components/sidebar-controls/index.cjs");
var import_focus_control = require("../components/focus-control/index.cjs");
var import_utils = require("../utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var withMoveToSidebarToolbarItem = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => {
    let widgetId = (0, import_widgets.getWidgetIdFromBlock)(props);
    const sidebarControls = (0, import_sidebar_controls.useSidebarControls)();
    const activeSidebarControl = (0, import_sidebar_controls.useActiveSidebarControl)();
    const hasMultipleSidebars = sidebarControls?.length > 1;
    const blockName = props.name;
    const clientId = props.clientId;
    const canInsertBlockInSidebar = (0, import_data.useSelect)(
      (select) => {
        return select(import_block_editor.store).canInsertBlockType(
          blockName,
          ""
        );
      },
      [blockName]
    );
    const block = (0, import_data.useSelect)(
      (select) => select(import_block_editor.store).getBlock(clientId),
      [clientId]
    );
    const { removeBlock } = (0, import_data.useDispatch)(import_block_editor.store);
    const [, focusWidget] = (0, import_focus_control.useFocusControl)();
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
          (0, import_utils.blockToWidget)(block)
        ]);
        widgetId = addedWidgetIds.reverse().find((id) => !!id);
      }
      focusWidget(widgetId);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit"),
      hasMultipleSidebars && canInsertBlockInSidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_widgets.MoveToWidgetArea,
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
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/customize-widgets/block-edit",
  withMoveToSidebarToolbarItem
);
//# sourceMappingURL=move-to-sidebar.cjs.map
