// packages/block-editor/src/components/url-popover/link-editor.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { keyboardReturn } from "@wordpress/icons";
import URLInput from "../url-input/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function LinkEditor({
  autocompleteRef,
  className,
  onChangeInputValue,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: clsx(
        "block-editor-url-popover__link-editor",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          URLInput,
          {
            value,
            onChange: onChangeInputValue,
            autocompleteRef
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: keyboardReturn,
            label: __("Apply"),
            type: "submit",
            size: "compact"
          }
        )
      ]
    }
  );
}
export {
  LinkEditor as default
};
//# sourceMappingURL=link-editor.mjs.map
