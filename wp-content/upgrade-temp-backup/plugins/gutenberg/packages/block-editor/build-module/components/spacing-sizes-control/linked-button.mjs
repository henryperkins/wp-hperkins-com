// packages/block-editor/src/components/spacing-sizes-control/linked-button.js
import { Button } from "@wordpress/components";
import { link, linkOff } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function LinkedButton({ isLinked, ...props }) {
  const label = isLinked ? __("Unlink sides") : __("Link sides");
  return /* @__PURE__ */ jsx(
    Button,
    {
      ...props,
      size: "small",
      icon: isLinked ? link : linkOff,
      iconSize: 24,
      label
    }
  );
}
export {
  LinkedButton as default
};
//# sourceMappingURL=linked-button.mjs.map
