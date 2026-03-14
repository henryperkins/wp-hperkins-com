// packages/block-library/src/navigation-link/shared/invalid-draft-display.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/html-entities";
import { jsx } from "react/jsx-runtime";
function InvalidDraftDisplay({
  label,
  isInvalid,
  isDraft,
  className = "wp-block-navigation-link__label"
}) {
  if (!isInvalid && !isDraft) {
    return null;
  }
  const statusText = isInvalid ? (
    /* translators: Indicating that the navigation link is Invalid. */
    __("Invalid")
  ) : (
    /* translators: Indicating that the navigation link is a Draft. */
    __("Draft")
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "wp-block-navigation-link__placeholder-text",
        className,
        {
          "is-invalid": isInvalid,
          "is-draft": isDraft
        }
      ),
      children: /* @__PURE__ */ jsx("span", {
        // Some attributes are stored in an escaped form. It's a legacy issue.
        // Ideally they would be stored in a raw, unescaped form.
        // Unescape is used here to "recover" the escaped characters
        // so they display without encoding.
        // See `updateAttributes` for more details.
        children: `${decodeEntities(label)} (${statusText})`.trim()
      })
    }
  );
}
export {
  InvalidDraftDisplay
};
//# sourceMappingURL=invalid-draft-display.mjs.map
