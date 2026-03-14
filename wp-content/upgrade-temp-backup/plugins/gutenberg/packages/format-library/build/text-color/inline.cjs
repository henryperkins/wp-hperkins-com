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

// packages/format-library/src/text-color/inline.js
var inline_exports = {};
__export(inline_exports, {
  default: () => InlineColorUI,
  getActiveColors: () => getActiveColors,
  parseClassName: () => parseClassName
});
module.exports = __toCommonJS(inline_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_index = require("./index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Tabs } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var TABS = [
  { name: "color", title: (0, import_i18n.__)("Text") },
  { name: "backgroundColor", title: (0, import_i18n.__)("Background") }
];
function parseCSS(css = "") {
  return css.split(";").reduce((accumulator, rule) => {
    if (rule) {
      const [property, value] = rule.split(":");
      if (property === "color") {
        accumulator.color = value;
      }
      if (property === "background-color" && value !== import_index.transparentValue) {
        accumulator.backgroundColor = value;
      }
    }
    return accumulator;
  }, {});
}
function parseClassName(className = "", colorSettings) {
  return className.split(" ").reduce((accumulator, name) => {
    if (name.startsWith("has-") && name.endsWith("-color")) {
      const colorSlug = name.replace(/^has-/, "").replace(/-color$/, "");
      const colorObject = (0, import_block_editor.getColorObjectByAttributeValues)(
        colorSettings,
        colorSlug
      );
      accumulator.color = colorObject.color;
    }
    return accumulator;
  }, {});
}
function getActiveColors(value, name, colorSettings) {
  const activeColorFormat = (0, import_rich_text.getActiveFormat)(value, name);
  if (!activeColorFormat) {
    return {};
  }
  return {
    ...parseCSS(activeColorFormat.attributes.style),
    ...parseClassName(activeColorFormat.attributes.class, colorSettings)
  };
}
function setColors(value, name, colorSettings, colors) {
  const { color, backgroundColor } = {
    ...getActiveColors(value, name, colorSettings),
    ...colors
  };
  if (!color && !backgroundColor) {
    return (0, import_rich_text.removeFormat)(value, name);
  }
  const styles = [];
  const classNames = [];
  const attributes = {};
  if (backgroundColor) {
    styles.push(["background-color", backgroundColor].join(":"));
  } else {
    styles.push(["background-color", import_index.transparentValue].join(":"));
  }
  if (color) {
    const colorObject = (0, import_block_editor.getColorObjectByColorValue)(colorSettings, color);
    if (colorObject) {
      classNames.push((0, import_block_editor.getColorClassName)("color", colorObject.slug));
    } else {
      styles.push(["color", color].join(":"));
    }
  }
  if (styles.length) {
    attributes.style = styles.join(";");
  }
  if (classNames.length) {
    attributes.class = classNames.join(" ");
  }
  return (0, import_rich_text.applyFormat)(value, { type: name, attributes });
}
function ColorPicker({ name, property, value, onChange }) {
  const colors = (0, import_data.useSelect)((select) => {
    const { getSettings } = select(import_block_editor.store);
    return getSettings().colors ?? [];
  }, []);
  const activeColors = (0, import_element.useMemo)(
    () => getActiveColors(value, name, colors),
    [name, value, colors]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_block_editor.ColorPalette,
    {
      value: activeColors[property],
      onChange: (color) => {
        onChange(
          setColors(value, name, colors, { [property]: color })
        );
      },
      enableAlpha: true,
      __experimentalIsRenderedInSidebar: true
    }
  );
}
function InlineColorUI({
  name,
  value,
  onChange,
  onClose,
  contentRef,
  isActive
}) {
  const popoverAnchor = (0, import_rich_text.useAnchor)({
    editableContentElement: contentRef.current,
    settings: { ...import_index.textColor, isActive }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      onClose,
      className: "format-library__inline-color-popover",
      anchor: popoverAnchor,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.TabList, { children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs.Tab, { tabId: tab.name, children: tab.title }, tab.name)) }),
        TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Tabs.TabPanel,
          {
            tabId: tab.name,
            focusable: false,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ColorPicker,
              {
                name,
                property: tab.name,
                value,
                onChange
              }
            )
          },
          tab.name
        ))
      ] })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getActiveColors,
  parseClassName
});
//# sourceMappingURL=inline.cjs.map
