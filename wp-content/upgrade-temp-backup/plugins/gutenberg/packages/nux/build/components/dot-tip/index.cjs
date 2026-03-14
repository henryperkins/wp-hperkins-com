var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/nux/src/components/dot-tip/index.js
var dot_tip_exports = {};
__export(dot_tip_exports, {
  DotTip: () => DotTip,
  default: () => dot_tip_default
});
module.exports = __toCommonJS(dot_tip_exports);
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_icons = require("@wordpress/icons");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const anchorParent = (0, import_element.useRef)(null);
  const onFocusOutsideCallback = (0, import_element.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Popover,
    {
      className: "nux-dot-tip",
      position,
      focusOnMount: true,
      role: "dialog",
      "aria-label": (0, import_i18n.__)("Editor tips"),
      onClick,
      onFocusOutside: onFocusOutsideCallback,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "link",
            onClick: onDismiss,
            children: hasNextTip ? (0, import_i18n.__)("See next tip") : (0, import_i18n.__)("Got it")
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            size: "small",
            className: "nux-dot-tip__disable",
            icon: import_icons.close,
            label: (0, import_i18n.__)("Disable tips"),
            onClick: onDisable
          }
        )
      ]
    }
  );
}
var dot_tip_default = (0, import_compose.compose)(
  (0, import_data.withSelect)((select, { tipId }) => {
    const { isTipVisible, getAssociatedGuide } = select(import_store.store);
    const associatedGuide = getAssociatedGuide(tipId);
    return {
      isVisible: isTipVisible(tipId),
      hasNextTip: !!(associatedGuide && associatedGuide.nextTipId)
    };
  }),
  (0, import_data.withDispatch)((dispatch, { tipId }) => {
    const { dismissTip, disableTips } = dispatch(import_store.store);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DotTip
});
//# sourceMappingURL=index.cjs.map
