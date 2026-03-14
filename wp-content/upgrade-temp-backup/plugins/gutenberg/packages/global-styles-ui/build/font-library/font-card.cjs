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

// packages/global-styles-ui/src/font-library/font-card.tsx
var font_card_exports = {};
__export(font_card_exports, {
  default: () => font_card_default
});
module.exports = __toCommonJS(font_card_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_font_demo = __toESM(require("./font-demo.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function FontCard({
  font,
  onClick,
  variantsText,
  navigatorPath
}) {
  const variantsCount = font.fontFace?.length || 1;
  const style = {
    cursor: !!onClick ? "pointer" : "default"
  };
  const navigator = (0, import_components.useNavigator)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      __next40pxDefaultSize: true,
      onClick: () => {
        onClick();
        if (navigatorPath) {
          navigator.goTo(navigatorPath);
        }
      },
      style,
      className: "font-library__font-card",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { justify: "space-between", wrap: false, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_font_demo.default, { font }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { justify: "flex-end", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { className: "font-library__font-card__count", children: variantsText || (0, import_i18n.sprintf)(
            /* translators: %d: Number of font variants. */
            (0, import_i18n._n)(
              "%d variant",
              "%d variants",
              variantsCount
            ),
            variantsCount
          ) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight }) })
        ] })
      ] })
    }
  );
}
var font_card_default = FontCard;
//# sourceMappingURL=font-card.cjs.map
