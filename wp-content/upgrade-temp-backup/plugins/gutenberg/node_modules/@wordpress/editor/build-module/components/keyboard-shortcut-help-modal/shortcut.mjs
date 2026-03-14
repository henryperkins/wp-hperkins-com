// packages/editor/src/components/keyboard-shortcut-help-modal/shortcut.js
import { Fragment } from "@wordpress/element";
import { displayShortcutList, shortcutAriaLabel } from "@wordpress/keycodes";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
function KeyCombination({ keyCombination, forceAriaLabel }) {
  const shortcut = keyCombination.modifier ? displayShortcutList[keyCombination.modifier](
    keyCombination.character
  ) : keyCombination.character;
  const ariaLabel = keyCombination.modifier ? shortcutAriaLabel[keyCombination.modifier](
    keyCombination.character
  ) : keyCombination.character;
  return /* @__PURE__ */ jsx(
    "kbd",
    {
      className: "editor-keyboard-shortcut-help-modal__shortcut-key-combination",
      "aria-label": forceAriaLabel || ariaLabel,
      children: (Array.isArray(shortcut) ? shortcut : [shortcut]).map(
        (character, index) => {
          if (character === "+") {
            return /* @__PURE__ */ jsx(Fragment, { children: character }, index);
          }
          return /* @__PURE__ */ jsx(
            "kbd",
            {
              className: "editor-keyboard-shortcut-help-modal__shortcut-key",
              children: character
            },
            index
          );
        }
      )
    }
  );
}
function Shortcut({ description, keyCombination, aliases = [], ariaLabel }) {
  return /* @__PURE__ */ jsxs(Fragment2, { children: [
    /* @__PURE__ */ jsx("div", { className: "editor-keyboard-shortcut-help-modal__shortcut-description", children: description }),
    /* @__PURE__ */ jsxs("div", { className: "editor-keyboard-shortcut-help-modal__shortcut-term", children: [
      /* @__PURE__ */ jsx(
        KeyCombination,
        {
          keyCombination,
          forceAriaLabel: ariaLabel
        }
      ),
      aliases.map((alias, index) => /* @__PURE__ */ jsx(
        KeyCombination,
        {
          keyCombination: alias,
          forceAriaLabel: ariaLabel
        },
        index
      ))
    ] })
  ] });
}
var shortcut_default = Shortcut;
export {
  shortcut_default as default
};
//# sourceMappingURL=shortcut.mjs.map
