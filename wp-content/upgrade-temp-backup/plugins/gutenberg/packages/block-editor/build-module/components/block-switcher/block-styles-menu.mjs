// packages/block-editor/src/components/block-switcher/block-styles-menu.js
import { __ } from "@wordpress/i18n";
import { MenuGroup } from "@wordpress/components";
import { useMemo, useState } from "@wordpress/element";
import BlockStylesMenuItems from "../block-styles/menu-items.mjs";
import useStylesForBlocks from "../block-styles/use-styles-for-block.mjs";
import { replaceActiveStyle } from "../block-styles/utils.mjs";
import PreviewBlockPopover from "./preview-block-popover.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockStylesMenu({ hoveredBlock, onSwitch }) {
  const { clientId } = hoveredBlock;
  const [hoveredStyle, setHoveredStyle] = useState(null);
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
  return /* @__PURE__ */ jsxs(
    MenuGroup,
    {
      label: __("Styles"),
      className: "block-editor-block-switcher__styles__menugroup",
      children: [
        previewBlocks && /* @__PURE__ */ jsx(PreviewBlockPopover, { blocks: previewBlocks }),
        /* @__PURE__ */ jsx(
          BlockStylesMenuItems,
          {
            stylesToRender,
            activeStyle,
            onSelect,
            onHoverStyle: setHoveredStyle
          }
        )
      ]
    }
  );
}
export {
  BlockStylesMenu as default
};
//# sourceMappingURL=block-styles-menu.mjs.map
