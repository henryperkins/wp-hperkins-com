// packages/editor/src/components/zoom-out-toggle/index.js
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { square as zoomOutIcon } from "@wordpress/icons";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  useShortcut,
  store as keyboardShortcutsStore
} from "@wordpress/keyboard-shortcuts";
import { isAppleOS } from "@wordpress/keycodes";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var ZoomOutToggle = ({ disabled }) => {
  const { isZoomOut, showIconLabels, isDistractionFree } = useSelect(
    (select) => ({
      isZoomOut: unlock(select(blockEditorStore)).isZoomOut(),
      showIconLabels: select(preferencesStore).get(
        "core",
        "showIconLabels"
      ),
      isDistractionFree: select(preferencesStore).get(
        "core",
        "distractionFree"
      )
    })
  );
  const { resetZoomLevel, setZoomLevel } = unlock(
    useDispatch(blockEditorStore)
  );
  const { registerShortcut, unregisterShortcut } = useDispatch(
    keyboardShortcutsStore
  );
  useEffect(() => {
    registerShortcut({
      name: "core/editor/zoom",
      category: "global",
      description: __("Enter or exit zoom out."),
      keyCombination: {
        // `primaryShift+0` (`ctrl+shift+0`) is the shortcut for switching
        // to input mode in Windows, so apply a different key combination.
        modifier: isAppleOS() ? "primaryShift" : "secondary",
        character: "0"
      }
    });
    return () => {
      unregisterShortcut("core/editor/zoom");
    };
  }, [registerShortcut, unregisterShortcut]);
  useShortcut(
    "core/editor/zoom",
    () => {
      if (isZoomOut) {
        resetZoomLevel();
      } else {
        setZoomLevel("auto-scaled");
      }
    },
    {
      isDisabled: isDistractionFree
    }
  );
  const handleZoomOut = () => {
    if (isZoomOut) {
      resetZoomLevel();
    } else {
      setZoomLevel("auto-scaled");
    }
  };
  return /* @__PURE__ */ jsx(
    Button,
    {
      accessibleWhenDisabled: true,
      disabled,
      onClick: handleZoomOut,
      icon: zoomOutIcon,
      label: __("Zoom Out"),
      isPressed: isZoomOut,
      size: "compact",
      showTooltip: !showIconLabels,
      className: "editor-zoom-out-toggle"
    }
  );
};
var zoom_out_toggle_default = ZoomOutToggle;
export {
  zoom_out_toggle_default as default
};
//# sourceMappingURL=index.mjs.map
