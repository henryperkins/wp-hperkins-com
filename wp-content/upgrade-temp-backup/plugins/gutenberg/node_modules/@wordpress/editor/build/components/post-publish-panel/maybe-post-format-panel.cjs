"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/post-publish-panel/maybe-post-format-panel.js
var maybe_post_format_panel_exports = {};
__export(maybe_post_format_panel_exports, {
  default: () => PostFormatPanel
});
module.exports = __toCommonJS(maybe_post_format_panel_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_core_data = require("@wordpress/core-data");
var import_post_format = require("../post-format/index.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var getSuggestion = (supportedFormats, suggestedPostFormat) => {
  const formats = import_post_format.POST_FORMATS.filter(
    (format) => supportedFormats?.includes(format.id)
  );
  return formats.find((format) => format.id === suggestedPostFormat);
};
var PostFormatSuggestion = ({
  suggestedPostFormat,
  suggestionText,
  onUpdatePostFormat
}) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  import_components.Button,
  {
    __next40pxDefaultSize: true,
    variant: "link",
    onClick: () => onUpdatePostFormat(suggestedPostFormat),
    children: suggestionText
  }
);
function PostFormatPanel() {
  const { currentPostFormat, suggestion } = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute, getSuggestedPostFormat } = select(import_store.store);
    const supportedFormats = select(import_core_data.store).getThemeSupports().formats ?? [];
    return {
      currentPostFormat: getEditedPostAttribute("format"),
      suggestion: getSuggestion(
        supportedFormats,
        getSuggestedPostFormat()
      )
    };
  }, []);
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const onUpdatePostFormat = (format) => editPost({ format });
  const panelBodyTitle = [
    (0, import_i18n.__)("Suggestion:"),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-publish-panel__link", children: (0, import_i18n.__)("Use a post format") }, "label")
  ];
  if (!suggestion || suggestion.id === currentPostFormat) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { initialOpen: false, title: panelBodyTitle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
      "Your theme uses post formats to highlight different kinds of content, like images or videos. Apply a post format to see this special styling."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      PostFormatSuggestion,
      {
        onUpdatePostFormat,
        suggestedPostFormat: suggestion.id,
        suggestionText: (0, import_i18n.sprintf)(
          /* translators: %1s: post format */
          (0, import_i18n.__)('Apply the "%1$s" format.'),
          suggestion.caption
        )
      }
    ) })
  ] });
}
//# sourceMappingURL=maybe-post-format-panel.cjs.map
