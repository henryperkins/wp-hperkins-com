// packages/block-editor/src/components/link-control/search-create-button.js
import { __, sprintf } from "@wordpress/i18n";
import { MenuItem } from "@wordpress/components";
import { createInterpolateElement } from "@wordpress/element";
import { plus } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
var LinkControlSearchCreate = ({
  searchTerm,
  onClick,
  itemProps,
  buttonText
}) => {
  if (!searchTerm) {
    return null;
  }
  let text;
  if (buttonText) {
    text = typeof buttonText === "function" ? buttonText(searchTerm) : buttonText;
  } else {
    text = createInterpolateElement(
      sprintf(
        /* translators: %s: search term. */
        __("Create: <mark>%s</mark>"),
        searchTerm
      ),
      { mark: /* @__PURE__ */ jsx("mark", {}) }
    );
  }
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      ...itemProps,
      iconPosition: "left",
      icon: plus,
      className: "block-editor-link-control__search-item",
      onClick,
      children: text
    }
  );
};
var search_create_button_default = LinkControlSearchCreate;
export {
  LinkControlSearchCreate,
  search_create_button_default as default
};
//# sourceMappingURL=search-create-button.mjs.map
