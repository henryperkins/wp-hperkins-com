// packages/edit-post/src/components/back-button/fullscreen-mode-close.js
import clsx from "clsx";
import { useSelect } from "@wordpress/data";
import {
  Button,
  Icon,
  __unstableMotion as motion
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { wordpress, arrowUpLeft } from "@wordpress/icons";
import { store as editorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
import { useReducedMotion } from "@wordpress/compose";
import { jsx, jsxs } from "react/jsx-runtime";
var siteIconVariants = {
  edit: {
    clipPath: "inset(0% round 0px)"
  },
  hover: {
    clipPath: "inset( 22% round 2px )"
  },
  tap: {
    clipPath: "inset(0% round 0px)"
  }
};
var toggleHomeIconVariants = {
  edit: {
    opacity: 0,
    scale: 0.2
  },
  hover: {
    opacity: 1,
    scale: 1,
    clipPath: "inset( 22% round 2px )"
  }
};
function FullscreenModeClose({ showTooltip, icon, href, initialPost }) {
  const { isRequestingSiteIcon, postType, siteIconUrl } = useSelect(
    (select) => {
      const { getCurrentPostType } = select(editorStore);
      const { getEntityRecord, getPostType, isResolving } = select(coreStore);
      const siteData = getEntityRecord("root", "__unstableBase", void 0) || {};
      const _postType = initialPost?.type || getCurrentPostType();
      return {
        isRequestingSiteIcon: isResolving("getEntityRecord", [
          "root",
          "__unstableBase",
          void 0
        ]),
        postType: getPostType(_postType),
        siteIconUrl: siteData.site_icon_url
      };
    },
    [initialPost?.type]
  );
  const disableMotion = useReducedMotion();
  const transition = {
    duration: disableMotion ? 0 : 0.2
  };
  if (!postType) {
    return null;
  }
  let siteIconContent;
  if (isRequestingSiteIcon && !siteIconUrl) {
    siteIconContent = /* @__PURE__ */ jsx("div", { className: "edit-post-fullscreen-mode-close-site-icon__image" });
  } else if (siteIconUrl) {
    siteIconContent = /* @__PURE__ */ jsx(
      "img",
      {
        className: "edit-post-fullscreen-mode-close-site-icon__image",
        alt: __("Site Icon"),
        src: siteIconUrl
      }
    );
  } else {
    siteIconContent = /* @__PURE__ */ jsx(
      Icon,
      {
        className: "edit-post-fullscreen-mode-close-site-icon__icon",
        icon: wordpress,
        size: 48
      }
    );
  }
  const buttonIcon = icon ? /* @__PURE__ */ jsx(Icon, { size: "36px", icon }) : /* @__PURE__ */ jsx("div", { className: "edit-post-fullscreen-mode-close-site-icon", children: siteIconContent });
  const classes = clsx("edit-post-fullscreen-mode-close", {
    "has-icon": siteIconUrl
  });
  const buttonHref = href ?? addQueryArgs("edit.php", {
    post_type: postType.slug
  });
  const buttonLabel = postType?.labels?.view_items ?? __("Back");
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "edit-post-fullscreen-mode-close__view-mode-toggle",
      animate: "edit",
      initial: "edit",
      whileHover: "hover",
      whileTap: "tap",
      transition,
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            className: classes,
            href: buttonHref,
            label: buttonLabel,
            showTooltip,
            tooltipPosition: "middle right",
            children: /* @__PURE__ */ jsx(motion.div, { variants: !disableMotion && siteIconVariants, children: /* @__PURE__ */ jsx("div", { className: "edit-post-fullscreen-mode-close__view-mode-toggle-icon", children: buttonIcon }) })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: clsx(
              "edit-post-fullscreen-mode-close__back-icon",
              {
                "has-site-icon": siteIconUrl
              }
            ),
            variants: !disableMotion && toggleHomeIconVariants,
            children: /* @__PURE__ */ jsx(Icon, { icon: arrowUpLeft })
          }
        )
      ]
    }
  );
}
var fullscreen_mode_close_default = FullscreenModeClose;
export {
  fullscreen_mode_close_default as default
};
//# sourceMappingURL=fullscreen-mode-close.mjs.map
