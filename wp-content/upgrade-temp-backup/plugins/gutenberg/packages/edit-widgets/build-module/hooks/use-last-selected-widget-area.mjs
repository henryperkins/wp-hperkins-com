// packages/edit-widgets/src/hooks/use-last-selected-widget-area.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { store as widgetsEditorStore } from "../store/index.mjs";
import { buildWidgetAreasPostId, KIND, POST_TYPE } from "../store/utils.mjs";
var useLastSelectedWidgetArea = () => useSelect((select) => {
  const { getBlockSelectionEnd, getBlockName } = select(blockEditorStore);
  const selectionEndClientId = getBlockSelectionEnd();
  if (getBlockName(selectionEndClientId) === "core/widget-area") {
    return selectionEndClientId;
  }
  const { getParentWidgetAreaBlock } = select(widgetsEditorStore);
  const widgetAreaBlock = getParentWidgetAreaBlock(selectionEndClientId);
  const widgetAreaBlockClientId = widgetAreaBlock?.clientId;
  if (widgetAreaBlockClientId) {
    return widgetAreaBlockClientId;
  }
  const { getEntityRecord } = select(coreStore);
  const widgetAreasPost = getEntityRecord(
    KIND,
    POST_TYPE,
    buildWidgetAreasPostId()
  );
  return widgetAreasPost?.blocks[0]?.clientId;
}, []);
var use_last_selected_widget_area_default = useLastSelectedWidgetArea;
export {
  use_last_selected_widget_area_default as default
};
//# sourceMappingURL=use-last-selected-widget-area.mjs.map
