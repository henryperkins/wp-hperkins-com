// packages/editor/src/hooks/push-changes-to-global-styles/index.js
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import {
  InspectorAdvancedControls,
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis,
  useBlockEditingMode
} from "@wordpress/block-editor";
import { BaseControl, Button } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import {
  __EXPERIMENTAL_STYLE_PROPERTY,
  getBlockType,
  hasBlockSupport,
  store as blocksStore
} from "@wordpress/blocks";
import { useMemo, useCallback } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as noticesStore } from "@wordpress/notices";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
import setNestedValue from "../../utils/set-nested-value.mjs";
import { useGlobalStyles } from "../../components/global-styles/hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { cleanEmptyObject } = unlock(blockEditorPrivateApis);
var STYLE_PROPERTY = {
  ...__EXPERIMENTAL_STYLE_PROPERTY,
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
  const supports = useSelect(
    (select) => {
      return unlock(select(blocksStore)).getSupportedStyles(name);
    },
    [name]
  );
  const blockUserConfig = userConfig?.styles?.blocks?.[name];
  return useMemo(() => {
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
  const { user: userConfig, setUser: setUserConfig } = useGlobalStyles();
  const changes = useChangesToPush(name, attributes, userConfig);
  const { __unstableMarkNextChangeAsNotPersistent } = useDispatch(blockEditorStore);
  const { createSuccessNotice } = useDispatch(noticesStore);
  const pushChanges = useCallback(() => {
    if (changes.length === 0) {
      return;
    }
    if (changes.length > 0) {
      const { style: blockStyles } = attributes;
      const newBlockStyles = structuredClone(blockStyles);
      const newUserConfig = structuredClone(userConfig);
      for (const { path, value } of changes) {
        setNestedValue(newBlockStyles, path, void 0);
        setNestedValue(
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
        sprintf(
          // translators: %s: Title of the block e.g. 'Heading'.
          __("%s styles applied."),
          getBlockType(name).title
        ),
        {
          type: "snackbar",
          actions: [
            {
              label: __("Undo"),
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
  return /* @__PURE__ */ jsxs(
    BaseControl,
    {
      className: "editor-push-changes-to-global-styles-control",
      help: sprintf(
        // translators: %s: Title of the block e.g. 'Heading'.
        __(
          "Apply this block\u2019s typography, spacing, dimensions, and color styles to all %s blocks."
        ),
        getBlockType(name).title
      ),
      children: [
        /* @__PURE__ */ jsx(BaseControl.VisualLabel, { children: __("Styles") }),
        /* @__PURE__ */ jsx(
          Button,
          {
            __next40pxDefaultSize: true,
            variant: "secondary",
            accessibleWhenDisabled: true,
            disabled: changes.length === 0,
            onClick: pushChanges,
            children: __("Apply globally")
          }
        )
      ]
    }
  );
}
function PushChangesToGlobalStyles(props) {
  const blockEditingMode = useBlockEditingMode();
  const isBlockBasedTheme = useSelect(
    (select) => select(coreStore).getCurrentTheme()?.is_block_theme,
    []
  );
  const supportsStyles = SUPPORTED_STYLES.some(
    (feature) => hasBlockSupport(props.name, feature)
  );
  const isDisplayed = blockEditingMode === "default" && supportsStyles && isBlockBasedTheme;
  if (!isDisplayed) {
    return null;
  }
  return /* @__PURE__ */ jsx(InspectorAdvancedControls, { children: /* @__PURE__ */ jsx(PushChangesToGlobalStylesControl, { ...props }) });
}
var withPushChangesToGlobalStyles = createHigherOrderComponent(
  (BlockEdit) => (props) => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockEdit, { ...props }, "edit"),
    props.isSelected && /* @__PURE__ */ jsx(PushChangesToGlobalStyles, { ...props })
  ] })
);
addFilter(
  "editor.BlockEdit",
  "core/editor/push-changes-to-global-styles",
  withPushChangesToGlobalStyles
);
//# sourceMappingURL=index.mjs.map
