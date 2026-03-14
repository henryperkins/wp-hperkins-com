// packages/block-library/src/navigation/edit/navigation-list-view-header.js
import {
  __experimentalHStack as HStack,
  __experimentalHeading as Heading
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import NavigationMenuSelector from "./navigation-menu-selector.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useBlockDisplayTitle } = unlock(blockEditorPrivateApis);
var actionLabel = (
  /* translators: %s: The name of a menu. */
  __("Switch to '%s'")
);
function NavigationListViewHeader({
  clientId,
  blockEditingMode,
  currentMenuId,
  onSelectClassicMenu,
  onSelectNavigationMenu,
  onCreateNew,
  createNavigationMenuIsSuccess,
  createNavigationMenuIsError,
  isManageMenusButtonDisabled
}) {
  const blockTitle = useBlockDisplayTitle({
    clientId,
    context: "list-view"
  });
  return /* @__PURE__ */ jsxs(HStack, { className: "wp-block-navigation-off-canvas-editor__header", children: [
    /* @__PURE__ */ jsx(
      Heading,
      {
        className: "wp-block-navigation-off-canvas-editor__title",
        level: 2,
        children: blockTitle
      }
    ),
    blockEditingMode === "default" && /* @__PURE__ */ jsx(
      NavigationMenuSelector,
      {
        currentMenuId,
        onSelectClassicMenu,
        onSelectNavigationMenu,
        onCreateNew,
        createNavigationMenuIsSuccess,
        createNavigationMenuIsError,
        actionLabel,
        isManageMenusButtonDisabled
      }
    )
  ] });
}
export {
  NavigationListViewHeader as default
};
//# sourceMappingURL=navigation-list-view-header.mjs.map
