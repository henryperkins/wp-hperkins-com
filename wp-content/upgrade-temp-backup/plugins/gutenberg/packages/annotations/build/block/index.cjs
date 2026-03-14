// packages/annotations/src/block/index.js
var import_hooks = require("@wordpress/hooks");
var import_data = require("@wordpress/data");
var import_constants = require("../store/constants.cjs");
var addAnnotationClassName = (OriginalComponent) => {
  return (0, import_data.withSelect)((select, { clientId, className }) => {
    const annotations = select(import_constants.STORE_NAME).__experimentalGetAnnotationsForBlock(
      clientId
    );
    return {
      className: annotations.map((annotation) => {
        return "is-annotated-by-" + annotation.source;
      }).concat(className).filter(Boolean).join(" ")
    };
  })(OriginalComponent);
};
(0, import_hooks.addFilter)(
  "editor.BlockListBlock",
  "core/annotations",
  addAnnotationClassName
);
//# sourceMappingURL=index.cjs.map
