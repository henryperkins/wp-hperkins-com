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

// packages/edit-post/src/components/welcome-guide/index.js
var welcome_guide_exports = {};
__export(welcome_guide_exports, {
  default: () => WelcomeGuide
});
module.exports = __toCommonJS(welcome_guide_exports);
var import_data = require("@wordpress/data");
var import_default = __toESM(require("./default.cjs"));
var import_template = __toESM(require("./template.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WelcomeGuide({ postType }) {
  const { isActive, isEditingTemplate } = (0, import_data.useSelect)(
    (select) => {
      const { isFeatureActive } = select(import_store.store);
      const _isEditingTemplate = postType === "wp_template";
      const feature = _isEditingTemplate ? "welcomeGuideTemplate" : "welcomeGuide";
      return {
        isActive: isFeatureActive(feature),
        isEditingTemplate: _isEditingTemplate
      };
    },
    [postType]
  );
  if (!isActive) {
    return null;
  }
  return isEditingTemplate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_template.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_default.default, {});
}
//# sourceMappingURL=index.cjs.map
