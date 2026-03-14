// packages/annotations/src/store/actions.js
import { v4 as uuid } from "uuid";
function __experimentalAddAnnotation({
  blockClientId,
  richTextIdentifier = null,
  range = null,
  selector = "range",
  source = "default",
  id = uuid()
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
export {
  __experimentalAddAnnotation,
  __experimentalRemoveAnnotation,
  __experimentalRemoveAnnotationsBySource,
  __experimentalUpdateAnnotationRange
};
//# sourceMappingURL=actions.mjs.map
