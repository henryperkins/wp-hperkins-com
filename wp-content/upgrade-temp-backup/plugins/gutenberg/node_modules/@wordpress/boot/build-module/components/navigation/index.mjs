// packages/boot/src/components/navigation/index.tsx
import { useState, useMemo, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../../store/index.mjs";
import NavigationItem from "./navigation-item/index.mjs";
import DrilldownItem from "./drilldown-item/index.mjs";
import DropdownItem from "./dropdown-item/index.mjs";
import NavigationScreen from "./navigation-screen/index.mjs";
import { useSidebarParent } from "./use-sidebar-parent.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
function Navigation() {
  const backButtonRef = useRef(null);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [parentId, setParentId, parentDropdownId, setParentDropdownId] = useSidebarParent();
  const menuItems = useSelect(
    (select) => (
      // @ts-ignore
      select(STORE_NAME).getMenuItems()
    ),
    []
  );
  const parent = useMemo(
    () => menuItems.find((item) => item.id === parentId),
    [menuItems, parentId]
  );
  const navigationKey = parent ? `drilldown-${parent.id}` : "root";
  const handleNavigate = ({
    id,
    direction
  }) => {
    setAnimationDirection(direction);
    setParentId(id);
  };
  const handleDropdownToggle = (dropdownId) => {
    setParentDropdownId(
      parentDropdownId === dropdownId ? void 0 : dropdownId
    );
  };
  const items = useMemo(
    () => menuItems.filter((item) => item.parent === parentId),
    [menuItems, parentId]
  );
  const hasRealIcons = items.some((item) => !!item.icon);
  return /* @__PURE__ */ jsx(
    NavigationScreen,
    {
      isRoot: !parent,
      title: parent ? parent.label : "",
      backMenuItem: parent?.parent,
      backButtonRef,
      animationDirection: animationDirection || void 0,
      navigationKey,
      onNavigate: handleNavigate,
      content: /* @__PURE__ */ jsx(Fragment, { children: items.map((item) => {
        if (item.parent_type === "dropdown") {
          return /* @__PURE__ */ jsx(
            DropdownItem,
            {
              id: item.id,
              className: "boot-navigation-item",
              icon: item.icon,
              shouldShowPlaceholder: hasRealIcons,
              isExpanded: parentDropdownId === item.id,
              onToggle: () => handleDropdownToggle(item.id),
              children: item.label
            },
            item.id
          );
        }
        if (item.parent_type === "drilldown") {
          return /* @__PURE__ */ jsx(
            DrilldownItem,
            {
              id: item.id,
              icon: item.icon,
              shouldShowPlaceholder: hasRealIcons,
              onNavigate: handleNavigate,
              children: item.label
            },
            item.id
          );
        }
        return /* @__PURE__ */ jsx(
          NavigationItem,
          {
            to: item.to,
            icon: item.icon,
            shouldShowPlaceholder: hasRealIcons,
            children: item.label
          },
          item.id
        );
      }) })
    }
  );
}
var navigation_default = Navigation;
export {
  navigation_default as default
};
//# sourceMappingURL=index.mjs.map
