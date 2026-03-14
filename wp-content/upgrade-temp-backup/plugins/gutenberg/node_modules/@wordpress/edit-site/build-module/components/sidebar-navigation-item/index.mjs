// packages/edit-site/src/components/sidebar-navigation-item/index.js
import clsx from "clsx";
import {
  __experimentalItem as Item,
  __experimentalHStack as HStack,
  FlexBlock
} from "@wordpress/components";
import { isRTL } from "@wordpress/i18n";
import { chevronRightSmall, chevronLeftSmall, Icon } from "@wordpress/icons";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useContext } from "@wordpress/element";
import { unlock } from "../../lock-unlock.mjs";
import { SidebarNavigationContext } from "../sidebar/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useHistory, useLink } = unlock(routerPrivateApis);
function SidebarNavigationItem({
  className,
  icon,
  withChevron = false,
  suffix,
  uid,
  to,
  onClick,
  children,
  ...props
}) {
  const history = useHistory();
  const { navigate } = useContext(SidebarNavigationContext);
  function handleClick(e) {
    if (onClick) {
      onClick(e);
      navigate("forward");
    } else if (to) {
      e.preventDefault();
      history.navigate(to);
      navigate("forward", `[id="${uid}"]`);
    }
  }
  const linkProps = useLink(to);
  return /* @__PURE__ */ jsx(
    Item,
    {
      className: clsx(
        "edit-site-sidebar-navigation-item",
        { "with-suffix": !withChevron && suffix },
        className
      ),
      id: uid,
      onClick: handleClick,
      href: to ? linkProps.href : void 0,
      ...props,
      children: /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", children: [
        icon && /* @__PURE__ */ jsx(
          Icon,
          {
            style: { fill: "currentcolor" },
            icon,
            size: 24
          }
        ),
        /* @__PURE__ */ jsx(FlexBlock, { children }),
        withChevron && /* @__PURE__ */ jsx(
          Icon,
          {
            icon: isRTL() ? chevronLeftSmall : chevronRightSmall,
            className: "edit-site-sidebar-navigation-item__drilldown-indicator",
            size: 24
          }
        ),
        !withChevron && suffix
      ] })
    }
  );
}
export {
  SidebarNavigationItem as default
};
//# sourceMappingURL=index.mjs.map
