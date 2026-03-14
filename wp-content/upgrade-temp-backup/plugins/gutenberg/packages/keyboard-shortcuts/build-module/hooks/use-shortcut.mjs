// packages/keyboard-shortcuts/src/hooks/use-shortcut.js
import { useContext, useEffect, useRef } from "@wordpress/element";
import useShortcutEventMatch from "./use-shortcut-event-match.mjs";
import { context } from "../context.mjs";
function useShortcut(name, callback, { isDisabled = false } = {}) {
  const shortcuts = useContext(context);
  const isMatch = useShortcutEventMatch();
  const callbackRef = useRef();
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (isDisabled) {
      return;
    }
    function _callback(event) {
      if (isMatch(name, event)) {
        callbackRef.current(event);
      }
    }
    shortcuts.add(_callback);
    return () => {
      shortcuts.delete(_callback);
    };
  }, [name, isDisabled, shortcuts]);
}
export {
  useShortcut as default
};
//# sourceMappingURL=use-shortcut.mjs.map
