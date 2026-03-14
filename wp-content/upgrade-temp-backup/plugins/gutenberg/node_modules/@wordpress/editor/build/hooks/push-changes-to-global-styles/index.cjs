"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// packages/editor/src/hooks/push-changes-to-global-styles/index.js
var import_hooks = require("@wordpress/hooks");
var import_compose = require("@wordpress/compose");
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_notices = require("@wordpress/notices");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_set_nested_value = __toESM(require("../../utils/set-nested-value.cjs"));
var import_hooks2 = require("../../components/global-styles/hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { cleanEmptyObject } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var STYLE_PROPERTY = {
  ...import_blocks.__EXPERIMENTAL_STYLE_PROPERTY,
  blockGap: { value: ["spacing", "blockGap"] }
};
var STYLE_PATH_TO_CSS_VAR_INFIX = {
  "border.color": "color",
  "color.background": "color",
  "color.text": "color",
  "elements.link.color.text": "color",
  "elements.link.:hover.color.text": "color",
  "elements.link.typography.fontFamily": "font-family",
  "elements.link.typography.fontSize": "font-size",
  "elements.button.color.text": "color",
  "elements.button.color.background": "color",
  "elements.button.typography.fontFamily": "font-family",
  "elements.button.typography.fontSize": "font-size",
  "elements.caption.color.text": "color",
  "elements.heading.color": "color",
  "elements.heading.color.background": "color",
  "elements.heading.typography.fontFamily": "font-family",
  "elements.heading.gradient": "gradient",
  "elements.heading.color.gradient": "gradient",
  "elements.h1.color": "color",
  "elements.h1.color.background": "color",
  "elements.h1.typography.fontFamily": "font-family",
  "elements.h1.color.gradient": "gradient",
  "elements.h2.color": "color",
  "elements.h2.color.background": "color",
  "elements.h2.typography.fontFamily": "font-family",
  "elements.h2.color.gradient": "gradient",
  "elements.h3.color": "color",
  "elements.h3.color.background": "color",
  "elements.h3.typography.fontFamily": "font-family",
  "elements.h3.color.gradient": "gradient",
  "elements.h4.color": "color",
  "elements.h4.color.background": "color",
  "elements.h4.typography.fontFamily": "font-family",
  "elements.h4.color.gradient": "gradient",
  "elements.h5.color": "color",
  "elements.h5.color.background": "color",
  "elements.h5.typography.fontFamily": "font-family",
  "elements.h5.color.gradient": "gradient",
  "elements.h6.color": "color",
  "elements.h6.color.background": "color",
  "elements.h6.typography.fontFamily": "font-family",
  "elements.h6.color.gradient": "gradient",
  "color.gradient": "gradient",
  blockGap: "spacing",
  "typography.fontSize": "font-size",
  "typography.fontFamily": "font-family"
};
var STYLE_PATH_TO_PRESET_BLOCK_ATTRIBUTE = {
  "border.color": "borderColor",
  "color.background": "backgroundColor",
  "color.text": "textColor",
  "color.gradient": "gradient",
  "typography.fontSize": "fontSize",
  "typography.fontFamily": "fontFamily"
};
var SUPPORTED_STYLES = ["border", "color", "spacing", "typography"];
var getValueFromObjectPath = (object, path) => {
  let value = object;
  path.forEach((fieldName) => {
    value = value?.[fieldName];
  });
  return value;
};
var flatBorderProperties = ["borderColor", "borderWidth", "borderStyle"];
var sides = ["top", "right", "bottom", "left"];
function getBorderStyleChanges(border, presetColor, userStyle) {
  if (!border && !presetColor) {
    return [];
  }
  const changes = [
    ...getFallbackBorderStyleChange("top", border, userStyle),
    ...getFallbackBorderStyleChange("right", border, userStyle),
    ...getFallbackBorderStyleChange("bottom", border, userStyle),
    ...getFallbackBorderStyleChange("left", border, userStyle)
  ];
  const { color: customColor, style, width } = border || {};
  const hasColorOrWidth = presetColor || customColor || width;
  if (hasColorOrWidth && !style) {
    sides.forEach((side) => {
      if (!userStyle?.[side]?.style) {
        changes.push({
          path: ["border", side, "style"],
          value: "solid"
        });
      }
    });
  }
  return changes;
}
function getFallbackBorderStyleChange(side, border, globalBorderStyle) {
  if (!border?.[side] || globalBorderStyle?.[side]?.style) {
    return [];
  }
  const { color, style, width } = border[side];
  const hasColorOrWidth = color || width;
  if (!hasColorOrWidth || style) {
    return [];
  }
  return [{ path: ["border", side, "style"], value: "solid" }];
}
function useChangesToPush(name, attributes, userConfig) {
  const supports = (0, import_data.useSelect)(
    (select) => {
      return (0, import_lock_unlock.unlock)(select(import_blocks.store)).getSupportedStyles(name);
    },
    [name]
  );
  const blockUserConfig = userConfig?.styles?.blocks?.[name];
  return (0, import_element.useMemo)(() => {
    const changes = supports.flatMap((key) => {
      if (!STYLE_PROPERTY[key]) {
        return [];
      }
      const { value: path } = STYLE_PROPERTY[key];
      const presetAttributeKey = path.join(".");
      const presetAttributeValue = attributes[STYLE_PATH_TO_PRESET_BLOCK_ATTRIBUTE[presetAttributeKey]];
      const value = presetAttributeValue ? `var:preset|${STYLE_PATH_TO_CSS_VAR_INFIX[presetAttributeKey]}|${presetAttributeValue}` : getValueFromObjectPath(attributes.style, path);
      if (key === "linkColor") {
        const linkChanges = value ? [{ path, value }] : [];
        const hoverPath = [
          "elements",
          "link",
          ":hover",
          "color",
          "text"
        ];
        const hoverValue = getValueFromObjectPath(
          attributes.style,
          hoverPath
        );
        if (hoverValue) {
          linkChanges.push({ path: hoverPath, value: hoverValue });
        }
        return linkChanges;
      }
      if (flatBorderProperties.includes(key) && value) {
        const borderChanges = [{ path, value }];
        sides.forEach((side) => {
          const currentPath = [...path];
          currentPath.splice(-1, 0, side);
          borderChanges.push({ path: currentPath, value });
        });
        return borderChanges;
      }
      return value ? [{ path, value }] : [];
    });
    getBorderStyleChanges(
      attributes.style?.border,
      attributes.borderColor,
      blockUserConfig?.border
    ).forEach((change) => changes.push(change));
    return changes;
  }, [supports, attributes, blockUserConfig]);
}
function PushChangesToGlobalStylesControl({
  name,
  attributes,
  setAttributes
}) {
  const { user: userConfig, setUser: setUserConfig } = (0, import_hooks2.useGlobalStyles)();
  const changes = useChangesToPush(name, attributes, userConfig);
  const { __unstableMarkNextChangeAsNotPersistent } = (0, import_data.useDispatch)(import_block_editor.store);
  const { createSuccessNotice } = (0, import_data.useDispatch)(import_notices.store);
  const pushChanges = (0, import_element.useCallback)(() => {
    if (changes.length === 0) {
      return;
    }
    if (changes.length > 0) {
      const { style: blockStyles } = attributes;
      const newBlockStyles = structuredClone(blockStyles);
      const newUserConfig = structuredClone(userConfig);
      for (const { path, value } of changes) {
        (0, import_set_nested_value.default)(newBlockStyles, path, void 0);
        (0, import_set_nested_value.default)(
          newUserConfig,
          ["styles", "blocks", name, ...path],
          value
        );
      }
      const newBlockAttributes = {
        borderColor: void 0,
        backgroundColor: void 0,
        textColor: void 0,
        gradient: void 0,
        fontSize: void 0,
        fontFamily: void 0,
        style: cleanEmptyObject(newBlockStyles)
      };
      __unstableMarkNextChangeAsNotPersistent();
      setAttributes(newBlockAttributes);
      setUserConfig(newUserConfig, { undoIgnore: true });
      createSuccessNotice(
        (0, import_i18n.sprintf)(
          // translators: %s: Title of the block e.g. 'Heading'.
          (0, import_i18n.__)("%s styles applied."),
          (0, import_blocks.getBlockType)(name).title
        ),
        {
          type: "snackbar",
          actions: [
            {
              label: (0, import_i18n.__)("Undo"),
              onClick() {
                __unstableMarkNextChangeAsNotPersistent();
                setAttributes(attributes);
                setUserConfig(userConfig, {
                  undoIgnore: true
                });
              }
            }
          ]
        }
      );
    }
  }, [
    __unstableMarkNextChangeAsNotPersistent,
    attributes,
    changes,
    createSuccessNotice,
    name,
    setAttributes,
    setUserConfig,
    userConfig
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.BaseControl,
    {
      className: "editor-push-changes-to-global-styles-control",
      help: (0, import_i18n.sprintf)(
        // translators: %s: Title of the block e.g. 'Heading'.
        (0, import_i18n.__)(
          "Apply this block\u2019s typography, spacing, dimensions, and color styles to all %s blocks."
        ),
        (0, import_blocks.getBlockType)(name).title
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { children: (0, import_i18n.__)("Styles") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            __next40pxDefaultSize: true,
            variant: "secondary",
            accessibleWhenDisabled: true,
            disabled: changes.length === 0,
            onClick: pushChanges,
            children: (0, import_i18n.__)("Apply globally")
          }
        )
      ]
    }
  );
}
function PushChangesToGlobalStyles(props) {
  const blockEditingMode = (0, import_block_editor.useBlockEditingMode)();
  const isBlockBasedTheme = (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getCurrentTheme()?.is_block_theme,
    []
  );
  const supportsStyles = SUPPORTED_STYLES.some(
    (feature) => (0, import_blocks.hasBlockSupport)(props.name, feature)
  );
  const isDisplayed = blockEditingMode === "default" && supportsStyles && isBlockBasedTheme;
  if (!isDisplayed) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.InspectorAdvancedControls, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PushChangesToGlobalStylesControl, { ...props }) });
}
var withPushChangesToGlobalStyles = (0, import_compose.createHigherOrderComponent)(
  (BlockEdit) => (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockEdit, { ...props }, "edit"),
    props.isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PushChangesToGlobalStyles, { ...props })
  ] })
);
(0, import_hooks.addFilter)(
  "editor.BlockEdit",
  "core/editor/push-changes-to-global-styles",
  withPushChangesToGlobalStyles
);
//# sourceMappingURL=index.cjs.map
