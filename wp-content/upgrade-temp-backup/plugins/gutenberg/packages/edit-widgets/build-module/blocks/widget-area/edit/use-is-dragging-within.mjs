// packages/edit-widgets/src/blocks/widget-area/edit/use-is-dragging-within.js
import { useState, useEffect } from "@wordpress/element";
var useIsDraggingWithin = (elementRef) => {
  const [isDraggingWithin, setIsDraggingWithin] = useState(false);
  useEffect(() => {
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
  }, []);
  return isDraggingWithin;
};
var use_is_dragging_within_default = useIsDraggingWithin;
export {
  use_is_dragging_within_default as default
};
//# sourceMappingURL=use-is-dragging-within.mjs.map
