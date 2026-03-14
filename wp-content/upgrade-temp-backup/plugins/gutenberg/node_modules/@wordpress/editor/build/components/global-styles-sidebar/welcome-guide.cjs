"use strict";
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

// packages/editor/src/components/global-styles-sidebar/welcome-guide.js
var welcome_guide_exports = {};
__export(welcome_guide_exports, {
  default: () => WelcomeGuideStyles
});
module.exports = __toCommonJS(welcome_guide_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_preferences = require("@wordpress/preferences");
var import_interface = require("@wordpress/interface");
var import_welcome_guide_image = __toESM(require("./welcome-guide-image.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuideStyles() {
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const { isActive, isStylesOpen } = (0, import_data.useSelect)((select) => {
    const sidebar = select(import_interface.store).getActiveComplementaryArea("core");
    return {
      isActive: !!select(import_preferences.store).get(
        "core/edit-site",
        "welcomeGuideStyles"
      ),
      isStylesOpen: sidebar === "edit-site/global-styles"
    };
  }, []);
  if (!isActive || !isStylesOpen) {
    return null;
  }
  const welcomeLabel = (0, import_i18n.__)("Welcome to Styles");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Guide,
    {
      className: "editor-welcome-guide guide-styles",
      contentLabel: welcomeLabel,
      finishButtonText: (0, import_i18n.__)("Get started"),
      onFinish: () => toggle("core/edit-site", "welcomeGuideStyles"),
      pages: [
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_welcome_guide_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-to-styles.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-to-styles.gif?1"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "editor-welcome-guide__heading", children: welcomeLabel }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "editor-welcome-guide__text", children: (0, import_i18n.__)(
              "Tweak your site, or give it a whole new look! Get creative \u2014 how about a new color palette for your buttons, or choosing a new font? Take a look at what you can do here."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_welcome_guide_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/set-the-design.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/set-the-design.gif?1"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "editor-welcome-guide__heading", children: (0, import_i18n.__)("Set the design") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "editor-welcome-guide__text", children: (0, import_i18n.__)(
              "You can customize your site as much as you like with different colors, typography, and layouts. Or if you prefer, just leave it up to your theme to handle!"
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_welcome_guide_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/personalize-blocks.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/personalize-blocks.gif?1"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "editor-welcome-guide__heading", children: (0, import_i18n.__)("Personalize blocks") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "editor-welcome-guide__text", children: (0, import_i18n.__)(
              "You can adjust your blocks to ensure a cohesive experience across your site \u2014 add your unique colors to a branded Button block, or adjust the Heading block to your preferred size."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_welcome_guide_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "editor-welcome-guide__heading", children: (0, import_i18n.__)("Learn more") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "editor-welcome-guide__text", children: [
              (0, import_i18n.__)(
                "New to block themes and styling your site?"
              ),
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.ExternalLink,
                {
                  href: (0, import_i18n.__)(
                    "https://wordpress.org/documentation/article/styles-overview/"
                  ),
                  children: (0, import_i18n.__)(
                    "Here\u2019s a detailed guide to learn how to make the most of it."
                  )
                }
              )
            ] })
          ] })
        }
      ]
    }
  );
}
//# sourceMappingURL=welcome-guide.cjs.map
