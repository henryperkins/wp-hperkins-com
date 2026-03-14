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

// packages/global-styles-ui/src/variations/variations-panel.tsx
var variations_panel_exports = {};
__export(variations_panel_exports, {
  VariationsPanel: () => VariationsPanel,
  useBlockVariations: () => useBlockVariations
});
module.exports = __toCommonJS(variations_panel_exports);
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_navigation_button = require("../navigation-button.cjs");
var import_hooks = require("../hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function getFilteredBlockStyles(blockStyles, variations) {
  return blockStyles?.filter(
    (style) => style.source === "block" || variations.includes(style.name)
  ) || [];
}
function useBlockVariations(name) {
  const blockStyles = (0, import_data.useSelect)(
    (select) => {
      const { getBlockStyles } = select(import_blocks.store);
      return getBlockStyles(name);
    },
    [name]
  );
  const [variations] = (0, import_hooks.useStyle)("variations", name);
  const variationNames = Object.keys(variations ?? {});
  return getFilteredBlockStyles(blockStyles, variationNames);
}
function VariationsPanel({ name }) {
  const coreBlockStyles = useBlockVariations(name);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: coreBlockStyles.map((style, index) => {
    if (style?.isDefault) {
      return null;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_navigation_button.NavigationButtonAsItem,
      {
        path: "/blocks/" + encodeURIComponent(name) + "/variations/" + encodeURIComponent(style.name),
        children: style.label
      },
      index
    );
  }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VariationsPanel,
  useBlockVariations
});
//# sourceMappingURL=variations-panel.cjs.map
