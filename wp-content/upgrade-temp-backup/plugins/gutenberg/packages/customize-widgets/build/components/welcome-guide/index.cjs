var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/customize-widgets/src/components/welcome-guide/index.js
var welcome_guide_exports = {};
__export(welcome_guide_exports, {
  default: () => WelcomeGuide
});
module.exports = __toCommonJS(welcome_guide_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuide({ sidebar }) {
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const isEntirelyBlockWidgets = sidebar.getWidgets().every((widget) => widget.id.startsWith("block-"));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "customize-widgets-welcome-guide", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "customize-widgets-welcome-guide__image__wrapper", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "source",
        {
          srcSet: "https://s.w.org/images/block-editor/welcome-editor.svg",
          media: "(prefers-reduced-motion: reduce)"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "img",
        {
          className: "customize-widgets-welcome-guide__image",
          src: "https://s.w.org/images/block-editor/welcome-editor.gif",
          width: "312",
          height: "240",
          alt: ""
        }
      )
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "customize-widgets-welcome-guide__heading", children: (0, import_i18n.__)("Welcome to block Widgets") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "customize-widgets-welcome-guide__text", children: isEntirelyBlockWidgets ? (0, import_i18n.__)(
      "Your theme provides different \u201Cblock\u201D areas for you to add and edit content.\xA0Try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site."
    ) : (0, import_i18n.__)(
      "You can now add any block to your site\u2019s widget areas. Don\u2019t worry, all of your favorite widgets still work flawlessly."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        size: "compact",
        variant: "primary",
        onClick: () => toggle("core/customize-widgets", "welcomeGuide"),
        children: (0, import_i18n.__)("Got it")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "customize-widgets-welcome-guide__separator" }),
    !isEntirelyBlockWidgets && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "customize-widgets-welcome-guide__more-info", children: [
      (0, import_i18n.__)("Want to stick with the old widgets?"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.ExternalLink,
        {
          href: (0, import_i18n.__)(
            "https://wordpress.org/plugins/classic-widgets/"
          ),
          children: (0, import_i18n.__)("Get the Classic Widgets plugin.")
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "customize-widgets-welcome-guide__more-info", children: [
      (0, import_i18n.__)("New to the block editor?"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.ExternalLink,
        {
          href: (0, import_i18n.__)(
            "https://wordpress.org/documentation/article/wordpress-block-editor/"
          ),
          children: (0, import_i18n.__)("Here's a detailed guide.")
        }
      )
    ] })
  ] });
}
//# sourceMappingURL=index.cjs.map
