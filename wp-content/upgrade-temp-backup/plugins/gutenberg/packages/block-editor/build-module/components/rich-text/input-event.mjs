// packages/block-editor/src/components/rich-text/input-event.js
import { useEffect, useContext, useRef } from "@wordpress/element";
import { inputEventContext } from "./index.mjs";
function __unstableRichTextInputEvent({ inputType, onInput }) {
  const callbacks = useContext(inputEventContext);
  const onInputRef = useRef();
  onInputRef.current = onInput;
  useEffect(() => {
    function callback(event) {
      if (event.inputType === inputType) {
        onInputRef.current();
        event.preventDefault();
      }
    }
    callbacks.current.add(callback);
    return () => {
      callbacks.current.delete(callback);
    };
  }, [inputType]);
  return null;
}
export {
  __unstableRichTextInputEvent
};
//# sourceMappingURL=input-event.mjs.map
