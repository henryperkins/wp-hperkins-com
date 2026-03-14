// packages/block-library/src/navigation/edit/placeholder/placeholder-preview.js
import { Icon, navigation } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { jsx, jsxs } from "react/jsx-runtime";
var PlaceholderPreview = ({ isVisible = true }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": !isVisible ? true : void 0,
      className: "wp-block-navigation-placeholder__preview",
      children: /* @__PURE__ */ jsxs("div", { className: "wp-block-navigation-placeholder__actions__indicator", children: [
        /* @__PURE__ */ jsx(Icon, { icon: navigation }),
        __("Navigation")
      ] })
    }
  );
};
var placeholder_preview_default = PlaceholderPreview;
export {
  placeholder_preview_default as default
};
//# sourceMappingURL=placeholder-preview.mjs.map
