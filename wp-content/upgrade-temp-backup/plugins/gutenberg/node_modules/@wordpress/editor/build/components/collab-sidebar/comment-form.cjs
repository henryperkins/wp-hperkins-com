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

// packages/editor/src/components/collab-sidebar/comment-form.js
var comment_form_exports = {};
__export(comment_form_exports, {
  default: () => comment_form_default
});
module.exports = __toCommonJS(comment_form_exports);
var import_react_autosize_textarea = __toESM(require("react-autosize-textarea"));
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_compose = require("@wordpress/compose");
var import_keycodes = require("@wordpress/keycodes");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function CommentForm({
  onSubmit,
  onCancel,
  thread,
  submitButtonText,
  labelText,
  reflowComments = import_utils.noop
}) {
  const [inputComment, setInputComment] = (0, import_element.useState)(
    thread?.content?.raw ?? ""
  );
  const debouncedCommentUpdated = (0, import_compose.useDebounce)(reflowComments, 100);
  const updateComment = (value) => {
    setInputComment(value);
  };
  const inputId = (0, import_compose.useInstanceId)(CommentForm, "comment-input");
  const isDisabled = inputComment === thread?.content?.raw || !(0, import_utils.sanitizeCommentString)(inputComment).length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      className: "editor-collab-sidebar-panel__comment-form",
      spacing: "4",
      as: "form",
      onSubmit: (event) => {
        event.preventDefault();
        onSubmit(inputComment);
        setInputComment("");
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { as: "label", htmlFor: inputId, children: labelText ?? (0, import_i18n.__)("Note") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_react_autosize_textarea.default,
          {
            id: inputId,
            value: inputComment ?? "",
            onChange: (comment) => {
              updateComment(comment.target.value);
              debouncedCommentUpdated();
            },
            rows: 1,
            maxRows: 20,
            onKeyDown: (event) => {
              if (import_keycodes.isKeyboardEvent.primary(event, "Enter") && !isDisabled) {
                event.target.parentNode.requestSubmit();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onCancel(event);
              }
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: "2", justify: "flex-end", wrap: true, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Button, { size: "compact", variant: "tertiary", onClick: onCancel, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { children: (0, import_i18n.__)("Cancel") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              size: "compact",
              accessibleWhenDisabled: true,
              variant: "primary",
              type: "submit",
              disabled: isDisabled,
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalTruncate, { children: submitButtonText })
            }
          )
        ] })
      ]
    }
  );
}
var comment_form_default = CommentForm;
//# sourceMappingURL=comment-form.cjs.map
