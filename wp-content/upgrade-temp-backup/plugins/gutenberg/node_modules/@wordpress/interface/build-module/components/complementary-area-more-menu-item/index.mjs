// packages/interface/src/components/complementary-area-more-menu-item/index.js
import { check } from "@wordpress/icons";
import { MenuItem } from "@wordpress/components";
import ComplementaryAreaToggle from "../complementary-area-toggle/index.mjs";
import ActionItem from "../action-item/index.mjs";
import { jsx } from "react/jsx-runtime";
var PluginsMenuItem = ({
  // Menu item is marked with unstable prop for backward compatibility.
  // They are removed so they don't leak to DOM elements.
  // @see https://github.com/WordPress/gutenberg/issues/14457
  __unstableExplicitMenuItem,
  __unstableTarget,
  ...restProps
}) => /* @__PURE__ */ jsx(MenuItem, { ...restProps });
function ComplementaryAreaMoreMenuItem({
  scope,
  target,
  __unstableExplicitMenuItem,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ComplementaryAreaToggle,
    {
      as: (toggleProps) => {
        return /* @__PURE__ */ jsx(
          ActionItem,
          {
            __unstableExplicitMenuItem,
            __unstableTarget: `${scope}/${target}`,
            as: PluginsMenuItem,
            name: `${scope}/plugin-more-menu`,
            ...toggleProps
          }
        );
      },
      role: "menuitemcheckbox",
      selectedIcon: check,
      name: target,
      scope,
      ...props
    }
  );
}
export {
  ComplementaryAreaMoreMenuItem as default
};
//# sourceMappingURL=index.mjs.map
