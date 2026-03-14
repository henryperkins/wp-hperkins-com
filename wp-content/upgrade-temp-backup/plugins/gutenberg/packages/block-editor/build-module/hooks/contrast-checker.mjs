// packages/block-editor/src/hooks/contrast-checker.js
import { useLayoutEffect, useReducer } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as blocksStore } from "@wordpress/blocks";
import { getBlockSelector } from "@wordpress/global-styles-engine";
import ContrastChecker from "../components/contrast-checker/index.mjs";
import { useBlockElement } from "../components/block-list/use-block-props/use-block-refs.mjs";
import { jsx } from "react/jsx-runtime";
function getComputedValue(node, property) {
  return node.ownerDocument.defaultView.getComputedStyle(node).getPropertyValue(property);
}
function getBlockElementColors(blockEl, blockType) {
  if (!blockEl || !blockType) {
    return {};
  }
  const textSelector = getBlockSelector(blockType, "color.text", {
    fallback: true
  });
  const backgroundSelector = getBlockSelector(
    blockType,
    "color.background",
    { fallback: true }
  );
  const textElement = blockEl.querySelector(textSelector) || blockEl;
  const backgroundElement = blockEl.querySelector(backgroundSelector) || blockEl;
  const linkElement = blockEl.querySelector("a");
  const textColor = getComputedValue(textElement, "color");
  const linkColor = linkElement && linkElement.textContent ? getComputedValue(linkElement, "color") : void 0;
  let backgroundColorNode = backgroundElement;
  let backgroundColor = getComputedValue(
    backgroundColorNode,
    "background-color"
  );
  while (backgroundColor === "rgba(0, 0, 0, 0)" && backgroundColorNode.parentNode && backgroundColorNode.parentNode.nodeType === backgroundColorNode.parentNode.ELEMENT_NODE) {
    backgroundColorNode = backgroundColorNode.parentNode;
    backgroundColor = getComputedValue(
      backgroundColorNode,
      "background-color"
    );
  }
  return {
    textColor,
    backgroundColor,
    linkColor
  };
}
function reducer(prevColors, newColors) {
  const hasChanged = Object.keys(newColors).some(
    (key) => prevColors[key] !== newColors[key]
  );
  return hasChanged ? newColors : prevColors;
}
function BlockColorContrastChecker({ clientId, name }) {
  const blockEl = useBlockElement(clientId);
  const [colors, setColors] = useReducer(reducer, {});
  const blockType = useSelect(
    (select) => {
      return name ? select(blocksStore).getBlockType(name) : void 0;
    },
    [name]
  );
  useLayoutEffect(() => {
    if (!blockEl || !blockType) {
      return;
    }
    window.requestAnimationFrame(
      () => window.requestAnimationFrame(
        () => setColors(getBlockElementColors(blockEl, blockType))
      )
    );
  });
  useLayoutEffect(() => {
    if (!blockEl || !blockType) {
      return;
    }
    const observer = new window.MutationObserver(() => {
      setColors(getBlockElementColors(blockEl, blockType));
    });
    observer.observe(blockEl, {
      attributes: true,
      attributeFilter: ["class", "style"]
    });
    return () => {
      observer.disconnect();
    };
  }, [blockEl, blockType]);
  return /* @__PURE__ */ jsx(
    ContrastChecker,
    {
      backgroundColor: colors.backgroundColor,
      textColor: colors.textColor,
      linkColor: colors.linkColor,
      enableAlphaChecker: true
    }
  );
}
export {
  BlockColorContrastChecker as default
};
//# sourceMappingURL=contrast-checker.mjs.map
