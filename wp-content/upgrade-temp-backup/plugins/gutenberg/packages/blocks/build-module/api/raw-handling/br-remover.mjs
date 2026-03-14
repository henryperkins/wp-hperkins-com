// packages/blocks/src/api/raw-handling/br-remover.js
import { getSibling } from "./utils.mjs";
function brRemover(node) {
  if (node.nodeName !== "BR") {
    return;
  }
  if (getSibling(node, "next")) {
    return;
  }
  node.parentNode.removeChild(node);
}
export {
  brRemover as default
};
//# sourceMappingURL=br-remover.mjs.map
