// packages/block-editor/src/components/rich-text/event-listeners/insert-replacement-text.js
import { store as blockEditorStore } from "../../../store/index.mjs";
var insert_replacement_text_default = (props) => (element) => {
  function onInput(event) {
    if (event.inputType !== "insertReplacementText") {
      return;
    }
    const { registry } = props.current;
    registry.dispatch(blockEditorStore).__unstableMarkLastChangeAsPersistent();
  }
  element.addEventListener("beforeinput", onInput);
  return () => {
    element.removeEventListener("beforeinput", onInput);
  };
};
export {
  insert_replacement_text_default as default
};
//# sourceMappingURL=insert-replacement-text.mjs.map
