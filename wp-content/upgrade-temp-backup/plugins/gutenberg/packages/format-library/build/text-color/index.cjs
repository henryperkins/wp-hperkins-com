var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// packages/format-library/src/text-color/index.js
var text_color_exports = {};
__export(text_color_exports, {
  textColor: () => textColor,
  transparentValue: () => transparentValue
});
module.exports = __toCommonJS(text_color_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_icons = require("@wordpress/icons");
var import_rich_text = require("@wordpress/rich-text");
var import_inline = __toESM(require("./inline.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var transparentValue = "rgba(0, 0, 0, 0)";
var name = "core/text-color";
var title = (0, import_i18n.__)("Highlight");
var EMPTY_ARRAY = [];
function getComputedStyleProperty(element, property) {
  const { ownerDocument } = element;
  const { defaultView } = ownerDocument;
  const style = defaultView.getComputedStyle(element);
  const value = style.getPropertyValue(property);
  if (property === "background-color" && value === transparentValue && element.parentElement) {
    return getComputedStyleProperty(element.parentElement, property);
  }
  return value;
}
function fillComputedColors(element, { color, backgroundColor }) {
  if (!color && !backgroundColor) {
    return;
  }
  return {
    color: color || getComputedStyleProperty(element, "color"),
    backgroundColor: backgroundColor === transparentValue ? getComputedStyleProperty(element, "background-color") : backgroundColor
  };
}
function TextColorEdit({
  value,
  onChange,
  isActive,
  activeAttributes,
  contentRef
}) {
  const [allowCustomControl, colors = EMPTY_ARRAY] = (0, import_block_editor.useSettings)(
    "color.custom",
    "color.palette"
  );
  const [isAddingColor, setIsAddingColor] = (0, import_element.useState)(false);
  const colorIndicatorStyle = (0, import_element.useMemo)(
    () => fillComputedColors(
      contentRef.current,
      (0, import_inline.getActiveColors)(value, name, colors)
    ),
    [contentRef, value, colors]
  );
  const hasColorsToChoose = !!colors.length || allowCustomControl;
  if (!hasColorsToChoose && !isActive) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_editor.RichTextToolbarButton,
      {
        className: "format-library-text-color-button",
        isActive,
        icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icons.Icon,
          {
            icon: Object.keys(activeAttributes).length ? import_icons.textColor : import_icons.color,
            style: colorIndicatorStyle
          }
        ),
        title,
        onClick: hasColorsToChoose ? () => setIsAddingColor(true) : () => onChange((0, import_rich_text.removeFormat)(value, name)),
        role: "menuitemcheckbox"
      }
    ),
    isAddingColor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_inline.default,
      {
        name,
        onClose: () => setIsAddingColor(false),
        activeAttributes,
        value,
        onChange,
        contentRef,
        isActive
      }
    )
  ] });
}
var textColor = {
  name,
  title,
  tagName: "mark",
  className: "has-inline-color",
  attributes: {
    style: "style",
    class: "class"
  },
  edit: TextColorEdit
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  textColor,
  transparentValue
});
//# sourceMappingURL=index.cjs.map
