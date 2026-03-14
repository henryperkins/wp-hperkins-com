// packages/block-library/src/paragraph/deprecated-attributes.js
import { useEvent } from "@wordpress/compose";
import { useEffect, useRef } from "@wordpress/element";
import deprecated from "@wordpress/deprecated";
import { useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
function useDeprecatedAlign(align, style, setAttributes) {
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const updateStyleWithAlign = useEvent(() => {
    deprecated("align attribute in paragraph block", {
      alternative: "style.typography.textAlign",
      since: "7.0"
    });
    __unstableMarkNextChangeAsNotPersistent();
    setAttributes({
      style: {
        ...style,
        typography: {
          ...style?.typography,
          textAlign: align
        }
      }
    });
  });
  const lastUpdatedAlignRef = useRef();
  useEffect(() => {
    if (align === "full" || align === "wide" || align === lastUpdatedAlignRef.current) {
      return;
    }
    lastUpdatedAlignRef.current = align;
    updateStyleWithAlign();
  }, [align, updateStyleWithAlign]);
}
export {
  useDeprecatedAlign as default
};
//# sourceMappingURL=deprecated-attributes.mjs.map
