"use strict";

// packages/editor/src/hooks/navigation-link-view-button.js
var import_hooks = require("@wordpress/hooks");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_jsx_runtime = require("react/jsx-runtime");
var SUPPORTED_BLOCKS = ["core/navigation-link", "core/navigation-submenu"];
function NavigationViewButton({ attributes }) {
  const { kind, id, type } = attributes;
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  const onNavigateToEntityRecord = (0, import_data.useSelect)(
    (select) => select(import_block_editor.store).getSettings().onNavigateToEntityRecord,
    []
  );
  const onViewPage = (0, import_element.useCallback)(() => {
    if (kind === "post-type" && type === "page" && id && onNavigateToEntityRecord) {
      onNavigateToEntityRecord({
        postId: id,
        postType: type
      });
    }
  }, [kind, id, type, onNavigateToEntityRecord]);
  if (kind !== "post-type" || type !== "page" || !id || !onNavigateToEntityRecord || blockEditingMode !== "contentOnly") {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.__unstableBlockToolbarLastItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      name: "view",
      title: (0, import_i18n.__)("View"),
      onClick: onViewPage,
      children: (0, import_i18n.__)("View")
    }
  ) }) });
}
var withNavigationViewButton = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => {
    const isSupportedBlock = SUPPORTED_BLOCKS.includes(props.name);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit"),
      props.isSelected && isSupportedBlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationViewButton, { ...props })
    ] });
  },
  "withNavigationViewButton"
);
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/editor/with-navigation-view-button",
  withNavigationViewButton
);
//# sourceMappingURL=navigation-link-view-button.cjs.map
