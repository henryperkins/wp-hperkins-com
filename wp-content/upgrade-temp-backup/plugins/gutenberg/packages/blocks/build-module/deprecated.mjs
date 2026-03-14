// packages/blocks/src/deprecated.js
import deprecated from "@wordpress/deprecated";
function withBlockContentContext(OriginalComponent) {
  deprecated("wp.blocks.withBlockContentContext", {
    since: "6.1"
  });
  return OriginalComponent;
}
export {
  withBlockContentContext
};
//# sourceMappingURL=deprecated.mjs.map
