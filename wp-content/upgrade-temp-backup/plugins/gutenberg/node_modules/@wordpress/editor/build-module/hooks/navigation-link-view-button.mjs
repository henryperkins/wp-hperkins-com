// packages/editor/src/hooks/navigation-link-view-button.js
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  __unstableBlockToolbarLastItem as BlockToolbarLastItem,
  store as blockEditorStore,
  useBlockEditingMode
} from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var SUPPORTED_BLOCKS = ["core/navigation-link", "core/navigation-submenu"];
function NavigationViewButton({ attributes }) {
  const { kind, id, type } = attributes;
  const blockEditingMode = useBlockEditingMode();
  const onNavigateToEntityRecord = useSelect(
    (select) => select(blockEditorStore).getSettings().onNavigateToEntityRecord,
    []
  );
  const onViewPage = useCallback(() => {
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
  return /* @__PURE__ */ jsx(BlockToolbarLastItem, { children: /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(
    ToolbarButton,
    {
      name: "view",
      title: __("View"),
      onClick: onViewPage,
      children: __("View")
    }
  ) }) });
}
var withNavigationViewButton = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const isSupportedBlock = SUPPORTED_BLOCKS.includes(props.name);
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit"),
      props.isSelected && isSupportedBlock && /* @__PURE__ */ jsx(NavigationViewButton, { ...props })
    ] });
  },
  "withNavigationViewButton"
);
addFilter(
  "editor.BlockEdit",
  "core/editor/with-navigation-view-button",
  withNavigationViewButton
);
//# sourceMappingURL=navigation-link-view-button.mjs.map
