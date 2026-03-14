// packages/block-editor/src/components/rich-text/toolbar-button.js
import { Fill, ToolbarButton } from "@wordpress/components";
import { displayShortcut } from "@wordpress/keycodes";
import { jsx } from "react/jsx-runtime";
function RichTextToolbarButton({
  name,
  shortcutType,
  shortcutCharacter,
  ...props
}) {
  let shortcut;
  let fillName = "RichText.ToolbarControls";
  if (name) {
    fillName += `.${name}`;
  }
  if (shortcutType && shortcutCharacter) {
    shortcut = displayShortcut[shortcutType](shortcutCharacter);
  }
  return /* @__PURE__ */ jsx(Fill, { name: fillName, children: /* @__PURE__ */ jsx(ToolbarButton, { ...props, shortcut }) });
}
export {
  RichTextToolbarButton
};
//# sourceMappingURL=toolbar-button.mjs.map
