// packages/format-library/src/link/css-classes-setting.js
import { useState } from "@wordpress/element";
import { useInstanceId } from "@wordpress/compose";
import { __ } from "@wordpress/i18n";
import {
  __experimentalInputControl as InputControl,
  CheckboxControl,
  VisuallyHidden,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
var CSSClassesSettingComponent = ({ setting, value, onChange }) => {
  const hasValue = value ? value?.cssClasses?.length > 0 : false;
  const [isSettingActive, setIsSettingActive] = useState(hasValue);
  const instanceId = useInstanceId(CSSClassesSettingComponent);
  const controlledRegionId = `css-classes-setting-${instanceId}`;
  const handleSettingChange = (newValue) => {
    const sanitizedValue = typeof newValue === "string" ? newValue.replace(/,/g, " ").replace(/\s+/g, " ").trim() : newValue;
    onChange({
      ...value,
      [setting.id]: sanitizedValue
    });
  };
  const handleCheckboxChange = () => {
    if (isSettingActive) {
      if (hasValue) {
        handleSettingChange("");
      }
      setIsSettingActive(false);
    } else {
      setIsSettingActive(true);
    }
  };
  return /* @__PURE__ */ jsxs("fieldset", { children: [
    /* @__PURE__ */ jsx(VisuallyHidden, { as: "legend", children: setting.title }),
    /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
      /* @__PURE__ */ jsx(
        CheckboxControl,
        {
          label: setting.title,
          onChange: handleCheckboxChange,
          checked: isSettingActive || hasValue,
          "aria-expanded": isSettingActive,
          "aria-controls": isSettingActive ? controlledRegionId : void 0
        }
      ),
      isSettingActive && /* @__PURE__ */ jsx("div", { id: controlledRegionId, children: /* @__PURE__ */ jsx(
        InputControl,
        {
          label: __("CSS classes"),
          value: value?.cssClasses,
          onChange: handleSettingChange,
          help: __(
            "Separate multiple classes with spaces."
          ),
          __unstableInputWidth: "100%",
          __next40pxDefaultSize: true
        }
      ) })
    ] })
  ] });
};
var css_classes_setting_default = CSSClassesSettingComponent;
export {
  css_classes_setting_default as default
};
//# sourceMappingURL=css-classes-setting.mjs.map
