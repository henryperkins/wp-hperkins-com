// packages/blocks/src/api/raw-handling/get-raw-transforms.js
import { getBlockTransforms } from "../factory.mjs";
function getRawTransforms() {
  return getBlockTransforms("from").filter(({ type }) => type === "raw").map((transform) => {
    return transform.isMatch ? transform : {
      ...transform,
      isMatch: (node) => transform.selector && node.matches(transform.selector)
    };
  });
}
export {
  getRawTransforms
};
//# sourceMappingURL=get-raw-transforms.mjs.map
