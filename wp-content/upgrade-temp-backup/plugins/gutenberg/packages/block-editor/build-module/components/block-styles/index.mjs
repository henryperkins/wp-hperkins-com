// packages/block-editor/src/components/block-styles/index.js
import clsx from "clsx";
import { useState, useMemo } from "@wordpress/element";
import { debounce } from "@wordpress/compose";
import {
  Button,
  __experimentalTruncate as Truncate,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PreviewBlockPopover from "../block-switcher/preview-block-popover.mjs";
import useStylesForBlocks from "./use-styles-for-block.mjs";
import { useToolsPanelDropdownMenuProps } from "../global-styles/utils.mjs";
import { getDefaultStyle, replaceActiveStyle } from "./utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var noop = () => {
};
function BlockStyles({ clientId, onSwitch = noop, onHoverClassName = noop }) {
  const {
    onSelect,
    stylesToRender,
    activeStyle,
    genericPreviewBlock,
    className
  } = useStylesForBlocks({
    clientId,
    onSwitch
  });
  const [hoveredStyle, setHoveredStyle] = useState(null);
  const [blockStylesAnchor, setBlockStylesAnchor] = useState(null);
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const previewBlocks = useMemo(() => {
    if (!hoveredStyle || !genericPreviewBlock) {
      return null;
    }
    const previewClassName = replaceActiveStyle(
      className,
      activeStyle,
      hoveredStyle
    );
    return [
      {
        ...genericPreviewBlock,
        attributes: {
          ...genericPreviewBlock.attributes || {},
          className: previewClassName
        }
      }
    ];
  }, [hoveredStyle, genericPreviewBlock, className, activeStyle]);
  if (!stylesToRender || stylesToRender.length === 0) {
    return null;
  }
  const debouncedSetHoveredStyle = debounce(setHoveredStyle, 250);
  const onSelectStylePreview = (style) => {
    onSelect(style);
    onHoverClassName(null);
    setHoveredStyle(null);
    debouncedSetHoveredStyle.cancel();
  };
  const styleItemHandler = (item) => {
    if (hoveredStyle === item) {
      debouncedSetHoveredStyle.cancel();
      return;
    }
    debouncedSetHoveredStyle(item);
    onHoverClassName(item?.name ?? null);
  };
  const defaultStyle = getDefaultStyle(stylesToRender);
  const hasValue = () => {
    return activeStyle?.name !== defaultStyle?.name;
  };
  const onDeselect = () => {
    onSelectStylePreview(defaultStyle);
  };
  return /* @__PURE__ */ jsx(
    ToolsPanel,
    {
      label: __("Styles"),
      resetAll: onDeselect,
      panelId: clientId,
      hasInnerWrapper: true,
      dropdownMenuProps,
      children: /* @__PURE__ */ jsx(
        ToolsPanelItem,
        {
          hasValue,
          label: __("Variation"),
          onDeselect,
          isShownByDefault: true,
          panelId: clientId,
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              ref: setBlockStylesAnchor,
              className: "block-editor-block-styles",
              children: [
                /* @__PURE__ */ jsx("div", { className: "block-editor-block-styles__variants", children: stylesToRender.map((style) => {
                  const buttonText = style.label || style.name;
                  return /* @__PURE__ */ jsx(
                    Button,
                    {
                      __next40pxDefaultSize: true,
                      className: clsx(
                        "block-editor-block-styles__item",
                        {
                          "is-active": activeStyle.name === style.name
                        }
                      ),
                      variant: "secondary",
                      label: buttonText,
                      onMouseEnter: () => styleItemHandler(style),
                      onFocus: () => styleItemHandler(style),
                      onMouseLeave: () => styleItemHandler(null),
                      onBlur: () => styleItemHandler(null),
                      onClick: () => onSelectStylePreview(style),
                      "aria-current": activeStyle.name === style.name,
                      children: /* @__PURE__ */ jsx(
                        Truncate,
                        {
                          numberOfLines: 1,
                          className: "block-editor-block-styles__item-text",
                          children: buttonText
                        }
                      )
                    },
                    style.name
                  );
                }) }),
                previewBlocks && /* @__PURE__ */ jsx(
                  PreviewBlockPopover,
                  {
                    blocks: previewBlocks,
                    placement: "left-start",
                    offset: 34,
                    anchor: blockStylesAnchor
                  }
                )
              ]
            }
          )
        }
      )
    }
  );
}
var block_styles_default = BlockStyles;
export {
  block_styles_default as default
};
//# sourceMappingURL=index.mjs.map
