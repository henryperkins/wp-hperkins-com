// packages/editor/src/components/post-publish-panel/maybe-post-format-panel.js
import { Button, PanelBody } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";
import { POST_FORMATS } from "../post-format/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var getSuggestion = (supportedFormats, suggestedPostFormat) => {
  const formats = POST_FORMATS.filter(
    (format) => supportedFormats?.includes(format.id)
  );
  return formats.find((format) => format.id === suggestedPostFormat);
};
var PostFormatSuggestion = ({
  suggestedPostFormat,
  suggestionText,
  onUpdatePostFormat
}) => /* @__PURE__ */ jsx(
  Button,
  {
    __next40pxDefaultSize: true,
    variant: "link",
    onClick: () => onUpdatePostFormat(suggestedPostFormat),
    children: suggestionText
  }
);
function PostFormatPanel() {
  const { currentPostFormat, suggestion } = useSelect((select) => {
    const { getEditedPostAttribute, getSuggestedPostFormat } = select(editorStore);
    const supportedFormats = select(coreStore).getThemeSupports().formats ?? [];
    return {
      currentPostFormat: getEditedPostAttribute("format"),
      suggestion: getSuggestion(
        supportedFormats,
        getSuggestedPostFormat()
      )
    };
  }, []);
  const { editPost } = useDispatch(editorStore);
  const onUpdatePostFormat = (format) => editPost({ format });
  const panelBodyTitle = [
    __("Suggestion:"),
    /* @__PURE__ */ jsx("span", { className: "editor-post-publish-panel__link", children: __("Use a post format") }, "label")
  ];
  if (!suggestion || suggestion.id === currentPostFormat) {
    return null;
  }
  return /* @__PURE__ */ jsxs(PanelBody, { initialOpen: false, title: panelBodyTitle, children: [
    /* @__PURE__ */ jsx("p", { children: __(
      "Your theme uses post formats to highlight different kinds of content, like images or videos. Apply a post format to see this special styling."
    ) }),
    /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(
      PostFormatSuggestion,
      {
        onUpdatePostFormat,
        suggestedPostFormat: suggestion.id,
        suggestionText: sprintf(
          /* translators: %1s: post format */
          __('Apply the "%1$s" format.'),
          suggestion.caption
        )
      }
    ) })
  ] });
}
export {
  PostFormatPanel as default
};
//# sourceMappingURL=maybe-post-format-panel.mjs.map
