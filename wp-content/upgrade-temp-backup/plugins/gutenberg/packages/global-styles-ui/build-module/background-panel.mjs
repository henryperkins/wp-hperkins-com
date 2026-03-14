// packages/global-styles-ui/src/background-panel.tsx
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { useStyle, useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var BACKGROUND_DEFAULT_VALUES = {
  backgroundSize: "auto"
};
var { BackgroundPanel: StylesBackgroundPanel } = unlock(
  blockEditorPrivateApis
);
function hasBackgroundImageValue(style) {
  return !!style?.background?.backgroundImage?.id || !!style?.background?.backgroundImage?.url || typeof style?.background?.backgroundImage === "string";
}
function BackgroundPanel() {
  const [style] = useStyle("", void 0, "user", false);
  const [inheritedStyle, setStyle] = useStyle(
    "",
    void 0,
    "merged",
    false
  );
  const [settings] = useSetting("");
  return /* @__PURE__ */ jsx(
    StylesBackgroundPanel,
    {
      inheritedValue: inheritedStyle,
      value: style,
      onChange: setStyle,
      settings,
      defaultValues: BACKGROUND_DEFAULT_VALUES
    }
  );
}
export {
  BackgroundPanel as default,
  hasBackgroundImageValue
};
//# sourceMappingURL=background-panel.mjs.map
