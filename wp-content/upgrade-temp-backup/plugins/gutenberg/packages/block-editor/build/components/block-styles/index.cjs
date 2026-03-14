"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-styles/index.js
var block_styles_exports = {};
__export(block_styles_exports, {
  default: () => block_styles_default
});
module.exports = __toCommonJS(block_styles_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_preview_block_popover = __toESM(require("../block-switcher/preview-block-popover.cjs"));
var import_use_styles_for_block = __toESM(require("./use-styles-for-block.cjs"));
var import_utils = require("../global-styles/utils.cjs");
var import_utils2 = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
function BlockStyles({ clientId, onSwitch = noop, onHoverClassName = noop }) {
  const {
    onSelect,
    stylesToRender,
    activeStyle,
    genericPreviewBlock,
    className
  } = (0, import_use_styles_for_block.default)({
    clientId,
    onSwitch
  });
  const [hoveredStyle, setHoveredStyle] = (0, import_element.useState)(null);
  const [blockStylesAnchor, setBlockStylesAnchor] = (0, import_element.useState)(null);
  const dropdownMenuProps = (0, import_utils.useToolsPanelDropdownMenuProps)();
  const previewBlocks = (0, import_element.useMemo)(() => {
    if (!hoveredStyle || !genericPreviewBlock) {
      return null;
    }
    const previewClassName = (0, import_utils2.replaceActiveStyle)(
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
  const debouncedSetHoveredStyle = (0, import_compose.debounce)(setHoveredStyle, 250);
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
  const defaultStyle = (0, import_utils2.getDefaultStyle)(stylesToRender);
  const hasValue = () => {
    return activeStyle?.name !== defaultStyle?.name;
  };
  const onDeselect = () => {
    onSelectStylePreview(defaultStyle);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalToolsPanel,
    {
      label: (0, import_i18n.__)("Styles"),
      resetAll: onDeselect,
      panelId: clientId,
      hasInnerWrapper: true,
      dropdownMenuProps,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalToolsPanelItem,
        {
          hasValue,
          label: (0, import_i18n.__)("Variation"),
          onDeselect,
          isShownByDefault: true,
          panelId: clientId,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              ref: setBlockStylesAnchor,
              className: "block-editor-block-styles",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-block-styles__variants", children: stylesToRender.map((style) => {
                  const buttonText = style.label || style.name;
                  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    import_components.Button,
                    {
                      __next40pxDefaultSize: true,
                      className: (0, import_clsx.default)(
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
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.__experimentalTruncate,
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
                previewBlocks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_preview_block_popover.default,
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
//# sourceMappingURL=index.cjs.map
