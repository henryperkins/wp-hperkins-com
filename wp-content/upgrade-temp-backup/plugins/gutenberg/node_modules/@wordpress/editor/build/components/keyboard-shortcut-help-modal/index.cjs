"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/keyboard-shortcut-help-modal/index.js
var keyboard_shortcut_help_modal_exports = {};
__export(keyboard_shortcut_help_modal_exports, {
  default: () => keyboard_shortcut_help_modal_default
});
module.exports = __toCommonJS(keyboard_shortcut_help_modal_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_data = require("@wordpress/data");
var import_interface = require("@wordpress/interface");
var import_config = require("./config.cjs");
var import_shortcut = __toESM(require("./shortcut.cjs"));
var import_dynamic_shortcut = __toESM(require("./dynamic-shortcut.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var KEYBOARD_SHORTCUT_HELP_MODAL_NAME = "editor/keyboard-shortcut-help";
var ShortcutList = ({ shortcuts }) => (
  /*
   * Disable reason: The `list` ARIA role is redundant but
   * Safari+VoiceOver won't announce the list otherwise.
   */
  /* eslint-disable jsx-a11y/no-redundant-roles */
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "ul",
    {
      className: "editor-keyboard-shortcut-help-modal__shortcut-list",
      role: "list",
      children: shortcuts.map((shortcut, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "li",
        {
          className: "editor-keyboard-shortcut-help-modal__shortcut",
          children: typeof shortcut === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dynamic_shortcut.default, { name: shortcut }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_shortcut.default, { ...shortcut })
        },
        index
      ))
    }
  )
);
var ShortcutSection = ({ title, shortcuts, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
  "section",
  {
    className: (0, import_clsx.default)(
      "editor-keyboard-shortcut-help-modal__section",
      className
    ),
    children: [
      !!title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "editor-keyboard-shortcut-help-modal__section-title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortcutList, { shortcuts })
    ]
  }
);
var ShortcutCategorySection = ({
  title,
  categoryName,
  additionalShortcuts = []
}) => {
  const categoryShortcuts = (0, import_data.useSelect)(
    (select) => {
      return select(import_keyboard_shortcuts.store).getCategoryShortcuts(
        categoryName
      );
    },
    [categoryName]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    ShortcutSection,
    {
      title,
      shortcuts: categoryShortcuts.concat(additionalShortcuts)
    }
  );
};
function KeyboardShortcutHelpModal() {
  const isModalActive = (0, import_data.useSelect)(
    (select) => select(import_interface.store).isModalActive(
      KEYBOARD_SHORTCUT_HELP_MODAL_NAME
    ),
    []
  );
  const { openModal, closeModal } = (0, import_data.useDispatch)(import_interface.store);
  const toggleModal = () => {
    if (isModalActive) {
      closeModal();
    } else {
      openModal(KEYBOARD_SHORTCUT_HELP_MODAL_NAME);
    }
  };
  (0, import_keyboard_shortcuts.useShortcut)("core/editor/keyboard-shortcuts", toggleModal);
  if (!isModalActive) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Modal,
    {
      className: "editor-keyboard-shortcut-help-modal",
      title: (0, import_i18n.__)("Keyboard shortcuts"),
      closeButtonLabel: (0, import_i18n.__)("Close"),
      onRequestClose: toggleModal,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ShortcutSection,
          {
            className: "editor-keyboard-shortcut-help-modal__main-shortcuts",
            shortcuts: ["core/editor/keyboard-shortcuts"]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ShortcutCategorySection,
          {
            title: (0, import_i18n.__)("Global shortcuts"),
            categoryName: "global"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ShortcutCategorySection,
          {
            title: (0, import_i18n.__)("Selection shortcuts"),
            categoryName: "selection"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ShortcutCategorySection,
          {
            title: (0, import_i18n.__)("Block shortcuts"),
            categoryName: "block",
            additionalShortcuts: [
              {
                keyCombination: { character: "/" },
                description: (0, import_i18n.__)(
                  "Change the block type after adding a new paragraph."
                ),
                /* translators: The forward-slash character. e.g. '/'. */
                ariaLabel: (0, import_i18n.__)("Forward-slash")
              }
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ShortcutSection,
          {
            title: (0, import_i18n.__)("Text formatting"),
            shortcuts: import_config.textFormattingShortcuts
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ShortcutCategorySection,
          {
            title: (0, import_i18n.__)("List View shortcuts"),
            categoryName: "list-view"
          }
        )
      ]
    }
  );
}
var keyboard_shortcut_help_modal_default = KeyboardShortcutHelpModal;
//# sourceMappingURL=index.cjs.map
