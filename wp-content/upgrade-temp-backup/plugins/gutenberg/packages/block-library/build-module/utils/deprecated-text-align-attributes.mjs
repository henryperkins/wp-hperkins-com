// packages/block-library/src/utils/deprecated-text-align-attributes.js
import { useEvent } from "@wordpress/compose";
import { useEffect, useRef } from "@wordpress/element";
import deprecated from "@wordpress/deprecated";
import { useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
function useDeprecatedTextAlign(props) {
  const { name, attributes, setAttributes } = props;
  const { textAlign } = attributes;
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const updateStyleWithAlign = useEvent(() => {
    deprecated(`textAlign attribute in ${name}`, {
      alternative: "style.typography.textAlign",
      since: "7.0"
    });
    __unstableMarkNextChangeAsNotPersistent();
    setAttributes((currentAttr) => ({
      style: {
        ...currentAttr.style,
        typography: {
          ...currentAttr.style?.typography,
          textAlign
        }
      }
    }));
  });
  const lastUpdatedAlignRef = useRef();
  useEffect(() => {
    if (textAlign === lastUpdatedAlignRef.current) {
      return;
    }
    lastUpdatedAlignRef.current = textAlign;
    updateStyleWithAlign();
  }, [textAlign, updateStyleWithAlign]);
}
export {
  useDeprecatedTextAlign as default
};
//# sourceMappingURL=deprecated-text-align-attributes.mjs.map
