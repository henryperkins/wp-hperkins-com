// packages/block-editor/src/components/block-styles/menu-items.js
import { MenuItem, __experimentalText as Text } from "@wordpress/components";
import { check } from "@wordpress/icons";
import { Fragment, jsx } from "react/jsx-runtime";
var noop = () => {
};
function BlockStylesMenuItems({
  stylesToRender,
  activeStyle,
  onSelect = noop,
  onHoverStyle = noop
}) {
  if (!stylesToRender || stylesToRender.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: stylesToRender.map((style) => {
    const menuItemText = style.label || style.name;
    return /* @__PURE__ */ jsx(
      MenuItem,
      {
        icon: activeStyle.name === style.name ? check : null,
        onClick: () => onSelect(style),
        onFocus: () => onHoverStyle(style),
        onBlur: () => onHoverStyle(null),
        onMouseEnter: () => onHoverStyle(style),
        onMouseLeave: () => onHoverStyle(null),
        children: /* @__PURE__ */ jsx(
          Text,
          {
            as: "span",
            limit: 18,
            ellipsizeMode: "tail",
            truncate: true,
            children: menuItemText
          }
        )
      },
      style.name
    );
  }) });
}
export {
  BlockStylesMenuItems as default
};
//# sourceMappingURL=menu-items.mjs.map
