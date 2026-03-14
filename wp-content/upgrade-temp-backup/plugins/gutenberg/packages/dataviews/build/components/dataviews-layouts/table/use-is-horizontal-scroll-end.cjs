"use strict";
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

// packages/dataviews/src/components/dataviews-layouts/table/use-is-horizontal-scroll-end.ts
var use_is_horizontal_scroll_end_exports = {};
__export(use_is_horizontal_scroll_end_exports, {
  useIsHorizontalScrollEnd: () => useIsHorizontalScrollEnd
});
module.exports = __toCommonJS(use_is_horizontal_scroll_end_exports);
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var isScrolledToEnd = (element) => {
  if ((0, import_i18n.isRTL)()) {
    const scrollLeft = Math.abs(element.scrollLeft);
    return scrollLeft <= 1;
  }
  return element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
};
function useIsHorizontalScrollEnd({
  scrollContainerRef,
  enabled = false
}) {
  const [isHorizontalScrollEnd, setIsHorizontalScrollEnd] = (0, import_element.useState)(false);
  const handleIsHorizontalScrollEnd = (0, import_compose.useDebounce)(
    (0, import_element.useCallback)(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        setIsHorizontalScrollEnd(isScrolledToEnd(scrollContainer));
      }
    }, [scrollContainerRef, setIsHorizontalScrollEnd]),
    200
  );
  (0, import_element.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsHorizontalScrollEnd
});
//# sourceMappingURL=use-is-horizontal-scroll-end.cjs.map
