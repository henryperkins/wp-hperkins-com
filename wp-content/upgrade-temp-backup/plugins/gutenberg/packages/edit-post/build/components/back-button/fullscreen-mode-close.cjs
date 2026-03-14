var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-post/src/components/back-button/fullscreen-mode-close.js
var fullscreen_mode_close_exports = {};
__export(fullscreen_mode_close_exports, {
  default: () => fullscreen_mode_close_default
});
module.exports = __toCommonJS(fullscreen_mode_close_exports);
var import_clsx = __toESM(require("clsx"));
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_icons = require("@wordpress/icons");
var import_editor = require("@wordpress/editor");
var import_core_data = require("@wordpress/core-data");
var import_compose = require("@wordpress/compose");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const { isRequestingSiteIcon, postType, siteIconUrl } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPostType } = select(import_editor.store);
      const { getEntityRecord, getPostType, isResolving } = select(import_core_data.store);
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
  const disableMotion = (0, import_compose.useReducedMotion)();
  const transition = {
    duration: disableMotion ? 0 : 0.2
  };
  if (!postType) {
    return null;
  }
  let siteIconContent;
  if (isRequestingSiteIcon && !siteIconUrl) {
    siteIconContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-post-fullscreen-mode-close-site-icon__image" });
  } else if (siteIconUrl) {
    siteIconContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "img",
      {
        className: "edit-post-fullscreen-mode-close-site-icon__image",
        alt: (0, import_i18n.__)("Site Icon"),
        src: siteIconUrl
      }
    );
  } else {
    siteIconContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Icon,
      {
        className: "edit-post-fullscreen-mode-close-site-icon__icon",
        icon: import_icons.wordpress,
        size: 48
      }
    );
  }
  const buttonIcon = icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { size: "36px", icon }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-post-fullscreen-mode-close-site-icon", children: siteIconContent });
  const classes = (0, import_clsx.default)("edit-post-fullscreen-mode-close", {
    "has-icon": siteIconUrl
  });
  const buttonHref = href ?? (0, import_url.addQueryArgs)("edit.php", {
    post_type: postType.slug
  });
  const buttonLabel = postType?.labels?.view_items ?? (0, import_i18n.__)("Back");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__unstableMotion.div,
    {
      className: "edit-post-fullscreen-mode-close__view-mode-toggle",
      animate: "edit",
      initial: "edit",
      whileHover: "hover",
      whileTap: "tap",
      transition,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            className: classes,
            href: buttonHref,
            label: buttonLabel,
            showTooltip,
            tooltipPosition: "middle right",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__unstableMotion.div, { variants: !disableMotion && siteIconVariants, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-post-fullscreen-mode-close__view-mode-toggle-icon", children: buttonIcon }) })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__unstableMotion.div,
          {
            className: (0, import_clsx.default)(
              "edit-post-fullscreen-mode-close__back-icon",
              {
                "has-site-icon": siteIconUrl
              }
            ),
            variants: !disableMotion && toggleHomeIconVariants,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon: import_icons.arrowUpLeft })
          }
        )
      ]
    }
  );
}
var fullscreen_mode_close_default = FullscreenModeClose;
//# sourceMappingURL=fullscreen-mode-close.cjs.map
