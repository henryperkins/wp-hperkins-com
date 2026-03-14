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

// packages/annotations/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  __experimentalAddAnnotation: () => __experimentalAddAnnotation,
  __experimentalRemoveAnnotation: () => __experimentalRemoveAnnotation,
  __experimentalRemoveAnnotationsBySource: () => __experimentalRemoveAnnotationsBySource,
  __experimentalUpdateAnnotationRange: () => __experimentalUpdateAnnotationRange
});
module.exports = __toCommonJS(actions_exports);
var import_uuid = require("uuid");
function __experimentalAddAnnotation({
  blockClientId,
  richTextIdentifier = null,
  range = null,
  selector = "range",
  source = "default",
  id = (0, import_uuid.v4)()
}) {
  const action = {
    type: "ANNOTATION_ADD",
    id,
    blockClientId,
    richTextIdentifier,
    source,
    selector
  };
  if (selector === "range") {
    action.range = range;
  }
  return action;
}
function __experimentalRemoveAnnotation(annotationId) {
  return {
    type: "ANNOTATION_REMOVE",
    annotationId
  };
}
function __experimentalUpdateAnnotationRange(annotationId, start, end) {
  return {
    type: "ANNOTATION_UPDATE_RANGE",
    annotationId,
    start,
    end
  };
}
function __experimentalRemoveAnnotationsBySource(source) {
  return {
    type: "ANNOTATION_REMOVE_SOURCE",
    source
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalAddAnnotation,
  __experimentalRemoveAnnotation,
  __experimentalRemoveAnnotationsBySource,
  __experimentalUpdateAnnotationRange
});
//# sourceMappingURL=actions.cjs.map
