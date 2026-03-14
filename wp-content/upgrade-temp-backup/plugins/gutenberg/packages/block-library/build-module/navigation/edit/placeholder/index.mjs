// packages/block-library/src/navigation/edit/placeholder/index.js
import { Placeholder, Button, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { navigation, Icon } from "@wordpress/icons";
import { speak } from "@wordpress/a11y";
import { useEffect } from "@wordpress/element";
import { useEntityRecords } from "@wordpress/core-data";
import PlaceholderPreview from "./placeholder-preview.mjs";
import NavigationMenuSelector from "../navigation-menu-selector.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function NavigationPlaceholder({
  isSelected,
  currentMenuId,
  clientId,
  canUserCreateNavigationMenus = false,
  isResolvingCanUserCreateNavigationMenus,
  onSelectNavigationMenu,
  onSelectClassicMenu,
  onCreateEmpty
}) {
  const { isResolving: isResolvingMenus, hasResolved: hasResolvedMenus } = useEntityRecords("root", "menu", { per_page: -1, context: "view" });
  useEffect(() => {
    if (!isSelected) {
      return;
    }
    if (isResolvingMenus) {
      speak(__("Loading navigation block setup options\u2026"));
    }
    if (hasResolvedMenus) {
      speak(__("Navigation block setup options ready."));
    }
  }, [hasResolvedMenus, isResolvingMenus, isSelected]);
  const isResolvingActions = isResolvingMenus && isResolvingCanUserCreateNavigationMenus;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(Placeholder, { className: "wp-block-navigation-placeholder", children: [
    /* @__PURE__ */ jsx(PlaceholderPreview, { isVisible: !isSelected }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "aria-hidden": !isSelected ? true : void 0,
        className: "wp-block-navigation-placeholder__controls",
        children: /* @__PURE__ */ jsxs("div", { className: "wp-block-navigation-placeholder__actions", children: [
          /* @__PURE__ */ jsxs("div", { className: "wp-block-navigation-placeholder__actions__indicator", children: [
            /* @__PURE__ */ jsx(Icon, { icon: navigation }),
            " ",
            __("Navigation")
          ] }),
          /* @__PURE__ */ jsx("hr", {}),
          isResolvingActions && /* @__PURE__ */ jsx(Spinner, {}),
          /* @__PURE__ */ jsx(
            NavigationMenuSelector,
            {
              currentMenuId,
              clientId,
              onSelectNavigationMenu,
              onSelectClassicMenu
            }
          ),
          /* @__PURE__ */ jsx("hr", {}),
          canUserCreateNavigationMenus && /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onCreateEmpty,
              children: __("Start empty")
            }
          )
        ] })
      }
    )
  ] }) });
}
export {
  NavigationPlaceholder as default
};
//# sourceMappingURL=index.mjs.map
