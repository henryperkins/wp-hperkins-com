// packages/block-editor/src/hooks/fit-text.js
import { addFilter } from "@wordpress/hooks";
import { hasBlockSupport } from "@wordpress/blocks";
import { useEffect, useCallback, useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
  ToggleControl,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import { optimizeFitText } from "../utils/fit-text-utils.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { useBlockElement } from "../components/block-list/use-block-props/use-block-refs.mjs";
import InspectorControls from "../components/inspector-controls/index.mjs";
import FitTextSizeWarning from "../components/fit-text-size-warning/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var EMPTY_OBJECT = {};
var MIN_FONT_SIZE_FOR_WARNING = 12;
var FIT_TEXT_SUPPORT_KEY = "typography.fitText";
function addAttributes(settings) {
  if (!hasBlockSupport(settings, FIT_TEXT_SUPPORT_KEY)) {
    return settings;
  }
  if (settings.attributes?.fitText) {
    return settings;
  }
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      fitText: {
        type: "boolean"
      }
    }
  };
}
function useFitText({ fitText, name, clientId }) {
  const [fontSize, setFontSize] = useState(null);
  const hasFitTextSupport2 = hasBlockSupport(name, FIT_TEXT_SUPPORT_KEY);
  const blockElement = useBlockElement(clientId);
  const { blockAttributes, parentId, blockMode } = useSelect(
    (select) => {
      if (!clientId || !hasFitTextSupport2 || !fitText) {
        return EMPTY_OBJECT;
      }
      const _blockMode = select(blockEditorStore).getBlockMode(clientId);
      if (_blockMode === "html") {
        return { blockMode: _blockMode };
      }
      return {
        blockAttributes: select(blockEditorStore).getBlockAttributes(clientId),
        parentId: select(blockEditorStore).getBlockRootClientId(clientId),
        blockMode: _blockMode
      };
    },
    [clientId, hasFitTextSupport2, fitText]
  );
  const applyFitText = useCallback(() => {
    if (!blockElement || !hasFitTextSupport2 || !fitText) {
      return;
    }
    const styleId = `fit-text-${clientId}`;
    let styleElement = blockElement.ownerDocument.getElementById(styleId);
    if (!styleElement) {
      styleElement = blockElement.ownerDocument.createElement("style");
      styleElement.id = styleId;
      blockElement.ownerDocument.head.appendChild(styleElement);
    }
    const blockSelector = `#block-${clientId}`;
    const applyFontSizeStyle = (size) => {
      if (size === 0) {
        styleElement.textContent = "";
      } else {
        styleElement.textContent = `${blockSelector} { font-size: ${size}px !important; }`;
      }
    };
    const optimalSize = optimizeFitText(blockElement, applyFontSizeStyle);
    setFontSize(optimalSize);
  }, [blockElement, clientId, hasFitTextSupport2, fitText]);
  useEffect(() => {
    if (!fitText || !blockElement || !clientId || !hasFitTextSupport2 || blockMode === "html") {
      return;
    }
    const currentElement = blockElement;
    const previousVisibility = currentElement.style.visibility;
    let hideFrameId = null;
    let calculateFrameId = null;
    let showTimeoutId = null;
    hideFrameId = window.requestAnimationFrame(() => {
      currentElement.style.visibility = "hidden";
      calculateFrameId = window.requestAnimationFrame(() => {
        applyFitText();
        showTimeoutId = setTimeout(() => {
          currentElement.style.visibility = previousVisibility;
        }, 10);
      });
    });
    let resizeObserver;
    if (window.ResizeObserver && currentElement.parentElement) {
      resizeObserver = new window.ResizeObserver(applyFitText);
      resizeObserver.observe(currentElement.parentElement);
      resizeObserver.observe(currentElement);
    }
    return () => {
      if (hideFrameId !== null) {
        window.cancelAnimationFrame(hideFrameId);
      }
      if (calculateFrameId !== null) {
        window.cancelAnimationFrame(calculateFrameId);
      }
      if (showTimeoutId !== null) {
        clearTimeout(showTimeoutId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      const styleId = `fit-text-${clientId}`;
      const styleElement = currentElement.ownerDocument.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [
    fitText,
    clientId,
    parentId,
    applyFitText,
    blockElement,
    hasFitTextSupport2,
    blockMode
  ]);
  useEffect(() => {
    if (fitText && blockElement && hasFitTextSupport2 && blockMode !== "html") {
      const frameId = window.requestAnimationFrame(() => {
        if (blockElement) {
          applyFitText();
        }
      });
      return () => window.cancelAnimationFrame(frameId);
    }
  }, [
    blockAttributes,
    fitText,
    applyFitText,
    blockElement,
    hasFitTextSupport2,
    blockMode
  ]);
  return { fontSize };
}
function FitTextControl({
  clientId,
  fitText = false,
  setAttributes,
  name,
  fontSize,
  style,
  warning
}) {
  if (!hasBlockSupport(name, FIT_TEXT_SUPPORT_KEY)) {
    return null;
  }
  return /* @__PURE__ */ jsx(InspectorControls, { group: "typography", children: /* @__PURE__ */ jsxs(
    ToolsPanelItem,
    {
      hasValue: () => fitText,
      label: __("Fit text"),
      onDeselect: () => setAttributes({ fitText: void 0 }),
      resetAllFilter: () => ({ fitText: void 0 }),
      panelId: clientId,
      children: [
        /* @__PURE__ */ jsx(
          ToggleControl,
          {
            label: __("Fit text"),
            checked: fitText,
            onChange: () => {
              const newFitText = !fitText || void 0;
              const updates = { fitText: newFitText };
              if (newFitText) {
                if (fontSize) {
                  updates.fontSize = void 0;
                }
                if (style?.typography?.fontSize) {
                  updates.style = {
                    ...style,
                    typography: {
                      ...style?.typography,
                      fontSize: void 0
                    }
                  };
                }
              }
              setAttributes(updates);
            },
            help: fitText ? __("Text will resize to fit its container.") : __(
              "The text will resize to fit its container, resetting other font size settings."
            )
          }
        ),
        warning
      ]
    }
  ) });
}
function addSaveProps(props, blockType, attributes) {
  if (!hasBlockSupport(blockType, FIT_TEXT_SUPPORT_KEY)) {
    return props;
  }
  const { fitText } = attributes;
  if (!fitText) {
    return props;
  }
  const className = props.className ? `${props.className} has-fit-text` : "has-fit-text";
  return {
    ...props,
    className
  };
}
function useBlockProps({ name, fitText }) {
  if (fitText && hasBlockSupport(name, FIT_TEXT_SUPPORT_KEY)) {
    return {
      className: "has-fit-text"
    };
  }
  return {};
}
addFilter(
  "blocks.registerBlockType",
  "core/fit-text/addAttribute",
  addAttributes
);
var hasFitTextSupport = (blockNameOrType) => {
  return hasBlockSupport(blockNameOrType, FIT_TEXT_SUPPORT_KEY);
};
function WithFitTextFontSize({ fitText, name, clientId, children }) {
  const { fontSize } = useFitText({ fitText, name, clientId });
  return children(fontSize);
}
var addFitTextControl = createHigherOrderComponent((BlockEdit) => {
  return function AddFitTextControl(props) {
    const { name, attributes, clientId, isSelected, setAttributes } = props;
    const { fitText } = attributes;
    const supportsFitText = hasBlockSupport(name, FIT_TEXT_SUPPORT_KEY);
    if (!supportsFitText) {
      return /* @__PURE__ */ jsx(BlockEdit, { ...props });
    }
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BlockEdit, { ...props }),
      fitText && /* @__PURE__ */ jsx(
        WithFitTextFontSize,
        {
          fitText,
          name,
          clientId,
          children: (fontSize) => isSelected && /* @__PURE__ */ jsx(
            FitTextControl,
            {
              clientId,
              fitText,
              setAttributes,
              name,
              fontSize: attributes.fontSize,
              style: attributes.style,
              warning: fontSize < MIN_FONT_SIZE_FOR_WARNING && /* @__PURE__ */ jsx(FitTextSizeWarning, {})
            }
          )
        }
      ),
      !fitText && isSelected && /* @__PURE__ */ jsx(
        FitTextControl,
        {
          clientId,
          fitText,
          setAttributes,
          name,
          fontSize: attributes.fontSize,
          style: attributes.style
        }
      )
    ] });
  };
}, "addFitTextControl");
addFilter(
  "editor.BlockEdit",
  "core/fit-text/add-fit-text-control",
  addFitTextControl
);
var fit_text_default = {
  useBlockProps,
  addSaveProps,
  attributeKeys: ["fitText", "fontSize", "style"],
  hasSupport: hasFitTextSupport,
  edit: () => null
};
export {
  FIT_TEXT_SUPPORT_KEY,
  FitTextControl,
  fit_text_default as default
};
//# sourceMappingURL=fit-text.mjs.map
