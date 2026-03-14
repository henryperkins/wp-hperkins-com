// packages/block-editor/src/components/block-list/use-block-props/use-intersection-observer.js
import { useRefEffect } from "@wordpress/compose";
import { useContext } from "@wordpress/element";
import { IntersectionObserver } from "../index.mjs";
function useIntersectionObserver() {
  const observer = useContext(IntersectionObserver);
  return useRefEffect(
    (node) => {
      if (observer) {
        observer.observe(node);
        return () => {
          observer.unobserve(node);
        };
      }
    },
    [observer]
  );
}
export {
  useIntersectionObserver
};
//# sourceMappingURL=use-intersection-observer.mjs.map
