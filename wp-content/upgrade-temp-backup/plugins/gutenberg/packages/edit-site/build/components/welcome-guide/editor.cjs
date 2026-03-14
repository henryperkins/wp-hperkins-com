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

// packages/edit-site/src/components/welcome-guide/editor.js
var editor_exports = {};
__export(editor_exports, {
  default: () => WelcomeGuideEditor
});
module.exports = __toCommonJS(editor_exports);
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_preferences = require("@wordpress/preferences");
var import_core_data = require("@wordpress/core-data");
var import_image = __toESM(require("./image.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuideEditor() {
  const { toggle } = (0, import_data.useDispatch)(import_preferences.store);
  const { isActive, isBlockBasedTheme } = (0, import_data.useSelect)((select) => {
    return {
      isActive: !!select(import_preferences.store).get(
        "core/edit-site",
        "welcomeGuide"
      ),
      isBlockBasedTheme: select(import_core_data.store).getCurrentTheme()?.is_block_theme
    };
  }, []);
  if (!isActive || !isBlockBasedTheme) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Guide,
    {
      className: "edit-site-welcome-guide guide-editor",
      contentLabel: (0, import_i18n.__)("Welcome to the site editor"),
      finishButtonText: (0, import_i18n.__)("Get started"),
      onFinish: () => toggle("core/edit-site", "welcomeGuide"),
      pages: [
        {
          image: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_image.default,
            {
              nonAnimatedSrc: "https://s.w.org/images/block-editor/edit-your-site.svg?1",
              animatedSrc: "https://s.w.org/images/block-editor/edit-your-site.gif?1"
            }
          ),
          content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "edit-site-welcome-guide__heading", children: (0, import_i18n.__)("Edit your site") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-site-welcome-guide__text", children: (0, import_i18n.__)(
              "Design everything on your site \u2014 from the header right down to the footer \u2014 using blocks."
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-site-welcome-guide__text", children: (0, import_element.createInterpolateElement)(
              (0, import_i18n.__)(
                "Click <StylesIconImage /> to start designing your blocks, and choose your typography, layout, and colors."
              ),
              {
                StylesIconImage: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "img",
                  {
                    alt: (0, import_i18n.__)("styles"),
                    src: "data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 4c-4.4 0-8 3.6-8 8v.1c0 4.1 3.2 7.5 7.2 7.9h.8c4.4 0 8-3.6 8-8s-3.6-8-8-8zm0 15V5c3.9 0 7 3.1 7 7s-3.1 7-7 7z' fill='%231E1E1E'/%3E%3C/svg%3E%0A"
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
//# sourceMappingURL=editor.cjs.map
