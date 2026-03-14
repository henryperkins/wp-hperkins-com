"use strict";

// packages/editor/src/hooks/pattern-overrides.js
var import_hooks = require("@wordpress/hooks");
var import_patterns = require("@wordpress/patterns");
var import_compose = require("@wordpress/compose");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var {
  PatternOverridesControls,
  ResetOverridesControl,
  PATTERN_TYPES,
  PATTERN_SYNC_TYPES
} = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var withPatternOverrideControls = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => {
    const isSupportedBlock = (0, import_data.useSelect)(
      (select) => {
        const { __experimentalBlockBindingsSupportedAttributes } = select(import_block_editor.store).getSettings();
        return !!__experimentalBlockBindingsSupportedAttributes?.[props.name];
      },
      [props.name]
    );
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit"),
      props.isSelected && isSupportedBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlsWithStoreSubscription, { ...props })
    ] });
  },
  "withPatternOverrideControls"
);
function ControlsWithStoreSubscription(props) {
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  const { hasPatternOverridesSource, isEditingSyncedPattern } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPostType, getEditedPostAttribute } = select(import_store.store);
      return {
        // For editing link to the site editor if the theme and user permissions support it.
        hasPatternOverridesSource: !!(0, import_blocks.getBlockBindingsSource)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    shouldShowPatternOverridesControls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatternOverridesControls, { ...props }),
    shouldShowResetOverridesControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResetOverridesControl, { ...props })
  ] });
}
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/editor/with-pattern-override-controls",
  withPatternOverrideControls
);
//# sourceMappingURL=pattern-overrides.cjs.map
