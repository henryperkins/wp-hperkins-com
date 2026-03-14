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

// packages/interface/src/components/complementary-area-header/index.js
var complementary_area_header_exports = {};
__export(complementary_area_header_exports, {
  default: () => complementary_area_header_default
});
module.exports = __toCommonJS(complementary_area_header_exports);
var import_clsx = __toESM(require("clsx"));
var import_icons = require("@wordpress/icons");
var import_complementary_area_toggle = __toESM(require("../complementary-area-toggle/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var ComplementaryAreaHeader = ({
  children,
  className,
  toggleButtonProps
}) => {
  const toggleButton = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_complementary_area_toggle.default, { icon: import_icons.closeSmall, ...toggleButtonProps });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: (0, import_clsx.default)(
        "components-panel__header",
        "interface-complementary-area-header",
        className
      ),
      tabIndex: -1,
      children: [
        children,
        toggleButton
      ]
    }
  );
};
var complementary_area_header_default = ComplementaryAreaHeader;
//# sourceMappingURL=index.cjs.map
