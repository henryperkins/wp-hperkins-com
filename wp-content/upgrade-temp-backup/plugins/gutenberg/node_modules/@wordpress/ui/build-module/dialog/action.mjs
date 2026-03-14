// packages/ui/src/dialog/action.tsx
import { Dialog as _Dialog } from "@base-ui/react/dialog";
import { forwardRef } from "@wordpress/element";
import { Button } from "../button/index.mjs";
import { jsx } from "react/jsx-runtime";
var Action = forwardRef(
  function DialogAction({ render, ...props }, ref) {
    return /* @__PURE__ */ jsx(
      _Dialog.Close,
      {
        ref,
        render: /* @__PURE__ */ jsx(Button, { render }),
        ...props
      }
    );
  }
);
export {
  Action
};
//# sourceMappingURL=action.mjs.map
