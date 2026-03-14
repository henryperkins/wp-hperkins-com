// packages/interface/src/components/action-item/index.js
import { MenuGroup, Button, Slot, Fill } from "@wordpress/components";
import { Children } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
var noop = () => {
};
function ActionItemSlot({
  name,
  as: Component = MenuGroup,
  fillProps = {},
  bubblesVirtually,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Slot,
    {
      name,
      bubblesVirtually,
      fillProps,
      children: (fills) => {
        if (!Children.toArray(fills).length) {
          return null;
        }
        const initializedByPlugins = [];
        Children.forEach(
          fills,
          ({
            props: { __unstableExplicitMenuItem, __unstableTarget }
          }) => {
            if (__unstableTarget && __unstableExplicitMenuItem) {
              initializedByPlugins.push(__unstableTarget);
            }
          }
        );
        const children = Children.map(fills, (child) => {
          if (!child.props.__unstableExplicitMenuItem && initializedByPlugins.includes(
            child.props.__unstableTarget
          )) {
            return null;
          }
          return child;
        });
        return /* @__PURE__ */ jsx(Component, { ...props, children });
      }
    }
  );
}
function ActionItem({ name, as: Component = Button, onClick, ...props }) {
  return /* @__PURE__ */ jsx(Fill, { name, children: ({ onClick: fpOnClick }) => {
    return /* @__PURE__ */ jsx(
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
export {
  action_item_default as default
};
//# sourceMappingURL=index.mjs.map
