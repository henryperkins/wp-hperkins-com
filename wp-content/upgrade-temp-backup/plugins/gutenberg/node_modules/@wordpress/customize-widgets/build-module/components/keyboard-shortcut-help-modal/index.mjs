// packages/customize-widgets/src/components/keyboard-shortcut-help-modal/index.js
import clsx from "clsx";
import { Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
  useShortcut,
  store as keyboardShortcutsStore
} from "@wordpress/keyboard-shortcuts";
import { useDispatch, useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { textFormattingShortcuts } from "./config.mjs";
import Shortcut from "./shortcut.mjs";
import DynamicShortcut from "./dynamic-shortcut.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var ShortcutList = ({ shortcuts }) => (
  /*
   * Disable reason: The `list` ARIA role is redundant but
   * Safari+VoiceOver won't announce the list otherwise.
   */
  /* eslint-disable jsx-a11y/no-redundant-roles */
  /* @__PURE__ */ jsx(
    "ul",
    {
      className: "customize-widgets-keyboard-shortcut-help-modal__shortcut-list",
      role: "list",
      children: shortcuts.map((shortcut, index) => /* @__PURE__ */ jsx(
        "li",
        {
          className: "customize-widgets-keyboard-shortcut-help-modal__shortcut",
          children: typeof shortcut === "string" ? /* @__PURE__ */ jsx(DynamicShortcut, { name: shortcut }) : /* @__PURE__ */ jsx(Shortcut, { ...shortcut })
        },
        index
      ))
    }
  )
);
var ShortcutSection = ({ title, shortcuts, className }) => /* @__PURE__ */ jsxs(
  "section",
  {
    className: clsx(
      "customize-widgets-keyboard-shortcut-help-modal__section",
      className
    ),
    children: [
      !!title && /* @__PURE__ */ jsx("h2", { className: "customize-widgets-keyboard-shortcut-help-modal__section-title", children: title }),
      /* @__PURE__ */ jsx(ShortcutList, { shortcuts })
    ]
  }
);
var ShortcutCategorySection = ({
  title,
  categoryName,
  additionalShortcuts = []
}) => {
  const categoryShortcuts = useSelect(
    (select) => {
      return select(keyboardShortcutsStore).getCategoryShortcuts(
        categoryName
      );
    },
    [categoryName]
  );
  return /* @__PURE__ */ jsx(
    ShortcutSection,
    {
      title,
      shortcuts: categoryShortcuts.concat(additionalShortcuts)
    }
  );
};
function KeyboardShortcutHelpModal({
  isModalActive,
  toggleModal
}) {
  const { registerShortcut } = useDispatch(keyboardShortcutsStore);
  useEffect(() => {
    registerShortcut({
      name: "core/customize-widgets/keyboard-shortcuts",
      category: "main",
      description: __("Display these keyboard shortcuts."),
      keyCombination: {
        modifier: "access",
        character: "h"
      }
    });
  }, [registerShortcut]);
  useShortcut("core/customize-widgets/keyboard-shortcuts", toggleModal);
  if (!isModalActive) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      className: "customize-widgets-keyboard-shortcut-help-modal",
      title: __("Keyboard shortcuts"),
      onRequestClose: toggleModal,
      children: [
        /* @__PURE__ */ jsx(
          ShortcutSection,
          {
            className: "customize-widgets-keyboard-shortcut-help-modal__main-shortcuts",
            shortcuts: ["core/customize-widgets/keyboard-shortcuts"]
          }
        ),
        /* @__PURE__ */ jsx(
          ShortcutCategorySection,
          {
            title: __("Global shortcuts"),
            categoryName: "global"
          }
        ),
        /* @__PURE__ */ jsx(
          ShortcutCategorySection,
          {
            title: __("Selection shortcuts"),
            categoryName: "selection"
          }
        ),
        /* @__PURE__ */ jsx(
          ShortcutCategorySection,
          {
            title: __("Block shortcuts"),
            categoryName: "block",
            additionalShortcuts: [
              {
                keyCombination: { character: "/" },
                description: __(
                  "Change the block type after adding a new paragraph."
                ),
                /* translators: The forward-slash character. e.g. '/'. */
                ariaLabel: __("Forward-slash")
              }
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          ShortcutSection,
          {
            title: __("Text formatting"),
            shortcuts: textFormattingShortcuts
          }
        )
      ]
    }
  );
}
export {
  KeyboardShortcutHelpModal as default
};
//# sourceMappingURL=index.mjs.map
