// packages/global-styles-ui/src/variations/variation.tsx
import clsx from "clsx";
import { Tooltip } from "@wordpress/components";
import { useMemo, useContext, useState } from "@wordpress/element";
import { ENTER } from "@wordpress/keycodes";
import { _x, sprintf } from "@wordpress/i18n";
import {
  areGlobalStylesEqual,
  mergeGlobalStyles
} from "@wordpress/global-styles-engine";
import { GlobalStylesContext } from "../context.mjs";
import { filterObjectByProperties } from "../utils.mjs";
import { jsx } from "react/jsx-runtime";
function Variation({
  variation,
  children,
  isPill = false,
  properties,
  showTooltip = false
}) {
  const [isFocused, setIsFocused] = useState(false);
  const {
    base,
    user,
    onChange: setUserConfig
  } = useContext(GlobalStylesContext);
  const context = useMemo(() => {
    let merged = mergeGlobalStyles(base, variation);
    if (properties) {
      merged = filterObjectByProperties(merged, properties);
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
    if (event.keyCode === ENTER) {
      event.preventDefault();
      selectVariation();
    }
  };
  const isActive = useMemo(
    () => areGlobalStylesEqual(user, variation),
    [user, variation]
  );
  let label = variation?.title;
  if (variation?.description) {
    label = sprintf(
      /* translators: 1: variation title. 2: variation description. */
      _x("%1$s (%2$s)", "variation label"),
      variation?.title,
      variation?.description
    );
  }
  const content = /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("global-styles-ui-variations_item", {
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
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx("global-styles-ui-variations_item-preview", {
            "is-pill": isPill
          }),
          children: children(isFocused)
        }
      )
    }
  );
  return /* @__PURE__ */ jsx(GlobalStylesContext.Provider, { value: context, children: showTooltip ? /* @__PURE__ */ jsx(Tooltip, { text: variation?.title, children: content }) : content });
}
export {
  Variation as default
};
//# sourceMappingURL=variation.mjs.map
