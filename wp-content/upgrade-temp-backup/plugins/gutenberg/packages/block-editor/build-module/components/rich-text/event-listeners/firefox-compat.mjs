// packages/block-editor/src/components/rich-text/event-listeners/firefox-compat.js
import { store as blockEditorStore } from "../../../store/index.mjs";
var firefox_compat_default = (props) => (element) => {
  function onFocus() {
    const { registry } = props.current;
    if (!registry.select(blockEditorStore).isMultiSelecting()) {
      return;
    }
    const parentEditable = element.parentElement.closest(
      '[contenteditable="true"]'
    );
    if (parentEditable) {
      parentEditable.focus();
    }
  }
  element.addEventListener("focus", onFocus);
  return () => {
    element.removeEventListener("focus", onFocus);
  };
};
export {
  firefox_compat_default as default
};
//# sourceMappingURL=firefox-compat.mjs.map
