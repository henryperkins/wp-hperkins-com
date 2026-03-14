// packages/editor/src/components/collab-sidebar/comment-form.js
import TextareaAutosize from "react-autosize-textarea";
import { useState } from "@wordpress/element";
import {
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  __experimentalTruncate as Truncate,
  Button,
  VisuallyHidden
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useInstanceId, useDebounce } from "@wordpress/compose";
import { isKeyboardEvent } from "@wordpress/keycodes";
import { sanitizeCommentString, noop } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function CommentForm({
  onSubmit,
  onCancel,
  thread,
  submitButtonText,
  labelText,
  reflowComments = noop
}) {
  const [inputComment, setInputComment] = useState(
    thread?.content?.raw ?? ""
  );
  const debouncedCommentUpdated = useDebounce(reflowComments, 100);
  const updateComment = (value) => {
    setInputComment(value);
  };
  const inputId = useInstanceId(CommentForm, "comment-input");
  const isDisabled = inputComment === thread?.content?.raw || !sanitizeCommentString(inputComment).length;
  return /* @__PURE__ */ jsxs(
    VStack,
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
        /* @__PURE__ */ jsx(VisuallyHidden, { as: "label", htmlFor: inputId, children: labelText ?? __("Note") }),
        /* @__PURE__ */ jsx(
          TextareaAutosize,
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
              if (isKeyboardEvent.primary(event, "Enter") && !isDisabled) {
                event.target.parentNode.requestSubmit();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                onCancel(event);
              }
            }
          }
        ),
        /* @__PURE__ */ jsxs(HStack, { spacing: "2", justify: "flex-end", wrap: true, children: [
          /* @__PURE__ */ jsx(Button, { size: "compact", variant: "tertiary", onClick: onCancel, children: /* @__PURE__ */ jsx(Truncate, { children: __("Cancel") }) }),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "compact",
              accessibleWhenDisabled: true,
              variant: "primary",
              type: "submit",
              disabled: isDisabled,
              children: /* @__PURE__ */ jsx(Truncate, { children: submitButtonText })
            }
          )
        ] })
      ]
    }
  );
}
var comment_form_default = CommentForm;
export {
  comment_form_default as default
};
//# sourceMappingURL=comment-form.mjs.map
