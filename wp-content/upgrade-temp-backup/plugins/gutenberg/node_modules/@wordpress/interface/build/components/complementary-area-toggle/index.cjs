var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/interface/src/components/complementary-area-toggle/index.js
var complementary_area_toggle_exports = {};
__export(complementary_area_toggle_exports, {
  default: () => ComplementaryAreaToggle
});
module.exports = __toCommonJS(complementary_area_toggle_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_plugins = require("@wordpress/plugins");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  as = import_components.Button,
  scope,
  identifier: identifierProp,
  icon: iconProp,
  selectedIcon,
  name,
  shortcut,
  ...props
}) {
  const ComponentToUse = as;
  const context = (0, import_plugins.usePluginContext)();
  const icon = iconProp || context.icon;
  const identifier = identifierProp || `${context.name}/${name}`;
  const isSelected = (0, import_data.useSelect)(
    (select) => select(import_store.store).getActiveComplementaryArea(scope) === identifier,
    [identifier, scope]
  );
  const { enableComplementaryArea, disableComplementaryArea } = (0, import_data.useDispatch)(import_store.store);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=index.cjs.map
