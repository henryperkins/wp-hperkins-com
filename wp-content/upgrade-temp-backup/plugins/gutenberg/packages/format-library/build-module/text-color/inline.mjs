// packages/format-library/src/text-color/inline.js
import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import {
  applyFormat,
  removeFormat,
  getActiveFormat,
  useAnchor
} from "@wordpress/rich-text";
import {
  ColorPalette,
  getColorClassName,
  getColorObjectByColorValue,
  getColorObjectByAttributeValues,
  store as blockEditorStore
} from "@wordpress/block-editor";
import {
  Popover,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { textColor as settings, transparentValue } from "./index.mjs";
import { unlock } from "../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
var TABS = [
  { name: "color", title: __("Text") },
  { name: "backgroundColor", title: __("Background") }
];
function parseCSS(css = "") {
  return css.split(";").reduce((accumulator, rule) => {
    if (rule) {
      const [property, value] = rule.split(":");
      if (property === "color") {
        accumulator.color = value;
      }
      if (property === "background-color" && value !== transparentValue) {
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
      const colorObject = getColorObjectByAttributeValues(
        colorSettings,
        colorSlug
      );
      accumulator.color = colorObject.color;
    }
    return accumulator;
  }, {});
}
function getActiveColors(value, name, colorSettings) {
  const activeColorFormat = getActiveFormat(value, name);
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
    return removeFormat(value, name);
  }
  const styles = [];
  const classNames = [];
  const attributes = {};
  if (backgroundColor) {
    styles.push(["background-color", backgroundColor].join(":"));
  } else {
    styles.push(["background-color", transparentValue].join(":"));
  }
  if (color) {
    const colorObject = getColorObjectByColorValue(colorSettings, color);
    if (colorObject) {
      classNames.push(getColorClassName("color", colorObject.slug));
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
  return applyFormat(value, { type: name, attributes });
}
function ColorPicker({ name, property, value, onChange }) {
  const colors = useSelect((select) => {
    const { getSettings } = select(blockEditorStore);
    return getSettings().colors ?? [];
  }, []);
  const activeColors = useMemo(
    () => getActiveColors(value, name, colors),
    [name, value, colors]
  );
  return /* @__PURE__ */ jsx(
    ColorPalette,
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
  const popoverAnchor = useAnchor({
    editableContentElement: contentRef.current,
    settings: { ...settings, isActive }
  });
  return /* @__PURE__ */ jsx(
    Popover,
    {
      onClose,
      className: "format-library__inline-color-popover",
      anchor: popoverAnchor,
      children: /* @__PURE__ */ jsxs(Tabs, { children: [
        /* @__PURE__ */ jsx(Tabs.TabList, { children: TABS.map((tab) => /* @__PURE__ */ jsx(Tabs.Tab, { tabId: tab.name, children: tab.title }, tab.name)) }),
        TABS.map((tab) => /* @__PURE__ */ jsx(
          Tabs.TabPanel,
          {
            tabId: tab.name,
            focusable: false,
            children: /* @__PURE__ */ jsx(
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
export {
  InlineColorUI as default,
  getActiveColors,
  parseClassName
};
//# sourceMappingURL=inline.mjs.map
