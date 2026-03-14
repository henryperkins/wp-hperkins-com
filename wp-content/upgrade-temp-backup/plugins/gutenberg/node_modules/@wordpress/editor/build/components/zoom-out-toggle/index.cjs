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

// packages/editor/src/components/zoom-out-toggle/index.js
var zoom_out_toggle_exports = {};
__export(zoom_out_toggle_exports, {
  default: () => zoom_out_toggle_default
});
module.exports = __toCommonJS(zoom_out_toggle_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_preferences = require("@wordpress/preferences");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_keycodes = require("@wordpress/keycodes");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var ZoomOutToggle = ({ disabled }) => {
  const { isZoomOut, showIconLabels, isDistractionFree } = (0, import_data.useSelect)(
    (select) => ({
      isZoomOut: (0, import_lock_unlock.unlock)(select(import_block_editor.store)).isZoomOut(),
      showIconLabels: select(import_preferences.store).get(
        "core",
        "showIconLabels"
      ),
      isDistractionFree: select(import_preferences.store).get(
        "core",
        "distractionFree"
      )
    })
  );
  const { resetZoomLevel, setZoomLevel } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_block_editor.store)
  );
  const { registerShortcut, unregisterShortcut } = (0, import_data.useDispatch)(
    import_keyboard_shortcuts.store
  );
  (0, import_element.useEffect)(() => {
    registerShortcut({
      name: "core/editor/zoom",
      category: "global",
      description: (0, import_i18n.__)("Enter or exit zoom out."),
      keyCombination: {
        // `primaryShift+0` (`ctrl+shift+0`) is the shortcut for switching
        // to input mode in Windows, so apply a different key combination.
        modifier: (0, import_keycodes.isAppleOS)() ? "primaryShift" : "secondary",
        character: "0"
      }
    });
    return () => {
      unregisterShortcut("core/editor/zoom");
    };
  }, [registerShortcut, unregisterShortcut]);
  (0, import_keyboard_shortcuts.useShortcut)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      accessibleWhenDisabled: true,
      disabled,
      onClick: handleZoomOut,
      icon: import_icons.square,
      label: (0, import_i18n.__)("Zoom Out"),
      isPressed: isZoomOut,
      size: "compact",
      showTooltip: !showIconLabels,
      className: "editor-zoom-out-toggle"
    }
  );
};
var zoom_out_toggle_default = ZoomOutToggle;
//# sourceMappingURL=index.cjs.map
