"use strict";
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

// packages/global-styles-ui/src/screen-css.tsx
var screen_css_exports = {};
__export(screen_css_exports, {
  default: () => screen_css_default
});
module.exports = __toCommonJS(screen_css_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_screen_header = require("./screen-header.cjs");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { AdvancedPanel: StylesAdvancedPanel } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function ScreenCSS() {
  const [style] = (0, import_hooks.useStyle)("", void 0, "user", false);
  const [inheritedStyle, setStyle] = (0, import_hooks.useStyle)(
    "",
    void 0,
    "merged",
    false
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: (0, import_i18n.__)("Additional CSS"),
        description: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          (0, import_i18n.__)(
            "You can add custom CSS to further customize the appearance and layout of your site."
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.ExternalLink,
            {
              href: (0, import_i18n.__)(
                "https://developer.wordpress.org/advanced-administration/wordpress/css/"
              ),
              className: "global-styles-ui-screen-css-help-link",
              children: (0, import_i18n.__)("Learn more about CSS")
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "global-styles-ui-screen-css", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesAdvancedPanel,
      {
        value: style,
        onChange: setStyle,
        inheritedValue: inheritedStyle
      }
    ) })
  ] });
}
var screen_css_default = ScreenCSS;
//# sourceMappingURL=screen-css.cjs.map
