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

// packages/patterns/src/api/index.js
var api_exports = {};
__export(api_exports, {
  isOverridableBlock: () => isOverridableBlock
});
module.exports = __toCommonJS(api_exports);
function isOverridableBlock(block) {
  return !!block.attributes.metadata?.name && !!block.attributes.metadata?.bindings && Object.values(block.attributes.metadata.bindings).some(
    (binding) => binding.source === "core/pattern-overrides"
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isOverridableBlock
});
//# sourceMappingURL=index.cjs.map
