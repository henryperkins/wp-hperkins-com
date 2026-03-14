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

// packages/edit-site-init/src/index.ts
var index_exports = {};
__export(index_exports, {
  init: () => init
});
module.exports = __toCommonJS(index_exports);
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_boot = require("@wordpress/boot");
async function init() {
  const menuIcons = {
    home: { icon: import_icons.home },
    styles: { icon: import_icons.styles },
    navigation: { icon: import_icons.navigation },
    pages: { icon: import_icons.page },
    templateParts: { icon: import_icons.symbolFilled },
    patterns: { icon: import_icons.symbol },
    templates: { icon: import_icons.layout }
  };
  Object.entries(menuIcons).forEach(([id, { icon }]) => {
    (0, import_data.dispatch)(import_boot.store).updateMenuItem(id, { icon });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  init
});
//# sourceMappingURL=index.cjs.map
