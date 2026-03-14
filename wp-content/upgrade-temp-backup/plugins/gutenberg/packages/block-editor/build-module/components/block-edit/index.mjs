// packages/block-editor/src/components/block-edit/index.js
import { useMemo, useContext } from "@wordpress/element";
import { hasBlockSupport } from "@wordpress/blocks";
import Edit from "./edit.mjs";
import {
  BlockEditContextProvider,
  useBlockEditContext,
  mayDisplayControlsKey,
  mayDisplayParentControlsKey,
  mayDisplayPatternEditingControlsKey,
  blockEditingModeKey,
  blockBindingsKey,
  isPreviewModeKey,
  isInListViewBlockSupportTreeKey
} from "./context.mjs";
import { MultipleUsageWarning } from "./multiple-usage-warning.mjs";
import { PrivateBlockContext } from "../block-list/private-block-context.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockEdit({
  mayDisplayControls,
  mayDisplayParentControls,
  mayDisplayPatternEditingControls,
  blockEditingMode,
  isPreviewMode,
  // The remaining props are passed through the BlockEdit filters and are thus
  // public API!
  ...props
}) {
  const {
    name,
    isSelected,
    clientId,
    attributes = {},
    __unstableLayoutClassNames
  } = props;
  const { layout = null, metadata = {} } = attributes;
  const { bindings } = metadata;
  const layoutSupport = hasBlockSupport(name, "layout", false) || hasBlockSupport(name, "__experimentalLayout", false);
  const parentBlockEditContext = useBlockEditContext();
  const isInListViewBlockSupportTree = !!parentBlockEditContext[isInListViewBlockSupportTreeKey] || hasBlockSupport(name, "listView") || name === "core/navigation";
  const { originalBlockClientId } = useContext(PrivateBlockContext);
  return /* @__PURE__ */ jsxs(
    BlockEditContextProvider,
    {
      value: useMemo(
        () => ({
          name,
          isSelected,
          clientId,
          layout: layoutSupport ? layout : null,
          __unstableLayoutClassNames,
          // We use symbols in favour of an __unstable prefix to avoid
          // usage outside of the package (this context is exposed).
          [mayDisplayControlsKey]: mayDisplayControls,
          [mayDisplayParentControlsKey]: mayDisplayParentControls,
          [mayDisplayPatternEditingControlsKey]: mayDisplayPatternEditingControls && blockEditingMode !== "disabled",
          [blockEditingModeKey]: blockEditingMode,
          [blockBindingsKey]: bindings,
          [isPreviewModeKey]: isPreviewMode,
          [isInListViewBlockSupportTreeKey]: isInListViewBlockSupportTree
        }),
        [
          name,
          isSelected,
          clientId,
          layoutSupport,
          layout,
          __unstableLayoutClassNames,
          mayDisplayControls,
          mayDisplayParentControls,
          mayDisplayPatternEditingControls,
          blockEditingMode,
          bindings,
          isPreviewMode,
          isInListViewBlockSupportTree
        ]
      ),
      children: [
        /* @__PURE__ */ jsx(Edit, { ...props }),
        originalBlockClientId && /* @__PURE__ */ jsx(
          MultipleUsageWarning,
          {
            originalBlockClientId,
            name,
            onReplace: props.onReplace
          }
        )
      ]
    }
  );
}
export {
  BlockEdit as default,
  useBlockEditContext
};
//# sourceMappingURL=index.mjs.map
