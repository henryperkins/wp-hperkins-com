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

// packages/format-library/src/link/css-classes-setting.js
var css_classes_setting_exports = {};
__export(css_classes_setting_exports, {
  default: () => css_classes_setting_default
});
module.exports = __toCommonJS(css_classes_setting_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var CSSClassesSettingComponent = ({ setting, value, onChange }) => {
  const hasValue = value ? value?.cssClasses?.length > 0 : false;
  const [isSettingActive, setIsSettingActive] = (0, import_element.useState)(hasValue);
  const instanceId = (0, import_compose.useInstanceId)(CSSClassesSettingComponent);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.VisuallyHidden, { as: "legend", children: setting.title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.CheckboxControl,
        {
          label: setting.title,
          onChange: handleCheckboxChange,
          checked: isSettingActive || hasValue,
          "aria-expanded": isSettingActive,
          "aria-controls": isSettingActive ? controlledRegionId : void 0
        }
      ),
      isSettingActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: controlledRegionId, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalInputControl,
        {
          label: (0, import_i18n.__)("CSS classes"),
          value: value?.cssClasses,
          onChange: handleSettingChange,
          help: (0, import_i18n.__)(
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
//# sourceMappingURL=css-classes-setting.cjs.map
