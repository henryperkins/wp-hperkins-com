// packages/ui/src/collapsible-card/content.tsx
import { Collapsible } from "@base-ui/react/collapsible";
import { forwardRef } from "@wordpress/element";
import * as Card from "../card/index.mjs";
import { jsx } from "react/jsx-runtime";
var Content2 = forwardRef(
  function CollapsibleCardContent({ render, ...restProps }, ref) {
    return /* @__PURE__ */ jsx(
      Collapsible.Panel,
      {
        ref,
        render: /* @__PURE__ */ jsx(Card.Content, { render }),
        ...restProps
      }
    );
  }
);
export {
  Content2 as Content
};
//# sourceMappingURL=content.mjs.map
