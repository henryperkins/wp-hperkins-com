// packages/block-library/src/navigation/edit/responsive-wrapper.js
import clsx from "clsx";
import { close, Icon } from "@wordpress/icons";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { getColorClassName } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import OverlayMenuIcon from "./overlay-menu-icon.mjs";
import { createTemplatePartId } from "../../template-part/edit/utils/create-template-part-id.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ResponsiveWrapper({
  children,
  id,
  isOpen,
  isResponsive,
  onToggle,
  isHiddenByDefault,
  overlayBackgroundColor,
  overlayTextColor,
  hasIcon,
  icon,
  overlay,
  onNavigateToEntityRecord
}) {
  const currentTheme = useSelect(
    (select) => select(coreStore).getCurrentTheme()?.stylesheet,
    []
  );
  if (!isResponsive) {
    return children;
  }
  const hasCustomOverlay = !!overlay;
  const responsiveContainerClasses = clsx(
    "wp-block-navigation__responsive-container",
    !hasCustomOverlay && {
      "has-text-color": !!overlayTextColor.color || !!overlayTextColor?.class,
      [getColorClassName("color", overlayTextColor?.slug)]: !!overlayTextColor?.slug,
      "has-background": !!overlayBackgroundColor.color || overlayBackgroundColor?.class,
      [getColorClassName(
        "background-color",
        overlayBackgroundColor?.slug
      )]: !!overlayBackgroundColor?.slug
    },
    {
      "is-menu-open": isOpen,
      "hidden-by-default": isHiddenByDefault
    }
  );
  const styles = !hasCustomOverlay ? {
    color: !overlayTextColor?.slug && overlayTextColor?.color,
    backgroundColor: !overlayBackgroundColor?.slug && overlayBackgroundColor?.color && overlayBackgroundColor.color
  } : {};
  const openButtonClasses = clsx(
    "wp-block-navigation__responsive-container-open",
    { "always-shown": isHiddenByDefault }
  );
  const modalId = `${id}-modal`;
  const dialogProps = {
    className: "wp-block-navigation__responsive-dialog",
    ...isOpen && {
      role: "dialog",
      "aria-modal": true,
      "aria-label": __("Menu")
    }
  };
  const handleToggleClick = () => {
    if (overlay && onNavigateToEntityRecord) {
      const templatePartId = createTemplatePartId(
        currentTheme,
        overlay
      );
      onNavigateToEntityRecord({
        postId: templatePartId,
        postType: "wp_template_part"
      });
      return;
    }
    onToggle(true);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isOpen && /* @__PURE__ */ jsxs(
      Button,
      {
        __next40pxDefaultSize: true,
        "aria-haspopup": "true",
        "aria-label": hasIcon && __("Open menu"),
        className: openButtonClasses,
        onClick: handleToggleClick,
        children: [
          hasIcon && /* @__PURE__ */ jsx(OverlayMenuIcon, { icon }),
          !hasIcon && __("Menu")
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: responsiveContainerClasses,
        style: styles,
        id: modalId,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "wp-block-navigation__responsive-close",
            tabIndex: "-1",
            children: /* @__PURE__ */ jsxs("div", { ...dialogProps, children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  __next40pxDefaultSize: true,
                  className: "wp-block-navigation__responsive-container-close",
                  "aria-label": hasIcon && __("Close menu"),
                  onClick: () => onToggle(false),
                  children: [
                    hasIcon && /* @__PURE__ */ jsx(Icon, { icon: close }),
                    !hasIcon && __("Close")
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "wp-block-navigation__responsive-container-content",
                  id: `${modalId}-content`,
                  children
                }
              )
            ] })
          }
        )
      }
    )
  ] });
}
export {
  ResponsiveWrapper as default
};
//# sourceMappingURL=responsive-wrapper.mjs.map
