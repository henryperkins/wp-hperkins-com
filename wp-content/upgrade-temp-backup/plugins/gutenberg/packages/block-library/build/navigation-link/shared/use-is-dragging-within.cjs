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

// packages/block-library/src/navigation-link/shared/use-is-dragging-within.js
var use_is_dragging_within_exports = {};
__export(use_is_dragging_within_exports, {
  useIsDraggingWithin: () => useIsDraggingWithin
});
module.exports = __toCommonJS(use_is_dragging_within_exports);
var import_element = require("@wordpress/element");
var useIsDraggingWithin = (elementRef) => {
  const [isDraggingWithin, setIsDraggingWithin] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    const { ownerDocument } = elementRef.current;
    function handleDragStart(event) {
      handleDragEnter(event);
    }
    function handleDragEnd() {
      setIsDraggingWithin(false);
    }
    function handleDragEnter(event) {
      if (elementRef.current.contains(event.target)) {
        setIsDraggingWithin(true);
      } else {
        setIsDraggingWithin(false);
      }
    }
    ownerDocument.addEventListener("dragstart", handleDragStart);
    ownerDocument.addEventListener("dragend", handleDragEnd);
    ownerDocument.addEventListener("dragenter", handleDragEnter);
    return () => {
      ownerDocument.removeEventListener("dragstart", handleDragStart);
      ownerDocument.removeEventListener("dragend", handleDragEnd);
      ownerDocument.removeEventListener("dragenter", handleDragEnter);
    };
  }, [elementRef]);
  return isDraggingWithin;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useIsDraggingWithin
});
//# sourceMappingURL=use-is-dragging-within.cjs.map
