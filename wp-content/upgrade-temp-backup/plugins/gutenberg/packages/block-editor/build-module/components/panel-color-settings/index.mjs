// packages/block-editor/src/components/panel-color-settings/index.js
import PanelColorGradientSettings from "../colors-gradients/panel-color-gradient-settings.mjs";
import { jsx } from "react/jsx-runtime";
var PanelColorSettings = ({ colorSettings, ...props }) => {
  const settings = colorSettings.map((setting) => {
    if (!setting) {
      return setting;
    }
    const { value, onChange, ...otherSettings } = setting;
    return {
      ...otherSettings,
      colorValue: value,
      onColorChange: onChange
    };
  });
  return /* @__PURE__ */ jsx(
    PanelColorGradientSettings,
    {
      settings,
      gradients: [],
      disableCustomGradients: true,
      ...props
    }
  );
};
var panel_color_settings_default = PanelColorSettings;
export {
  panel_color_settings_default as default
};
//# sourceMappingURL=index.mjs.map
