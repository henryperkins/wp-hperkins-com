// packages/global-styles-ui/src/dimensions-panel.tsx
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { useMemo } from "@wordpress/element";
import { useStyle, useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useSettingsForBlockElement, DimensionsPanel: StylesDimensionsPanel } = unlock(blockEditorPrivateApis);
var DEFAULT_CONTROLS = {
  contentSize: true,
  wideSize: true,
  padding: true,
  margin: true,
  blockGap: true,
  height: true,
  minHeight: true,
  width: true,
  childLayout: false
};
function DimensionsPanel() {
  const [style] = useStyle("", void 0, "user", false);
  const [inheritedStyle, setStyle] = useStyle(
    "",
    void 0,
    "merged",
    false
  );
  const [userSettings] = useSetting("", void 0, "user");
  const [rawSettings, setSettings] = useSetting("");
  const settings = useSettingsForBlockElement(rawSettings);
  const inheritedStyleWithLayout = useMemo(() => {
    return {
      ...inheritedStyle,
      layout: settings.layout
    };
  }, [inheritedStyle, settings.layout]);
  const styleWithLayout = useMemo(() => {
    return {
      ...style,
      layout: userSettings.layout
    };
  }, [style, userSettings.layout]);
  const onChange = (newStyle) => {
    const updatedStyle = { ...newStyle };
    delete updatedStyle.layout;
    setStyle(updatedStyle);
    if (newStyle.layout !== userSettings.layout) {
      const updatedSettings = {
        ...userSettings,
        layout: newStyle.layout
      };
      if (updatedSettings.layout?.definitions) {
        delete updatedSettings.layout.definitions;
      }
      setSettings(updatedSettings);
    }
  };
  return /* @__PURE__ */ jsx(
    StylesDimensionsPanel,
    {
      inheritedValue: inheritedStyleWithLayout,
      value: styleWithLayout,
      onChange,
      settings,
      includeLayoutControls: true,
      defaultControls: DEFAULT_CONTROLS
    }
  );
}
export {
  DimensionsPanel as default
};
//# sourceMappingURL=dimensions-panel.mjs.map
