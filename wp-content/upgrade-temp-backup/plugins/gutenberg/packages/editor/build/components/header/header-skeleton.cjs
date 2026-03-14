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

// packages/editor/src/components/header/header-skeleton.js
var header_skeleton_exports = {};
__export(header_skeleton_exports, {
  default: () => HeaderSkeleton
});
module.exports = __toCommonJS(header_skeleton_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_back_button = __toESM(require("./back-button.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var toolbarVariations = {
  distractionFreeDisabled: { y: "-50px" },
  distractionFreeHover: { y: 0 },
  distractionFreeHidden: { y: "-50px" },
  visible: { y: 0 },
  hidden: { y: 0 }
};
var backButtonVariations = {
  distractionFreeDisabled: { x: "-100%" },
  distractionFreeHover: { x: 0 },
  distractionFreeHidden: { x: "-100%" },
  visible: { x: 0 },
  hidden: { x: 0 }
};
function HeaderSkeleton({
  className,
  toolbar,
  center,
  settings
}) {
  const hasBackButton = (0, import_back_button.useHasBackButton)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: (0, import_clsx.default)("editor-header edit-post-header", className), children: [
    hasBackButton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__unstableMotion.div,
      {
        className: "editor-header__back-button",
        variants: backButtonVariations,
        transition: { type: "tween" },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_back_button.default.Slot, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__unstableMotion.div,
      {
        variants: toolbarVariations,
        className: "editor-header__toolbar",
        transition: { type: "tween" },
        children: toolbar
      }
    ),
    center && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__unstableMotion.div,
      {
        variants: toolbarVariations,
        className: "editor-header__center",
        transition: { type: "tween" },
        children: center
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__unstableMotion.div,
      {
        variants: toolbarVariations,
        transition: { type: "tween" },
        className: "editor-header__settings",
        children: settings
      }
    )
  ] });
}
//# sourceMappingURL=header-skeleton.cjs.map
