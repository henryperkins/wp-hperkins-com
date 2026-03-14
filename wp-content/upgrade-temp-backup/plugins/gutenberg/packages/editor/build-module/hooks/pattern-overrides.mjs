// packages/editor/src/hooks/pattern-overrides.js
import { addFilter } from "@wordpress/hooks";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { createHigherOrderComponent } from "@wordpress/compose";
import {
  store as blockEditorStore,
  useBlockEditingMode
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { getBlockBindingsSource } from "@wordpress/blocks";
import { store as editorStore } from "../store/index.mjs";
import { unlock } from "../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var {
  PatternOverridesControls,
  ResetOverridesControl,
  PATTERN_TYPES,
  PATTERN_SYNC_TYPES
} = unlock(patternsPrivateApis);
var withPatternOverrideControls = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const isSupportedBlock = useSelect(
      (select) => {
        const { __experimentalBlockBindingsSupportedAttributes } = select(blockEditorStore).getSettings();
        return !!__experimentalBlockBindingsSupportedAttributes?.[props.name];
      },
      [props.name]
    );
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit"),
      props.isSelected && isSupportedBlock && /* @__PURE__ */ jsx(ControlsWithStoreSubscription, { ...props })
    ] });
  },
  "withPatternOverrideControls"
);
function ControlsWithStoreSubscription(props) {
  const blockEditingMode = useBlockEditingMode();
  const { hasPatternOverridesSource, isEditingSyncedPattern } = useSelect(
    (select) => {
      const { getCurrentPostType, getEditedPostAttribute } = select(editorStore);
      return {
        // For editing link to the site editor if the theme and user permissions support it.
        hasPatternOverridesSource: !!getBlockBindingsSource(
          "core/pattern-overrides"
        ),
        isEditingSyncedPattern: getCurrentPostType() === PATTERN_TYPES.user && getEditedPostAttribute("meta")?.wp_pattern_sync_status !== PATTERN_SYNC_TYPES.unsynced && getEditedPostAttribute("wp_pattern_sync_status") !== PATTERN_SYNC_TYPES.unsynced
      };
    },
    []
  );
  const bindings = props.attributes.metadata?.bindings;
  const hasPatternBindings = !!bindings && Object.values(bindings).some(
    (binding) => binding.source === "core/pattern-overrides"
  );
  const shouldShowPatternOverridesControls = isEditingSyncedPattern && blockEditingMode === "default";
  const shouldShowResetOverridesControl = !isEditingSyncedPattern && !!props.attributes.metadata?.name && blockEditingMode !== "disabled" && hasPatternBindings;
  if (!hasPatternOverridesSource) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    shouldShowPatternOverridesControls && /* @__PURE__ */ jsx(PatternOverridesControls, { ...props }),
    shouldShowResetOverridesControl && /* @__PURE__ */ jsx(ResetOverridesControl, { ...props })
  ] });
}
addFilter(
  "editor.BlockEdit",
  "core/editor/with-pattern-override-controls",
  withPatternOverrideControls
);
//# sourceMappingURL=pattern-overrides.mjs.map
