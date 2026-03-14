// packages/ui/src/collapsible-card/root.tsx
import { Collapsible } from "@base-ui/react/collapsible";
import { forwardRef } from "@wordpress/element";
import * as Card from "../card/index.mjs";
import { jsx } from "react/jsx-runtime";
var Root2 = forwardRef(
  function CollapsibleCardRoot({ render, ...restProps }, ref) {
    return /* @__PURE__ */ jsx(
      Collapsible.Root,
      {
        ref,
        render: /* @__PURE__ */ jsx(Card.Root, { render }),
        ...restProps
      }
    );
  }
);
export {
  Root2 as Root
};
//# sourceMappingURL=root.mjs.map
