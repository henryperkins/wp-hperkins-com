// packages/interface/src/components/complementary-area-toggle/index.js
import { Button } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { usePluginContext } from "@wordpress/plugins";
import { store as interfaceStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function roleSupportsCheckedState(role) {
  return [
    "checkbox",
    "option",
    "radio",
    "switch",
    "menuitemcheckbox",
    "menuitemradio",
    "treeitem"
  ].includes(role);
}
function ComplementaryAreaToggle({
  as = Button,
  scope,
  identifier: identifierProp,
  icon: iconProp,
  selectedIcon,
  name,
  shortcut,
  ...props
}) {
  const ComponentToUse = as;
  const context = usePluginContext();
  const icon = iconProp || context.icon;
  const identifier = identifierProp || `${context.name}/${name}`;
  const isSelected = useSelect(
    (select) => select(interfaceStore).getActiveComplementaryArea(scope) === identifier,
    [identifier, scope]
  );
  const { enableComplementaryArea, disableComplementaryArea } = useDispatch(interfaceStore);
  return /* @__PURE__ */ jsx(
    ComponentToUse,
    {
      icon: selectedIcon && isSelected ? selectedIcon : icon,
      "aria-controls": identifier.replace("/", ":"),
      "aria-checked": roleSupportsCheckedState(props.role) ? isSelected : void 0,
      onClick: () => {
        if (isSelected) {
          disableComplementaryArea(scope);
        } else {
          enableComplementaryArea(scope, identifier);
        }
      },
      shortcut,
      ...props
    }
  );
}
export {
  ComplementaryAreaToggle as default
};
//# sourceMappingURL=index.mjs.map
