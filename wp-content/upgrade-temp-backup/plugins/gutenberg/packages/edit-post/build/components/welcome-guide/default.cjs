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

// packages/edit-post/src/components/welcome-guide/default.js
var default_exports = {};
__export(default_exports, {
  default: () => WelcomeGuideDefault
});
module.exports = __toCommonJS(default_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_image = __toESM(require("./image.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuideDefault() {
  const { toggleFeature } = (0, import_data.useDispatch)(import_store.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Guide,
    {
      className: "edit-post-welcome-guide",
      contentLabel: (0, import_i18n.__)("Welcome to the editor"),
      finishButtonText: (0, import_i18n.__)("Get started"),
      onFinish: () => toggleFeature("welcomeGuide"),
      pages: [
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-canvas.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-canvas.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-post-welcome-guide__heading", children: (0, import_i18n.__)("Welcome to the editor") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-post-welcome-guide__text", children: (0, import_i18n.__)(
              "In the WordPress editor, each paragraph, image, or video is presented as a distinct \u201Cblock\u201D of content."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-editor.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-editor.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-post-welcome-guide__heading", children: (0, import_i18n.__)("Customize each block") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-post-welcome-guide__text", children: (0, import_i18n.__)(
              "Each block comes with its own set of controls for changing things like color, width, and alignment. These will show and hide automatically when you have a block selected."
            ) })
          ] })
        },
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-library.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-library.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-post-welcome-guide__heading", children: (0, import_i18n.__)("Explore all blocks") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-post-welcome-guide__text", children: (0, import_element.createInterpolateElement)(
              (0, import_i18n.__)(
                "All of the blocks available to you live in the block library. You\u2019ll find it wherever you see the <InserterIconImage /> icon."
              ),
              {
                InserterIconImage: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
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
            import_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-documentation.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-post-welcome-guide__heading", children: (0, import_i18n.__)("Learn more") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-post-welcome-guide__text", children: (0, import_element.createInterpolateElement)(
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
//# sourceMappingURL=default.cjs.map
