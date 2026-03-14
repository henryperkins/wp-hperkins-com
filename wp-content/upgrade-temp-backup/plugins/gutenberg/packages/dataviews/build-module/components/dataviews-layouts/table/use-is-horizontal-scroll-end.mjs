// packages/dataviews/src/components/dataviews-layouts/table/use-is-horizontal-scroll-end.ts
import { useDebounce } from "@wordpress/compose";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { isRTL } from "@wordpress/i18n";
var isScrolledToEnd = (element) => {
  if (isRTL()) {
    const scrollLeft = Math.abs(element.scrollLeft);
    return scrollLeft <= 1;
  }
  return element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
};
function useIsHorizontalScrollEnd({
  scrollContainerRef,
  enabled = false
}) {
  const [isHorizontalScrollEnd, setIsHorizontalScrollEnd] = useState(false);
  const handleIsHorizontalScrollEnd = useDebounce(
    useCallback(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        setIsHorizontalScrollEnd(isScrolledToEnd(scrollContainer));
      }
    }, [scrollContainerRef, setIsHorizontalScrollEnd]),
    200
  );
  useEffect(() => {
    if (typeof window === "undefined" || !enabled || !scrollContainerRef.current) {
      return () => {
      };
    }
    handleIsHorizontalScrollEnd();
    scrollContainerRef.current.addEventListener(
      "scroll",
      handleIsHorizontalScrollEnd
    );
    window.addEventListener("resize", handleIsHorizontalScrollEnd);
    return () => {
      scrollContainerRef.current?.removeEventListener(
        "scroll",
        handleIsHorizontalScrollEnd
      );
      window.removeEventListener("resize", handleIsHorizontalScrollEnd);
    };
  }, [scrollContainerRef, enabled]);
  return isHorizontalScrollEnd;
}
export {
  useIsHorizontalScrollEnd
};
//# sourceMappingURL=use-is-horizontal-scroll-end.mjs.map
