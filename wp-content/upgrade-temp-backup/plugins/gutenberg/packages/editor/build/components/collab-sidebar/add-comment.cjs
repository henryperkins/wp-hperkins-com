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

// packages/editor/src/components/collab-sidebar/add-comment.js
var add_comment_exports = {};
__export(add_comment_exports, {
  AddComment: () => AddComment
});
module.exports = __toCommonJS(add_comment_exports);
var import_clsx = __toESM(require("clsx"));
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_comment_author_info = __toESM(require("./comment-author-info.cjs"));
var import_comment_form = __toESM(require("./comment-form.cjs"));
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useBlockElement } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function AddComment({
  onSubmit,
  commentSidebarRef,
  reflowComments = import_utils.noop,
  isFloating = false,
  y,
  refs
}) {
  const { clientId } = (0, import_data.useSelect)((select) => {
    const { getSelectedBlockClientId } = select(import_block_editor.store);
    return {
      clientId: getSelectedBlockClientId()
    };
  }, []);
  const selectedNote = (0, import_data.useSelect)(
    (select) => (0, import_lock_unlock.unlock)(select(import_store.store)).getSelectedNote(),
    []
  );
  const blockElement = useBlockElement(clientId);
  const { toggleBlockSpotlight } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_block_editor.store));
  const { selectNote } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const unselectThread = () => {
    selectNote(void 0);
    blockElement?.focus();
    toggleBlockSpotlight(clientId, false);
  };
  if (selectedNote !== "new" || !clientId) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      className: (0, import_clsx.default)(
        "editor-collab-sidebar-panel__thread is-selected",
        {
          "is-floating": isFloating
        }
      ),
      spacing: "3",
      tabIndex: 0,
      "aria-label": (0, import_i18n.__)("New note"),
      role: "treeitem",
      ref: isFloating ? refs.setFloating : void 0,
      style: isFloating ? (
        // Delay showing the floating note box until a Y position is known to prevent blink.
        { top: y, opacity: !y ? 0 : void 0 }
      ) : void 0,
      onBlur: (event) => {
        if (!document.hasFocus()) {
          return;
        }
        if (event.currentTarget.contains(event.relatedTarget)) {
          return;
        }
        toggleBlockSpotlight(clientId, false);
        selectNote(void 0);
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { alignment: "left", spacing: "3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_comment_author_info.default, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_comment_form.default,
          {
            onSubmit: async (inputComment) => {
              const { id } = await onSubmit({ content: inputComment });
              selectNote(id);
              (0, import_utils.focusCommentThread)(id, commentSidebarRef.current);
            },
            onCancel: unselectThread,
            reflowComments,
            submitButtonText: (0, import_i18n.__)("Add note"),
            labelText: (0, import_i18n.__)("New note")
          }
        )
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AddComment
});
//# sourceMappingURL=add-comment.cjs.map
