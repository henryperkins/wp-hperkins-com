"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/variations/variation.tsx
var variation_exports = {};
__export(variation_exports, {
  default: () => Variation
});
module.exports = __toCommonJS(variation_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_keycodes = require("@wordpress/keycodes");
var import_i18n = require("@wordpress/i18n");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_context = require("../context.cjs");
var import_utils = require("../utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function Variation({
  variation,
  children,
  isPill = false,
  properties,
  showTooltip = false
}) {
  const [isFocused, setIsFocused] = (0, import_element.useState)(false);
  const {
    base,
    user,
    onChange: setUserConfig
  } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  const context = (0, import_element.useMemo)(() => {
    let merged = (0, import_global_styles_engine.mergeGlobalStyles)(base, variation);
    if (properties) {
      merged = (0, import_utils.filterObjectByProperties)(merged, properties);
    }
    return {
      user: variation,
      base,
      merged,
      onChange: () => {
      }
    };
  }, [variation, base, properties]);
  const selectVariation = () => setUserConfig(variation);
  const selectOnEnter = (event) => {
    if (event.keyCode === import_keycodes.ENTER) {
      event.preventDefault();
      selectVariation();
    }
  };
  const isActive = (0, import_element.useMemo)(
    () => (0, import_global_styles_engine.areGlobalStylesEqual)(user, variation),
    [user, variation]
  );
  let label = variation?.title;
  if (variation?.description) {
    label = (0, import_i18n.sprintf)(
      /* translators: 1: variation title. 2: variation description. */
      (0, import_i18n._x)("%1$s (%2$s)", "variation label"),
      variation?.title,
      variation?.description
    );
  }
  const content = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: (0, import_clsx.default)("global-styles-ui-variations_item", {
        "is-active": isActive
      }),
      role: "button",
      onClick: selectVariation,
      onKeyDown: selectOnEnter,
      tabIndex: 0,
      "aria-label": label,
      "aria-current": isActive,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: (0, import_clsx.default)("global-styles-ui-variations_item-preview", {
            "is-pill": isPill
          }),
          children: children(isFocused)
        }
      )
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_context.GlobalStylesContext.Provider, { value: context, children: showTooltip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: variation?.title, children: content }) : content });
}
//# sourceMappingURL=variation.cjs.map
