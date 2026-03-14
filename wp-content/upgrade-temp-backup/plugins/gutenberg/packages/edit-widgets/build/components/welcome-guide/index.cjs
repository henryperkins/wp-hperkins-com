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

// packages/edit-widgets/src/components/welcome-guide/index.js
var welcome_guide_exports = {};
__export(welcome_guide_exports, {
  default: () => WelcomeGuide
});
module.exports = __toCommonJS(welcome_guide_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuide() {
  const isActive = (0, import_data.useSelect)(
    (select) => !!select(import_preferences.store).get(
      "core/edit-widgets",
      "welcomeGuide"
    ),
    []
  );
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const widgetAreas = (0, import_data.useSelect)(
    (select) => select(import_store.store).getWidgetAreas({ per_page: -1 }),
    []
  );
  if (!isActive) {
    return null;
  }
  const isEntirelyBlockWidgets = widgetAreas?.every(
    (widgetArea) => widgetArea.id === "wp_inactive_widgets" || widgetArea.widgets.every(
      (widgetId) => widgetId.startsWith("block-")
    )
  );
  const numWidgetAreas = widgetAreas?.filter(
    (widgetArea) => widgetArea.id !== "wp_inactive_widgets"
  ).length ?? 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Guide,
    {
      className: "edit-widgets-welcome-guide",
      contentLabel: (0, import_i18n.__)("Welcome to block Widgets"),
      finishButtonText: (0, import_i18n.__)("Get started"),
      onFinish: () => toggle("core/edit-widgets", "welcomeGuide"),
      pages: [
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-canvas.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-canvas.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-widgets-welcome-guide__heading", children: (0, import_i18n.__)("Welcome to block Widgets") }),
            isEntirelyBlockWidgets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-widgets-welcome-guide__text", children: (0, import_i18n.sprintf)(
              // Translators: %s: Number of block areas in the current theme.
              (0, import_i18n._n)(
                "Your theme provides %s \u201Cblock\u201D area for you to add and edit content.\xA0Try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site.",
                "Your theme provides %s different \u201Cblock\u201D areas for you to add and edit content.\xA0Try adding a search bar, social icons, or other types of blocks here and see how they\u2019ll look on your site.",
                numWidgetAreas
              ),
              numWidgetAreas
            ) }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-widgets-welcome-guide__text", children: (0, import_i18n.__)(
                "You can now add any block to your site\u2019s widget areas. Don\u2019t worry, all of your favorite widgets still work flawlessly."
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "edit-widgets-welcome-guide__text", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: (0, import_i18n.__)(
                  "Want to stick with the old widgets?"
                ) }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.ExternalLink,
                  {
                    href: (0, import_i18n.__)(
                      "https://wordpress.org/plugins/classic-widgets/"
                    ),
                    children: (0, import_i18n.__)(
                      "Get the Classic Widgets plugin."
                    )
                  }
                )
              ] })
            ] })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-editor.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-editor.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-widgets-welcome-guide__heading", children: (0, import_i18n.__)("Customize each block") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-widgets-welcome-guide__text", children: (0, import_i18n.__)(
              "Each block comes with its own set of controls for changing things like color, width, and alignment. These will show and hide automatically when you have a block selected."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-library.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-library.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-widgets-welcome-guide__heading", children: (0, import_i18n.__)("Explore all blocks") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-widgets-welcome-guide__text", children: (0, import_element.createInterpolateElement)(
              (0, import_i18n.__)(
                "All of the blocks available to you live in the block library. You\u2019ll find it wherever you see the <InserterIconImage /> icon."
              ),
              {
                InserterIconImage: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    className: "edit-widgets-welcome-guide__inserter-icon",
                    alt: (0, import_i18n.__)("inserter"),
                    src: "data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='18' height='18' rx='2' fill='%231E1E1E'/%3E%3Cpath d='M9.22727 4V14M4 8.77273H14' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E%0A"
                  }
                )
              }
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            WelcomeGuideImage,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-widgets-welcome-guide__heading", children: (0, import_i18n.__)("Learn more") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-widgets-welcome-guide__text", children: (0, import_element.createInterpolateElement)(
              (0, import_i18n.__)(
                "New to the block editor? Want to learn more about using it? <a>Here's a detailed guide.</a>"
              ),
              {
                a: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.ExternalLink,
                  {
                    href: (0, import_i18n.__)(
                      "https://wordpress.org/documentation/article/wordpress-block-editor/"
                    )
                  }
                )
              }
            ) })
          ] })
        }
      ]
    }
  );
}
function WelcomeGuideImage({ nonAnimatedSrc, animatedSrc }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", { className: "edit-widgets-welcome-guide__image", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "source",
      {
        srcSet: nonAnimatedSrc,
        media: "(prefers-reduced-motion: reduce)"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: animatedSrc, width: "312", height: "240", alt: "" })
  ] });
}
//# sourceMappingURL=index.cjs.map
