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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/widgets/src/index.js
var index_exports = {};
__export(index_exports, {
  registerLegacyWidgetBlock: () => registerLegacyWidgetBlock,
  registerLegacyWidgetVariations: () => import_register_legacy_widget_variations.default,
  registerWidgetGroupBlock: () => registerWidgetGroupBlock
});
module.exports = __toCommonJS(index_exports);
var import_blocks = require("@wordpress/blocks");
var legacyWidget = __toESM(require("./blocks/legacy-widget/index.cjs"));
var widgetGroup = __toESM(require("./blocks/widget-group/index.cjs"));
__reExport(index_exports, require("./components/index.cjs"), module.exports);
__reExport(index_exports, require("./utils.cjs"), module.exports);
var import_register_legacy_widget_variations = __toESM(require("./register-legacy-widget-variations.cjs"));
function registerLegacyWidgetBlock(supports = {}) {
  const { metadata, settings, name } = legacyWidget;
  (0, import_blocks.registerBlockType)(
    { name, ...metadata },
    {
      ...settings,
      supports: {
        ...settings.supports,
        ...supports
      }
    }
  );
}
function registerWidgetGroupBlock(supports = {}) {
  const { metadata, settings, name } = widgetGroup;
  (0, import_blocks.registerBlockType)(
    { name, ...metadata },
    {
      ...settings,
      supports: {
        ...settings.supports,
        ...supports
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerLegacyWidgetBlock,
  registerLegacyWidgetVariations,
  registerWidgetGroupBlock,
  ...require("./components/index.cjs"),
  ...require("./utils.cjs")
});
//# sourceMappingURL=index.cjs.map
