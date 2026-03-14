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

// packages/block-editor/src/components/block-switcher/block-styles-menu.js
var block_styles_menu_exports = {};
__export(block_styles_menu_exports, {
  default: () => BlockStylesMenu
});
module.exports = __toCommonJS(block_styles_menu_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_menu_items = __toESM(require("../block-styles/menu-items.cjs"));
var import_use_styles_for_block = __toESM(require("../block-styles/use-styles-for-block.cjs"));
var import_utils = require("../block-styles/utils.cjs");
var import_preview_block_popover = __toESM(require("./preview-block-popover.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function BlockStylesMenu({ hoveredBlock, onSwitch }) {
  const { clientId } = hoveredBlock;
  const [hoveredStyle, setHoveredStyle] = (0, import_element.useState)(null);
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
  const previewBlocks = (0, import_element.useMemo)(() => {
    if (!hoveredStyle || !genericPreviewBlock) {
      return null;
    }
    const previewClassName = (0, import_utils.replaceActiveStyle)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.MenuGroup,
    {
      label: (0, import_i18n.__)("Styles"),
      className: "block-editor-block-switcher__styles__menugroup",
      children: [
        previewBlocks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_preview_block_popover.default, { blocks: previewBlocks }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_menu_items.default,
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
//# sourceMappingURL=block-styles-menu.cjs.map
