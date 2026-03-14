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

// packages/editor/src/components/post-title/post-title-raw.js
var post_title_raw_exports = {};
__export(post_title_raw_exports, {
  default: () => post_title_raw_default
});
module.exports = __toCommonJS(post_title_raw_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_html_entities = require("@wordpress/html-entities");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_constants = require("./constants.cjs");
var import_use_post_title_focus = __toESM(require("./use-post-title-focus.cjs"));
var import_use_post_title = __toESM(require("./use-post-title.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PostTitleRaw(_, forwardedRef) {
  const { placeholder } = (0, import_data.useSelect)((select) => {
    const { getSettings } = select(import_block_editor.store);
    const { titlePlaceholder } = getSettings();
    return {
      placeholder: titlePlaceholder
    };
  }, []);
  const [isSelected, setIsSelected] = (0, import_element.useState)(false);
  const { title, setTitle: onUpdate } = (0, import_use_post_title.default)();
  const { ref: focusRef } = (0, import_use_post_title_focus.default)(forwardedRef);
  function onChange(value) {
    onUpdate(value.replace(import_constants.REGEXP_NEWLINES, " "));
  }
  function onSelect() {
    setIsSelected(true);
  }
  function onUnselect() {
    setIsSelected(false);
  }
  const className = (0, import_clsx.default)(import_constants.DEFAULT_CLASSNAMES, {
    "is-selected": isSelected,
    "is-raw-text": true
  });
  const decodedPlaceholder = (0, import_html_entities.decodeEntities)(placeholder) || (0, import_i18n.__)("Add title");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.TextareaControl,
    {
      ref: focusRef,
      value: title,
      onChange,
      onFocus: onSelect,
      onBlur: onUnselect,
      label: placeholder,
      className,
      placeholder: decodedPlaceholder,
      hideLabelFromVision: true,
      autoComplete: "off",
      dir: "auto",
      rows: 1
    }
  );
}
var post_title_raw_default = (0, import_element.forwardRef)(PostTitleRaw);
//# sourceMappingURL=post-title-raw.cjs.map
