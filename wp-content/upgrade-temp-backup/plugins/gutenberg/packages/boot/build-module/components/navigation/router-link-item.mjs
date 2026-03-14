// packages/boot/src/components/navigation/router-link-item.tsx
import { forwardRef } from "@wordpress/element";
import { __experimentalItem as Item } from "@wordpress/components";
import { privateApis as routePrivateApis } from "@wordpress/route";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { createLink } = unlock(routePrivateApis);
function AnchorOnlyItem(props, forwardedRef) {
  return /* @__PURE__ */ jsx(Item, { as: "a", ref: forwardedRef, ...props });
}
var RouterLinkItem = createLink(forwardRef(AnchorOnlyItem));
var router_link_item_default = RouterLinkItem;
export {
  router_link_item_default as default
};
//# sourceMappingURL=router-link-item.mjs.map
