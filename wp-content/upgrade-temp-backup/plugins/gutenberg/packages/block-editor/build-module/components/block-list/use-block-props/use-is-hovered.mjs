// packages/block-editor/src/components/block-list/use-block-props/use-is-hovered.js
import { useRefEffect } from "@wordpress/compose";
function listener(event) {
  if (event.defaultPrevented) {
    return;
  }
  event.preventDefault();
  event.currentTarget.classList.toggle(
    "is-hovered",
    event.type === "mouseover"
  );
}
function useIsHovered({ isEnabled = true } = {}) {
  return useRefEffect(
    (node) => {
      if (!isEnabled) {
        return;
      }
      node.addEventListener("mouseout", listener);
      node.addEventListener("mouseover", listener);
      return () => {
        node.removeEventListener("mouseout", listener);
        node.removeEventListener("mouseover", listener);
        node.classList.remove("is-hovered");
      };
    },
    [isEnabled]
  );
}
export {
  useIsHovered
};
//# sourceMappingURL=use-is-hovered.mjs.map
