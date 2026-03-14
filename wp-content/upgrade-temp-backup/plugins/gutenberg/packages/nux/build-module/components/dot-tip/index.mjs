// packages/nux/src/components/dot-tip/index.js
import { compose } from "@wordpress/compose";
import { Popover, Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { withSelect, withDispatch } from "@wordpress/data";
import { useCallback, useRef } from "@wordpress/element";
import { close } from "@wordpress/icons";
import { store as nuxStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function onClick(event) {
  event.stopPropagation();
}
function DotTip({
  position = "middle right",
  children,
  isVisible,
  hasNextTip,
  onDismiss,
  onDisable
}) {
  const anchorParent = useRef(null);
  const onFocusOutsideCallback = useCallback(
    (event) => {
      if (!anchorParent.current) {
        return;
      }
      if (anchorParent.current.contains(event.relatedTarget)) {
        return;
      }
      onDisable();
    },
    [onDisable, anchorParent]
  );
  if (!isVisible) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    Popover,
    {
      className: "nux-dot-tip",
      position,
      focusOnMount: true,
      role: "dialog",
      "aria-label": __("Editor tips"),
      onClick,
      onFocusOutside: onFocusOutsideCallback,
      children: [
        /* @__PURE__ */ jsx("p", { children }),
        /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            onClick: onDismiss,
            children: hasNextTip ? __("See next tip") : __("Got it")
          }
        ) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "small",
            className: "nux-dot-tip__disable",
            icon: close,
            label: __("Disable tips"),
            onClick: onDisable
          }
        )
      ]
    }
  );
}
var dot_tip_default = compose(
  withSelect((select, { tipId }) => {
    const { isTipVisible, getAssociatedGuide } = select(nuxStore);
    const associatedGuide = getAssociatedGuide(tipId);
    return {
      isVisible: isTipVisible(tipId),
      hasNextTip: !!(associatedGuide && associatedGuide.nextTipId)
    };
  }),
  withDispatch((dispatch, { tipId }) => {
    const { dismissTip, disableTips } = dispatch(nuxStore);
    return {
      onDismiss() {
        dismissTip(tipId);
      },
      onDisable() {
        disableTips();
      }
    };
  })
)(DotTip);
export {
  DotTip,
  dot_tip_default as default
};
//# sourceMappingURL=index.mjs.map
