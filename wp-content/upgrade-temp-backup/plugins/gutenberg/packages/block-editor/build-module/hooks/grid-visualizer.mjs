// packages/block-editor/src/hooks/grid-visualizer.js
import { createHigherOrderComponent } from "@wordpress/compose";
import { addFilter } from "@wordpress/hooks";
import { useSelect } from "@wordpress/data";
import { GridVisualizer, useGridLayoutSync } from "../components/grid/index.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import useBlockVisibility from "../components/block-visibility/use-block-visibility.mjs";
import { deviceTypeKey } from "../store/private-keys.mjs";
import { BLOCK_VISIBILITY_VIEWPORTS } from "../components/block-visibility/constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function GridLayoutSync(props) {
  useGridLayoutSync(props);
}
function GridTools({ clientId, layout }) {
  const { isVisible, blockVisibility, deviceType, isAnyAncestorHidden } = useSelect(
    (select) => {
      const {
        isBlockSelected,
        hasSelectedInnerBlock,
        isDraggingBlocks,
        getTemplateLock,
        getBlockEditingMode,
        getBlockAttributes,
        getSettings
      } = select(blockEditorStore);
      if (!isDraggingBlocks() && !isBlockSelected(clientId) || getTemplateLock(clientId) || getBlockEditingMode(clientId) !== "default" || hasSelectedInnerBlock(clientId)) {
        return { isVisible: false };
      }
      const { isBlockParentHiddenAtViewport } = unlock(
        select(blockEditorStore)
      );
      const attributes = getBlockAttributes(clientId);
      const settings = getSettings();
      const currentDeviceType = settings?.[deviceTypeKey]?.toLowerCase() || BLOCK_VISIBILITY_VIEWPORTS.desktop.value;
      return {
        isVisible: true,
        blockVisibility: attributes?.metadata?.blockVisibility,
        deviceType: currentDeviceType,
        isAnyAncestorHidden: isBlockParentHiddenAtViewport(
          clientId,
          currentDeviceType
        )
      };
    },
    [clientId]
  );
  const { isBlockCurrentlyHidden } = useBlockVisibility({
    blockVisibility,
    deviceType
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(GridLayoutSync, { clientId }),
    isVisible && !isBlockCurrentlyHidden && !isAnyAncestorHidden && /* @__PURE__ */ jsx(
      GridVisualizer,
      {
        clientId,
        parentLayout: layout
      }
    )
  ] });
}
var addGridVisualizerToBlockEdit = createHigherOrderComponent(
  (BlockEdit) => function AddGridVisualizerToBlockEdit(props) {
    if (props.attributes.layout?.type !== "grid") {
      return /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit");
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        GridTools,
        {
          clientId: props.clientId,
          layout: props.attributes.layout
        }
      ),
      /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit")
    ] });
  },
  "addGridVisualizerToBlockEdit"
);
addFilter(
  "editor.BlockEdit",
  "core/editor/grid-visualizer",
  addGridVisualizerToBlockEdit
);
//# sourceMappingURL=grid-visualizer.mjs.map
