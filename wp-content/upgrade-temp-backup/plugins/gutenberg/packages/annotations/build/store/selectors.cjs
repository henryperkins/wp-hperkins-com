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

// packages/annotations/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  __experimentalGetAllAnnotationsForBlock: () => __experimentalGetAllAnnotationsForBlock,
  __experimentalGetAnnotations: () => __experimentalGetAnnotations,
  __experimentalGetAnnotationsForBlock: () => __experimentalGetAnnotationsForBlock,
  __experimentalGetAnnotationsForRichText: () => __experimentalGetAnnotationsForRichText
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var EMPTY_ARRAY = [];
var __experimentalGetAnnotationsForBlock = (0, import_data.createSelector)(
  (state, blockClientId) => {
    return (state?.[blockClientId] ?? []).filter((annotation) => {
      return annotation.selector === "block";
    });
  },
  (state, blockClientId) => [state?.[blockClientId] ?? EMPTY_ARRAY]
);
function __experimentalGetAllAnnotationsForBlock(state, blockClientId) {
  return state?.[blockClientId] ?? EMPTY_ARRAY;
}
var __experimentalGetAnnotationsForRichText = (0, import_data.createSelector)(
  (state, blockClientId, richTextIdentifier) => {
    return (state?.[blockClientId] ?? []).filter((annotation) => {
      return annotation.selector === "range" && richTextIdentifier === annotation.richTextIdentifier;
    }).map((annotation) => {
      const { range, ...other } = annotation;
      return {
        ...range,
        ...other
      };
    });
  },
  (state, blockClientId) => [state?.[blockClientId] ?? EMPTY_ARRAY]
);
function __experimentalGetAnnotations(state) {
  return Object.values(state).flat();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalGetAllAnnotationsForBlock,
  __experimentalGetAnnotations,
  __experimentalGetAnnotationsForBlock,
  __experimentalGetAnnotationsForRichText
});
//# sourceMappingURL=selectors.cjs.map
