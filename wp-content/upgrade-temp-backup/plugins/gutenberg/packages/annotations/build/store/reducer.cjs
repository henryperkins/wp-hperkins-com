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

// packages/annotations/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  annotations: () => annotations,
  default: () => reducer_default
});
module.exports = __toCommonJS(reducer_exports);
function filterWithReference(collection, predicate) {
  const filteredCollection = collection.filter(predicate);
  return collection.length === filteredCollection.length ? collection : filteredCollection;
}
var mapValues = (obj, callback) => Object.entries(obj).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: callback(value)
  }),
  {}
);
function isValidAnnotationRange(annotation) {
  return typeof annotation.start === "number" && typeof annotation.end === "number" && annotation.start <= annotation.end;
}
function annotations(state = {}, action) {
  switch (action.type) {
    case "ANNOTATION_ADD":
      const blockClientId = action.blockClientId;
      const newAnnotation = {
        id: action.id,
        blockClientId,
        richTextIdentifier: action.richTextIdentifier,
        source: action.source,
        selector: action.selector,
        range: action.range
      };
      if (newAnnotation.selector === "range" && !isValidAnnotationRange(newAnnotation.range)) {
        return state;
      }
      const previousAnnotationsForBlock = state?.[blockClientId] ?? [];
      return {
        ...state,
        [blockClientId]: [
          ...previousAnnotationsForBlock,
          newAnnotation
        ]
      };
    case "ANNOTATION_REMOVE":
      return mapValues(state, (annotationsForBlock) => {
        return filterWithReference(
          annotationsForBlock,
          (annotation) => {
            return annotation.id !== action.annotationId;
          }
        );
      });
    case "ANNOTATION_UPDATE_RANGE":
      return mapValues(state, (annotationsForBlock) => {
        let hasChangedRange = false;
        const newAnnotations = annotationsForBlock.map(
          (annotation) => {
            if (annotation.id === action.annotationId) {
              hasChangedRange = true;
              return {
                ...annotation,
                range: {
                  start: action.start,
                  end: action.end
                }
              };
            }
            return annotation;
          }
        );
        return hasChangedRange ? newAnnotations : annotationsForBlock;
      });
    case "ANNOTATION_REMOVE_SOURCE":
      return mapValues(state, (annotationsForBlock) => {
        return filterWithReference(
          annotationsForBlock,
          (annotation) => {
            return annotation.source !== action.source;
          }
        );
      });
  }
  return state;
}
var reducer_default = annotations;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  annotations
});
//# sourceMappingURL=reducer.cjs.map
