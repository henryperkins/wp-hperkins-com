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

// packages/format-library/src/link/inline.js
var inline_exports = {};
__export(inline_exports, {
  default: () => inline_default
});
module.exports = __toCommonJS(inline_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_a11y = require("@wordpress/a11y");
var import_components = require("@wordpress/components");
var import_url = require("@wordpress/url");
var import_rich_text = require("@wordpress/rich-text");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_utils = require("./utils.cjs");
var import_index = require("./index.cjs");
var import_css_classes_setting = __toESM(require("./css-classes-setting.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var LINK_SETTINGS = [
  ...import_block_editor.LinkControl.DEFAULT_LINK_SETTINGS,
  {
    id: "nofollow",
    title: (0, import_i18n.__)("Mark as nofollow")
  },
  {
    id: "cssClasses",
    title: (0, import_i18n.__)("Additional CSS class(es)"),
    render: (setting, value, onChange) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_css_classes_setting.default,
        {
          setting,
          value,
          onChange
        }
      );
    }
  }
];
function InlineLinkUI({
  isActive,
  activeAttributes,
  value,
  onChange,
  onFocusOutside,
  stopAddingLink,
  contentRef,
  focusOnMount
}) {
  const richLinkTextValue = getRichTextValueFromSelection(value, isActive);
  const richTextText = richLinkTextValue.text;
  const { selectionChange } = (0, import_data.useDispatch)(import_block_editor.store);
  const { createPageEntity, userCanCreatePages, selectionStart } = (0, import_data.useSelect)(
    (select) => {
      const { getSettings, getSelectionStart } = select(import_block_editor.store);
      const _settings = getSettings();
      return {
        createPageEntity: _settings.__experimentalCreatePageEntity,
        userCanCreatePages: _settings.__experimentalUserCanCreatePages,
        selectionStart: getSelectionStart()
      };
    },
    []
  );
  const linkValue = (0, import_element.useMemo)(
    () => ({
      url: activeAttributes.url,
      type: activeAttributes.type,
      id: activeAttributes.id,
      opensInNewTab: activeAttributes.target === "_blank",
      nofollow: activeAttributes.rel?.includes("nofollow"),
      title: richTextText,
      cssClasses: activeAttributes.class
    }),
    [
      activeAttributes.class,
      activeAttributes.id,
      activeAttributes.rel,
      activeAttributes.target,
      activeAttributes.type,
      activeAttributes.url,
      richTextText
    ]
  );
  function removeLink() {
    const newValue = (0, import_rich_text.removeFormat)(value, "core/link");
    onChange(newValue);
    stopAddingLink();
    (0, import_a11y.speak)((0, import_i18n.__)("Link removed."), "assertive");
  }
  function onChangeLink(nextValue) {
    const hasLink = linkValue?.url;
    const isNewLink = !hasLink;
    nextValue = {
      ...linkValue,
      ...nextValue
    };
    const newUrl = (0, import_url.prependHTTPS)(nextValue.url);
    const linkFormat = (0, import_utils.createLinkFormat)({
      url: newUrl,
      type: nextValue.type,
      id: nextValue.id !== void 0 && nextValue.id !== null ? String(nextValue.id) : void 0,
      opensInNewWindow: nextValue.opensInNewTab,
      nofollow: nextValue.nofollow,
      cssClasses: nextValue.cssClasses
    });
    const newText = nextValue.title || newUrl;
    let newValue;
    if ((0, import_rich_text.isCollapsed)(value) && !isActive) {
      const inserted = (0, import_rich_text.insert)(value, newText);
      newValue = (0, import_rich_text.applyFormat)(
        inserted,
        linkFormat,
        value.start,
        value.start + newText.length
      );
      onChange(newValue);
      stopAddingLink();
      selectionChange({
        clientId: selectionStart.clientId,
        identifier: selectionStart.attributeKey,
        start: value.start + newText.length + 1
      });
      return;
    } else if (newText === richTextText) {
      const boundary = (0, import_utils.getFormatBoundary)(value, {
        type: "core/link"
      });
      newValue = (0, import_rich_text.applyFormat)(
        value,
        linkFormat,
        boundary.start,
        boundary.end
      );
    } else {
      newValue = (0, import_rich_text.create)({ text: newText });
      newValue = (0, import_rich_text.applyFormat)(newValue, linkFormat, 0, newText.length);
      const boundary = (0, import_utils.getFormatBoundary)(value, {
        type: "core/link"
      });
      const [valBefore, valAfter] = (0, import_rich_text.split)(
        value,
        boundary.start,
        boundary.start
      );
      const newValAfter = (0, import_rich_text.replace)(valAfter, richTextText, newValue);
      newValue = (0, import_rich_text.concat)(valBefore, newValAfter);
    }
    onChange(newValue);
    if (!isNewLink) {
      stopAddingLink();
    }
    if (!(0, import_utils.isValidHref)(newUrl)) {
      (0, import_a11y.speak)(
        (0, import_i18n.__)(
          "Warning: the link has been inserted but may have errors. Please test it."
        ),
        "assertive"
      );
    } else if (isActive) {
      (0, import_a11y.speak)((0, import_i18n.__)("Link edited."), "assertive");
    } else {
      (0, import_a11y.speak)((0, import_i18n.__)("Link inserted."), "assertive");
    }
  }
  const popoverAnchor = (0, import_rich_text.useAnchor)({
    editableContentElement: contentRef.current,
    settings: {
      ...import_index.link,
      isActive
    }
  });
  async function handleCreate(pageTitle) {
    const page = await createPageEntity({
      title: pageTitle,
      status: "draft"
    });
    return {
      id: page.id,
      type: page.type,
      title: page.title.rendered,
      url: page.link,
      kind: "post-type"
    };
  }
  function createButtonText(searchTerm) {
    return (0, import_element.createInterpolateElement)(
      (0, import_i18n.sprintf)(
        /* translators: %s: search term. */
        (0, import_i18n.__)("Create page: <mark>%s</mark>"),
        searchTerm
      ),
      { mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mark", {}) }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Popover,
    {
      anchor: popoverAnchor,
      animate: false,
      onClose: stopAddingLink,
      onFocusOutside,
      placement: "bottom",
      offset: 8,
      shift: true,
      focusOnMount,
      constrainTabbing: true,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_editor.LinkControl,
        {
          value: linkValue,
          onChange: onChangeLink,
          onRemove: removeLink,
          hasRichPreviews: true,
          createSuggestion: createPageEntity && handleCreate,
          withCreateSuggestion: userCanCreatePages,
          createSuggestionButtonText: createButtonText,
          hasTextControl: true,
          settings: LINK_SETTINGS,
          showInitialSuggestions: true,
          suggestionsQuery: {
            // always show Pages as initial suggestions
            initialSuggestionsSearchOptions: {
              type: "post",
              subtype: "page",
              perPage: 20
            }
          }
        }
      )
    }
  );
}
function getRichTextValueFromSelection(value, isActive) {
  let textStart = value.start;
  let textEnd = value.end;
  if (isActive) {
    const boundary = (0, import_utils.getFormatBoundary)(value, {
      type: "core/link"
    });
    textStart = boundary.start;
    textEnd = boundary.end;
  }
  return (0, import_rich_text.slice)(value, textStart, textEnd);
}
var inline_default = InlineLinkUI;
//# sourceMappingURL=inline.cjs.map
