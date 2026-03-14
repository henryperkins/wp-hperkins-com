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

// packages/interface/src/components/index.js
var components_exports = {};
__export(components_exports, {
  ActionItem: () => import_action_item.default,
  ComplementaryArea: () => import_complementary_area.default,
  ComplementaryAreaMoreMenuItem: () => import_complementary_area_more_menu_item.default,
  FullscreenMode: () => import_fullscreen_mode.default,
  InterfaceSkeleton: () => import_interface_skeleton.default,
  PinnedItems: () => import_pinned_items.default
});
module.exports = __toCommonJS(components_exports);
var import_complementary_area = __toESM(require("./complementary-area/index.cjs"));
var import_complementary_area_more_menu_item = __toESM(require("./complementary-area-more-menu-item/index.cjs"));
var import_fullscreen_mode = __toESM(require("./fullscreen-mode/index.cjs"));
var import_interface_skeleton = __toESM(require("./interface-skeleton/index.cjs"));
var import_pinned_items = __toESM(require("./pinned-items/index.cjs"));
var import_action_item = __toESM(require("./action-item/index.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionItem,
  ComplementaryArea,
  ComplementaryAreaMoreMenuItem,
  FullscreenMode,
  InterfaceSkeleton,
  PinnedItems
});
//# sourceMappingURL=index.cjs.map
