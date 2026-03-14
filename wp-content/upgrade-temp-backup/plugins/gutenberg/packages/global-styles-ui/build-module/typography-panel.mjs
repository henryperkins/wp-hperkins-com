// packages/global-styles-ui/src/typography-panel.tsx
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { useStyle, useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useSettingsForBlockElement, TypographyPanel: StylesTypographyPanel } = unlock(blockEditorPrivateApis);
function TypographyPanel({
  element,
  headingLevel
}) {
  let prefixParts = [];
  if (element === "heading") {
    prefixParts = prefixParts.concat(["elements", headingLevel]);
  } else if (element && element !== "text") {
    prefixParts = prefixParts.concat(["elements", element]);
  }
  const prefix = prefixParts.join(".");
  const [style] = useStyle(prefix, "", "user", false);
  const [inheritedStyle, setStyle] = useStyle(
    prefix,
    "",
    "merged",
    false
  );
  const [rawSettings] = useSetting("");
  const usedElement = element === "heading" ? headingLevel : element;
  const settings = useSettingsForBlockElement(
    rawSettings,
    void 0,
    usedElement
  );
  return /* @__PURE__ */ jsx(
    StylesTypographyPanel,
    {
      inheritedValue: inheritedStyle,
      value: style,
      onChange: setStyle,
      settings
    }
  );
}
export {
  TypographyPanel as default
};
//# sourceMappingURL=typography-panel.mjs.map
