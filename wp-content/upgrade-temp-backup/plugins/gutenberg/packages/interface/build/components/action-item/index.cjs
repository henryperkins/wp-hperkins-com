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

// packages/interface/src/components/action-item/index.js
var action_item_exports = {};
__export(action_item_exports, {
  default: () => action_item_default
});
module.exports = __toCommonJS(action_item_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
function ActionItemSlot({
  name,
  as: Component = import_components.MenuGroup,
  fillProps = {},
  bubblesVirtually,
  ...props
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Slot,
    {
      name,
      bubblesVirtually,
      fillProps,
      children: (fills) => {
        if (!import_element.Children.toArray(fills).length) {
          return null;
        }
        const initializedByPlugins = [];
        import_element.Children.forEach(
          fills,
          ({
            props: { __unstableExplicitMenuItem, __unstableTarget }
          }) => {
            if (__unstableTarget && __unstableExplicitMenuItem) {
              initializedByPlugins.push(__unstableTarget);
            }
          }
        );
        const children = import_element.Children.map(fills, (child) => {
          if (!child.props.__unstableExplicitMenuItem && initializedByPlugins.includes(
            child.props.__unstableTarget
          )) {
            return null;
          }
          return child;
        });
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, { ...props, children });
      }
    }
  );
}
function ActionItem({ name, as: Component = import_components.Button, onClick, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Fill, { name, children: ({ onClick: fpOnClick }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Component,
      {
        onClick: onClick || fpOnClick ? (...args) => {
          (onClick || noop)(...args);
          (fpOnClick || noop)(...args);
        } : void 0,
        ...props
      }
    );
  } });
}
ActionItem.Slot = ActionItemSlot;
var action_item_default = ActionItem;
//# sourceMappingURL=index.cjs.map
