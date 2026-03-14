// packages/edit-widgets/src/hooks/use-widget-library-insertion-point.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { store as editWidgetsStore } from "../store/index.mjs";
import { buildWidgetAreasPostId, KIND, POST_TYPE } from "../store/utils.mjs";
var useWidgetLibraryInsertionPoint = () => {
  const firstRootId = useSelect((select) => {
    const { getEntityRecord } = select(coreStore);
    const widgetAreasPost = getEntityRecord(
      KIND,
      POST_TYPE,
      buildWidgetAreasPostId()
    );
    return widgetAreasPost?.blocks[0]?.clientId;
  }, []);
  return useSelect(
    (select) => {
      const {
        getBlockRootClientId,
        getBlockSelectionEnd,
        getBlockOrder,
        getBlockIndex
      } = select(blockEditorStore);
      const insertionPoint = select(editWidgetsStore).__experimentalGetInsertionPoint();
      if (insertionPoint.rootClientId) {
        return insertionPoint;
      }
      const clientId = getBlockSelectionEnd() || firstRootId;
      const rootClientId = getBlockRootClientId(clientId);
      if (clientId && rootClientId === "") {
        return {
          rootClientId: clientId,
          insertionIndex: getBlockOrder(clientId).length
        };
      }
      return {
        rootClientId,
        insertionIndex: getBlockIndex(clientId) + 1
      };
    },
    [firstRootId]
  );
};
var use_widget_library_insertion_point_default = useWidgetLibraryInsertionPoint;
export {
  use_widget_library_insertion_point_default as default
};
//# sourceMappingURL=use-widget-library-insertion-point.mjs.map
