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

// packages/interface/src/components/complementary-area-more-menu-item/index.js
var complementary_area_more_menu_item_exports = {};
__export(complementary_area_more_menu_item_exports, {
  default: () => ComplementaryAreaMoreMenuItem
});
module.exports = __toCommonJS(complementary_area_more_menu_item_exports);
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_complementary_area_toggle = __toESM(require("../complementary-area-toggle/index.cjs"));
var import_action_item = __toESM(require("../action-item/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var PluginsMenuItem = ({
  // Menu item is marked with unstable prop for backward compatibility.
  // They are removed so they don't leak to DOM elements.
  // @see https://github.com/WordPress/gutenberg/issues/14457
  __unstableExplicitMenuItem,
  __unstableTarget,
  ...restProps
}) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuItem, { ...restProps });
function ComplementaryAreaMoreMenuItem({
  scope,
  target,
  __unstableExplicitMenuItem,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_complementary_area_toggle.default,
    {
      as: (toggleProps) => {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_action_item.default,
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
      selectedIcon: import_icons.check,
      name: target,
      scope,
      ...props
    }
  );
}
//# sourceMappingURL=index.cjs.map
