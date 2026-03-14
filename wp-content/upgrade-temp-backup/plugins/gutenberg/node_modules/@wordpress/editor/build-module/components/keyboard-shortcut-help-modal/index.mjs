// packages/editor/src/components/keyboard-shortcut-help-modal/index.js
import clsx from "clsx";
import { Modal } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
  useShortcut,
  store as keyboardShortcutsStore
} from "@wordpress/keyboard-shortcuts";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as interfaceStore } from "@wordpress/interface";
import { textFormattingShortcuts } from "./config.mjs";
import Shortcut from "./shortcut.mjs";
import DynamicShortcut from "./dynamic-shortcut.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var KEYBOARD_SHORTCUT_HELP_MODAL_NAME = "editor/keyboard-shortcut-help";
var ShortcutList = ({ shortcuts }) => (
  /*
   * Disable reason: The `list` ARIA role is redundant but
   * Safari+VoiceOver won't announce the list otherwise.
   */
  /* eslint-disable jsx-a11y/no-redundant-roles */
  /* @__PURE__ */ jsx(
    "ul",
    {
      className: "editor-keyboard-shortcut-help-modal__shortcut-list",
      role: "list",
      children: shortcuts.map((shortcut, index) => /* @__PURE__ */ jsx(
        "li",
        {
          className: "editor-keyboard-shortcut-help-modal__shortcut",
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
      "editor-keyboard-shortcut-help-modal__section",
      className
    ),
    children: [
      !!title && /* @__PURE__ */ jsx("h2", { className: "editor-keyboard-shortcut-help-modal__section-title", children: title }),
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
function KeyboardShortcutHelpModal() {
  const isModalActive = useSelect(
    (select) => select(interfaceStore).isModalActive(
      KEYBOARD_SHORTCUT_HELP_MODAL_NAME
    ),
    []
  );
  const { openModal, closeModal } = useDispatch(interfaceStore);
  const toggleModal = () => {
    if (isModalActive) {
      closeModal();
    } else {
      openModal(KEYBOARD_SHORTCUT_HELP_MODAL_NAME);
    }
  };
  useShortcut("core/editor/keyboard-shortcuts", toggleModal);
  if (!isModalActive) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      className: "editor-keyboard-shortcut-help-modal",
      title: __("Keyboard shortcuts"),
      closeButtonLabel: __("Close"),
      onRequestClose: toggleModal,
      children: [
        /* @__PURE__ */ jsx(
          ShortcutSection,
          {
            className: "editor-keyboard-shortcut-help-modal__main-shortcuts",
            shortcuts: ["core/editor/keyboard-shortcuts"]
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
        ),
        /* @__PURE__ */ jsx(
          ShortcutCategorySection,
          {
            title: __("List View shortcuts"),
            categoryName: "list-view"
          }
        )
      ]
    }
  );
}
var keyboard_shortcut_help_modal_default = KeyboardShortcutHelpModal;
export {
  keyboard_shortcut_help_modal_default as default
};
//# sourceMappingURL=index.mjs.map
