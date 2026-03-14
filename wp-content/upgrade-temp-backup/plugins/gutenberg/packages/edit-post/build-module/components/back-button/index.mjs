// packages/edit-post/src/components/back-button/index.js
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { __unstableMotion as motion } from "@wordpress/components";
import FullscreenModeClose from "./fullscreen-mode-close.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { BackButton: BackButtonFill } = unlock(editorPrivateApis);
var slideX = {
  hidden: { x: "-100%" },
  distractionFreeInactive: { x: 0 },
  hover: { x: 0, transition: { type: "tween", delay: 0.2 } }
};
function BackButton({ initialPost }) {
  return /* @__PURE__ */ jsx(BackButtonFill, { children: ({ length }) => length <= 1 && /* @__PURE__ */ jsx(
    motion.div,
    {
      variants: slideX,
      transition: { type: "tween", delay: 0.8 },
      children: /* @__PURE__ */ jsx(
        FullscreenModeClose,
        {
          showTooltip: true,
          initialPost
        }
      )
    }
  ) });
}
var back_button_default = BackButton;
export {
  back_button_default as default
};
//# sourceMappingURL=index.mjs.map
