// packages/block-editor/src/components/rich-text/event-listeners/index.js
import { useMemo, useRef, useInsertionEffect } from "@wordpress/element";
import { useRefEffect } from "@wordpress/compose";
import beforeInputRules from "./before-input-rules.mjs";
import inputRules from "./input-rules.mjs";
import insertReplacementText from "./insert-replacement-text.mjs";
import removeBrowserShortcuts from "./remove-browser-shortcuts.mjs";
import shortcuts from "./shortcuts.mjs";
import inputEvents from "./input-events.mjs";
import undoAutomaticChange from "./undo-automatic-change.mjs";
import pasteHandler from "./paste-handler.mjs";
import _delete from "./delete.mjs";
import enter from "./enter.mjs";
import firefoxCompat from "./firefox-compat.mjs";
var allEventListeners = [
  beforeInputRules,
  inputRules,
  insertReplacementText,
  removeBrowserShortcuts,
  shortcuts,
  inputEvents,
  undoAutomaticChange,
  pasteHandler,
  _delete,
  enter,
  firefoxCompat
];
function useEventListeners(props) {
  const propsRef = useRef(props);
  useInsertionEffect(() => {
    propsRef.current = props;
  });
  const refEffects = useMemo(
    () => allEventListeners.map((refEffect) => refEffect(propsRef)),
    [propsRef]
  );
  return useRefEffect(
    (element) => {
      if (!props.isSelected) {
        return;
      }
      const cleanups = refEffects.map((effect) => effect(element));
      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    [refEffects, props.isSelected]
  );
}
export {
  useEventListeners
};
//# sourceMappingURL=index.mjs.map
