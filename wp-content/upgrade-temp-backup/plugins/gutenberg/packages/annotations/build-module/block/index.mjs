// packages/annotations/src/block/index.js
import { addFilter } from "@wordpress/hooks";
import { withSelect } from "@wordpress/data";
import { STORE_NAME } from "../store/constants.mjs";
var addAnnotationClassName = (OriginalComponent) => {
  return withSelect((select, { clientId, className }) => {
    const annotations = select(STORE_NAME).__experimentalGetAnnotationsForBlock(
      clientId
    );
    return {
      className: annotations.map((annotation) => {
        return "is-annotated-by-" + annotation.source;
      }).concat(className).filter(Boolean).join(" ")
    };
  })(OriginalComponent);
};
addFilter(
  "editor.BlockListBlock",
  "core/annotations",
  addAnnotationClassName
);
//# sourceMappingURL=index.mjs.map
