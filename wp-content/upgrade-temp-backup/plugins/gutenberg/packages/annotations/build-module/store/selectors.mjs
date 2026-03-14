// packages/annotations/src/store/selectors.js
import { createSelector } from "@wordpress/data";
var EMPTY_ARRAY = [];
var __experimentalGetAnnotationsForBlock = createSelector(
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
var __experimentalGetAnnotationsForRichText = createSelector(
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
export {
  __experimentalGetAllAnnotationsForBlock,
  __experimentalGetAnnotations,
  __experimentalGetAnnotationsForBlock,
  __experimentalGetAnnotationsForRichText
};
//# sourceMappingURL=selectors.mjs.map
