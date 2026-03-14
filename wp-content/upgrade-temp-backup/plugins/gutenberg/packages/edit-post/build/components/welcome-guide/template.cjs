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

// packages/edit-post/src/components/welcome-guide/template.js
var template_exports = {};
__export(template_exports, {
  default: () => WelcomeGuideTemplate
});
module.exports = __toCommonJS(template_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_image = __toESM(require("./image.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuideTemplate() {
  const { toggleFeature } = (0, import_data.useDispatch)(import_store.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Guide,
    {
      className: "edit-template-welcome-guide",
      contentLabel: (0, import_i18n.__)("Welcome to the template editor"),
      finishButtonText: (0, import_i18n.__)("Get started"),
      onFinish: () => toggleFeature("welcomeGuideTemplate"),
      pages: [
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/welcome-template-editor.svg",
              animatedSrc: "https://s.w.org/images/block-editor/welcome-template-editor.gif"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-post-welcome-guide__heading", children: (0, import_i18n.__)("Welcome to the template editor") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-post-welcome-guide__text", children: (0, import_i18n.__)(
              "Templates help define the layout of the site. You can customize all aspects of your posts and pages using blocks and patterns in this editor."
            ) })
          ] })
        }
      ]
    }
  );
}
//# sourceMappingURL=template.cjs.map
