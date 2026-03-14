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

// packages/edit-post/src/components/back-button/index.js
var back_button_exports = {};
__export(back_button_exports, {
  default: () => back_button_default
});
module.exports = __toCommonJS(back_button_exports);
var import_editor = require("@wordpress/editor");
var import_components = require("@wordpress/components");
var import_fullscreen_mode_close = __toESM(require("./fullscreen-mode-close.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BackButton: BackButtonFill } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
var slideX = {
  hidden: { x: "-100%" },
  distractionFreeInactive: { x: 0 },
  hover: { x: 0, transition: { type: "tween", delay: 0.2 } }
};
function BackButton({ initialPost }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButtonFill, { children: ({ length }) => length <= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__unstableMotion.div,
    {
      variants: slideX,
      transition: { type: "tween", delay: 0.8 },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_fullscreen_mode_close.default,
        {
          showTooltip: true,
          initialPost
        }
      )
    }
  ) });
}
var back_button_default = BackButton;
//# sourceMappingURL=index.cjs.map
